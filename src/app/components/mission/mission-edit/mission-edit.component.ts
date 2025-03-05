import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MissionService } from '../../../services/mission/mission.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mission-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './mission-edit.component.html',
  styleUrls: ['./mission-edit.component.css']
})
export class MissionEditComponent implements OnInit {
  editForm!: FormGroup;
  mission: any;

  constructor(
    private fb: FormBuilder,
    private missionService: MissionService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.mission = history.state.mission;
    if (!this.mission) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.missionService.getMission(+id).subscribe(m => {
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
      localisation: [this.mission.localisation, Validators.required]
    });
  }

  submit(): void {
    if (this.editForm.valid) {
      this.missionService.updateMission(this.mission.id, this.editForm.value).subscribe(response => {
        this.message.success('Mission modifiée.');
        this.router.navigate(['/missions']);
      }, error => {
        this.message.error('Erreur lors de la modification.');
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/missions']);
  }
}
