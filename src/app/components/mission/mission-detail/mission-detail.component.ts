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
        if (this.mission?.localisation && this.mission.latitude && this.mission.longitude) {
          setTimeout(() => {
            this.initMap();
          }, 100);
        }
      });
    }
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

  cancelApplication(): void {
    if (!this.mission) { return; }
    if (this.isAcceptedCandidate) {
      this.message.error('Vous ne pouvez pas annuler votre candidature car vous êtes déjà accepté.');
      return;
    }
    this.missionService.cancelApply(this.mission.id).subscribe(() => {
      this.message.success('Votre candidature a été annulée.');
      this.hasApplied = false;
    }, (error: any) => {
      this.message.error('Erreur lors de l\'annulation.');
    });
  }

  openEditModal(): void {
    this.router.navigate(['/mission', this.mission?.id, 'edit'], { state: { mission: this.mission } });
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

  finishMission(): void {
    this.message.success('Mission terminée.');
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
