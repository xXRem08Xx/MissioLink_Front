import { Component, OnInit } from '@angular/core';
import { MissionService, Mission, Candidature } from '../../services/mission/mission.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzButtonModule,
    NzGridModule,
    NzSpinModule
  ],
  providers: [NzModalService, NzMessageService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // Votre code de composant ici...
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
    this.missionService.getMissions().subscribe((data) => {
      this.createdMissions = data.filter(
        (m) => m.employer && m.employer.id === this.currentUserId
      );
      this.candidateMissions = data.filter((m) => {
        if (m.employer && m.employer.id === this.currentUserId) {
          return false;
        }
        const candidature: Candidature | undefined = m.candidatures
          ? m.candidatures.find(
              (c) => c.user && c.user.id === this.currentUserId
            )
          : undefined;
        if (!candidature) {
          return false;
        }
        if (m.worker && m.worker.id === this.currentUserId) {
          return true;
        }
        if (
          candidature.statutCandidature &&
          candidature.statutCandidature.label === 'Refusée'
        ) {
          const submissionDate = new Date(candidature.dateSoumission);
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return submissionDate >= oneWeekAgo;
        }
        return true;
      });
      this.loading = false;
    });
  }

  viewMissionDetail(mission: Mission): void {
    this.router.navigate(['/mission', mission.id]);
  }

  editMission(mission: Mission): void {
    this.router.navigate(['/mission', mission.id, 'edit'], {
      state: { mission },
    });
  }

  deleteMission(mission: Mission): void {
    this.missionService.deleteMission(mission.id).subscribe(() => {
      this.message.success('Mission supprimée.');
      this.ngOnInit();
    });
  }

  getCandidateStatusClass(mission: Mission): string {
    const status = this.getCandidateStatus(mission);
    switch (status) {
      case 'En attente':
        return 'en-attente';
      case 'Acceptée':
        return 'acceptee';
      case 'Refusée':
        return 'refusee';
      default:
        return 'non-candidat';
    }
  }

  getCandidateStatus(mission: Mission): string {
    if (!this.currentUserId) {
      return 'Non-candidat';
    }
    const candidature: Candidature | undefined = mission.candidatures
      ? mission.candidatures.find(
          (c) => c.user && c.user.id === this.currentUserId
        )
      : undefined;
    if (!candidature) {
      return 'Non-candidat';
    }
    if (mission.worker && mission.worker.id === this.currentUserId) {
      return 'Acceptée';
    }
    const label = candidature.statutCandidature?.label;
    if (label === 'En attente') {
      return 'En attente';
    }
    if (label === 'Refusée') {
      return 'Refusée';
    }
    return 'Non-candidat';
  }
}
