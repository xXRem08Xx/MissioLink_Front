import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MissionService, Mission } from '../../../services/mission/mission.service';
import { AuthService } from '../../../services/auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-mission-detail',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzButtonModule, NzModalModule],
  templateUrl: './mission-detail.component.html',
  styleUrls: ['./mission-detail.component.css']
})
export class MissionDetailComponent implements OnInit {
  mission: Mission | null = null;
  loading = false;
  currentUserId: number | null = null;
  hasApplied = false;

  constructor(
    private route: ActivatedRoute,
    private missionService: MissionService,
    private authService: AuthService,
    private message: NzMessageService,
    private modal: NzModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const parsed = JSON.parse(authData);
      this.currentUserId = parsed.user.id;
    }
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loading = true;
      this.missionService.getMission(id).subscribe(data => {
        this.mission = data;
        if (this.mission?.candidatures && this.currentUserId) {
          this.hasApplied = this.mission.candidatures.some(c => c.user && c.user.id === this.currentUserId);
        }
        this.loading = false;
      });
    }
  }

  confirmApply(): void {
    this.modal.confirm({
      nzTitle: 'Confirmer votre candidature',
      nzContent: 'Voulez-vous postuler à cette mission ?',
      nzOnOk: () => this.applyToMission()
    });
  }

  applyToMission(): void {
    if (!this.mission) { return; }
    this.missionService.apply(this.mission.id).subscribe(() => {
      this.message.success('Vous avez postulé à la mission.');
      this.hasApplied = true;
    }, (error: any) => {
      this.message.error('Erreur lors de la postulation.');
    });
  }

  confirmCancel(): void {
    this.modal.confirm({
      nzTitle: 'Annuler votre candidature',
      nzContent: 'Voulez-vous vraiment annuler votre candidature ?',
      nzOnOk: () => this.cancelApplication()
    });
  }

  cancelApplication(): void {
    if (!this.mission) { return; }
    this.missionService.cancelApply(this.mission.id).subscribe(() => {
      this.message.success('Votre candidature a été annulée.');
      this.hasApplied = false;
    }, (error: any) => {
      this.message.error('Erreur lors de l\'annulation.');
    });
  }

  editMission(): void {
    this.router.navigate(['/missions', this.mission?.id, 'edit']);
  }

  confirmDelete(): void {
    this.modal.confirm({
      nzTitle: 'Supprimer la mission',
      nzContent: 'Confirmez-vous la suppression de cette mission ? Cette action est irréversible.',
      nzOnOk: () => this.deleteMission()
    });
  }

  deleteMission(): void {
    if (!this.mission) { return; }
    this.missionService.deleteMission(this.mission.id).subscribe(() => {
      this.message.success('Mission supprimée.');
      this.router.navigate(['/missions']);
    }, (error: any) => {
      this.message.error('Erreur lors de la suppression.');
    });
  }

  viewCandidates(): void {
    this.router.navigate(['/missions', this.mission?.id, 'candidates']);
  }
}
