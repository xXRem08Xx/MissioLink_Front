import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MissionService, Mission } from '../../../services/mission/mission.service';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-mission-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mission-edit.component.html',
  styleUrls: ['./mission-edit.component.css']
})
export class MissionEditComponent implements OnInit {
  editForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private missionService: MissionService,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    @Inject(NZ_MODAL_DATA) public data: { mission: Mission }
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      titre: [this.data.mission.titre, Validators.required],
      description: [this.data.mission.description, Validators.required],
      prix: [this.data.mission.prix, [Validators.required, Validators.min(0)]],
      localisation: [this.data.mission.localisation, Validators.required]
    });
  }

  submit(): void {
    if (this.editForm.valid) {
      this.missionService.updateMission(this.data.mission.id, this.editForm.value).subscribe(response => {
        this.message.success('Mission modifiée.');
        this.modalRef.close(response);
      }, error => {
        this.message.error('Erreur lors de la modification.');
      });
    }
  }

  cancel(): void {
    this.modalRef.close();
  }
}
