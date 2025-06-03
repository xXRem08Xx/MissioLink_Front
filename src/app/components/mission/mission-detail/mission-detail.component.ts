import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import { MissionService, Mission } from '../../../services/mission/mission.service';
import { AuthService } from '../../../services/auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { MissionCandidatesComponent } from '../mission-candidates/mission-candidates.component';
import { MissionEditComponent } from '../mission-edit/mission-edit.component';
import { MissionStatus } from '../../../utils/mission-status';

@Component({
  selector: 'app-mission-detail',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzButtonModule, NzModalModule],
  templateUrl: './mission-detail.component.html',
  styleUrls: ['./mission-detail.component.css']
})
export class MissionDetailComponent implements OnInit, AfterViewInit {
  mission: Mission | null = null;
  loading = false;
  currentUserId: number | null = null;
  hasApplied = false;
  map!: L.Map;
  marker!: L.Marker;
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private missionService: MissionService,
    private authService: AuthService,
    private message: NzMessageService,
    private modal: NzModalService,
    private router: Router
  ) {
    // Initialiser l'observable pour la sélection du worker
    this.missionService.initWorkerSelectedObservable();
  }

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
        if (this.mission?.localisation && this.mission.latitude && this.mission.longitude) {
          setTimeout(() => {
            this.initMap();
          }, 100);
        }
      });
    }

    // Souscrire aux changements de worker
    this.missionService.workerSelected$.subscribe((missionId) => {
      if (missionId === id) {
        this.loading = true;
        this.missionService.getMission(id).subscribe(data => {
          this.mission = data;
          this.loading = false;
        });
      }
    });
  }

  ngAfterViewInit(): void {}

  get isAcceptedCandidate(): boolean {
    return !!(this.mission?.worker && this.mission.worker.id === this.currentUserId);
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

  confirmFinish(): void {
    this.modal.confirm({
      nzTitle: 'Terminer la mission',
      nzContent: 'Voulez-vous vraiment terminer cette mission ?',
      nzOnOk: () => this.finishMission()
    });
  }

  finishMission(): void {
    const missionId = this.mission?.id;
    if (!missionId) { return; }
    this.missionService.finishMission(missionId).subscribe({
      next: () => {
        this.message.success('La mission a été terminée avec succès.');
        this.loading = true;
        this.missionService.getMission(missionId).subscribe({
          next: (data) => {
            this.mission = data;
            this.loading = false;
          },
          error: (error: any) => {
            this.message.error('Erreur lors de la mise à jour de la mission.');
            this.loading = false;
          }
        });
      },
      error: (error: any) => {
        this.message.error('Erreur lors de la fin de la mission.');
      }
    });
  }

  cancelApplication(): void {
    if (!this.mission) { return; }
    if (this.isAcceptedCandidate) {
      this.message.error('Vous ne pouvez pas annuler votre candidature car vous êtes déjà accepté.');
      return;
    }
    if (this.mission.statutMission?.label === 'Terminée') {
      this.message.error('Cette mission est terminée et ne peut plus être modifiée.');
      return;
    }
    this.missionService.cancelApply(this.mission.id).subscribe(() => {
      this.message.success('Votre candidature a été annulée.');
      this.hasApplied = false;
    }, (error: any) => {
      this.message.error('Erreur lors de l\'annulation de la candidature.');
    });
  }

  openEditModal(): void {
    if (this.mission?.statutMission?.label === 'Terminée') {
      this.message.error('Cette mission est terminée et ne peut plus être modifiée.');
      return;
    }
    const modalRef = this.modal.create({
      nzTitle: 'Modifier la mission',
      nzContent: MissionEditComponent,
      nzFooter: null,
      nzData: {
        mission: this.mission
      }
    });
    modalRef.afterClose.subscribe(result => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  openCandidatesModal(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Liste des candidatures',
      nzContent: MissionCandidatesComponent,
      nzData: { missionId: this.mission?.id },
      nzFooter: null
    });
    modalRef.afterClose.subscribe(result => {
      if (result) {
        this.mission!.worker = result;
        this.message.success('Travailleur sélectionné.');
      }
    });
  }

  confirmDelete(): void {
    if (this.mission?.statutMission?.label === 'Terminée') {
      this.message.error('Cette mission est terminée et ne peut plus être supprimée.');
      return;
    }
    this.modal.confirm({
      nzTitle: 'Supprimer la mission',
      nzContent: 'Voulez-vous vraiment supprimer cette mission ?',
      nzOnOk: () => this.deleteMission()
    });
  }

  deleteMission(): void {
    if (!this.mission) { return; }
    this.missionService.deleteMission(this.mission.id).subscribe({
      next: () => {
        this.message.success('La mission a été supprimée avec succès.');
        this.router.navigate(['/missions']);
      },
      error: (error: any) => {
        this.message.error('Erreur lors de la suppression.');
      }
    });
  }

  initMap(): void {
    const lat = this.mission?.latitude;
    const lng = this.mission?.longitude;
    if (lat && lng && this.mapContainer) {
      this.map = L.map(this.mapContainer.nativeElement).setView([lat, lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
      const customIcon = L.icon({
        iconUrl: '/assets/pointeur.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
      });
      this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
      this.marker.bindPopup(this.mission?.localisation || 'Emplacement').openPopup();
      setTimeout(() => {
        this.map.invalidateSize();
      }, 100);
    }
  }
}
