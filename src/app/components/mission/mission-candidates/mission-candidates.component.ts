import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionService } from '../../../services/mission/mission.service';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-mission-candidates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mission-candidates.component.html',
  styleUrls: ['./mission-candidates.component.css']
})
export class MissionCandidatesComponent implements OnInit {
  candidates: any[] = [];
  loading = false;

  constructor(
    private missionService: MissionService,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    @Inject(NZ_MODAL_DATA) public data: { missionId: number }
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.missionService.viewCandidates(this.data.missionId).subscribe(data => {
      this.candidates = data;
      this.loading = false;
    }, error => {
      this.message.error('Erreur lors de la récupération des candidatures.');
      this.loading = false;
    });
  }

  accept(candidateId: number): void {
    this.missionService.acceptCandidate(this.data.missionId, candidateId).subscribe(() => {
      const acceptedCandidate = this.candidates.find(c => c.id === candidateId);
      this.modalRef.close(acceptedCandidate);
      this.message.success('Candidature acceptée.');
    }, error => {
      this.message.error('Erreur lors de l\'acceptation.');
    });
  }

  close(): void {
    this.modalRef.close();
  }
}
