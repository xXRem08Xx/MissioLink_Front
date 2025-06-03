import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MissionService } from '../../../services/mission/mission.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  NzModalService,
  NzModalRef,
  NZ_MODAL_DATA,
  NzModalModule,
} from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mission-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NzModalModule],
  templateUrl: './mission-edit.component.html',
  styleUrls: ['./mission-edit.component.css'],
  providers: [
    { provide: NZ_MODAL_DATA, useValue: {} },
    { provide: NzModalRef, useValue: { close: (result?: any) => {} } },
  ],
})
export class MissionEditComponent implements OnInit {
  editForm!: FormGroup;
  mission: any;

  constructor(
    private fb: FormBuilder,
    private missionService: MissionService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private modal: NzModalService,
    @Inject(NZ_MODAL_DATA) public data: { mission: any }
  ) {}

  ngOnInit(): void {
    this.mission = history.state.mission;
    if (!this.mission) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.missionService.getMission(+id).subscribe((m) => {
          this.mission = m;
          this.initializeForm();
        });
      }
    } else {
      this.initializeForm();
    }
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      titre: [this.mission.titre, Validators.required],
      description: [this.mission.description, Validators.required],
      prix: [this.mission.prix, [Validators.required, Validators.min(0)]],
      localisation: [this.mission.localisation, Validators.required],
    });
  }

  submit(): void {
    this.modal.confirm({
      nzTitle: 'Confirmer la modification',
      nzContent: 'Voulez-vous enregistrer les modifications ?',
      nzOkText: 'Oui',
      nzCancelText: 'Non',
      nzOnOk: () => {
        this.missionService
          .updateMission(this.mission.id, this.editForm.value)
          .subscribe(
            (response) => {
              this.message.success('Mission modifiée.');
              this.router.navigate(['/missions']);
              this.modal.closeAll();
            },
            (error) => {
              this.message.error('Erreur lors de la modification.');
            }
          );
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/missions']);
  }
}
