import { Component, OnInit } from '@angular/core';
import { MissionService, Mission } from '../../services/mission/mission.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NzModalModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  createdMissions: Mission[] = [];
  candidateMissions: Mission[] = [];
  currentUserId: number | null = null;
  loading = false;

  constructor(
    private missionService: MissionService,
    private authService: AuthService,
    private router: Router,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const parsed = JSON.parse(authData);
      this.currentUserId = parsed.user.id;
    }
    this.loading = true;
    this.missionService.getMissions().subscribe(data => {
      this.createdMissions = data.filter(m => m.employer && m.employer.id === this.currentUserId);
      this.candidateMissions = data.filter(m => {
        const isCandidate = m.candidatures && m.candidatures.some(c => c.user && c.user.id === this.currentUserId);
        const isWorker = m.worker && m.worker.id === this.currentUserId;
        return isCandidate || isWorker;
      });
      this.loading = false;
    });
  }

  viewMissionDetail(mission: Mission): void {
    this.router.navigate(['/mission', mission.id]);
  }

  editMission(mission: Mission): void {
    this.router.navigate(['/mission', mission.id, 'edit'], { state: { mission } });
  }
  
  deleteMission(mission: Mission): void {
    this.modal.confirm({
      nzTitle: 'Confirmer la suppression',
      nzContent: 'Voulez-vous vraiment supprimer cette mission ? Cette action est irréversible.',
      nzOkText: 'Oui',
      nzCancelText: 'Non',
      nzOnOk: () => {
        this.missionService.deleteMission(mission.id).subscribe(() => {
          this.message.success('Mission supprimée.');
          this.ngOnInit();
        }, error => {
          this.message.error('Erreur lors de la suppression.');
        });
      }
    });
  }
}
