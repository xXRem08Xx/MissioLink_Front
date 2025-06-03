import { Component, OnInit } from '@angular/core';
import { MissionService, Mission } from '../../../services/mission/mission.service';
import { Router } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AuthService } from '../../../services/auth/auth.service';
import { CategoryService, Category } from '../../../services/category/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MissionCreateComponent } from '../mission-create/mission-create.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalWrapperModule } from '../../dependance/nzmodalservice.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MissionStatus } from '../../../utils/mission-status';

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzSelectModule, FormsModule, NzModalWrapperModule],
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css']
})
export class MissionsComponent implements OnInit {
  missions: Mission[] = [];
  filteredMissions: Mission[] = [];
  categories: Category[] = [];
  selectedCategories: Category[] = [];
  currentUserId: number | null = null;
  loading = false;

  constructor(
    private missionService: MissionService,
    private router: Router,
    private authService: AuthService,
    private categoryService: CategoryService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const parsed = JSON.parse(authData);
      this.currentUserId = parsed.user.id;
    }
    this.loading = true;
    this.missionService.getMissions().subscribe(data => {
      // Filtrer les missions qui ne sont pas terminées
      this.missions = data.filter(m => 
        m.statutMission?.label !== 'Terminée' && 
        (!this.currentUserId || m.employer?.id !== this.currentUserId)
      );
      this.filteredMissions = this.missions;
      this.loading = false;
    });
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  onCategoryChange(values: Category[]): void {
    this.selectedCategories = values;
    this.filteredMissions = values && values.length > 0
      ? this.missions.filter(m => m.categories && m.categories.some(c => values.some(v => v.label === c.label)))
      : this.missions;
  }

  openMissionDetail(mission: Mission): void {
    this.router.navigate(['/mission', mission.id]);
  }

  openCreateModal(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Créer une nouvelle mission',
      nzContent: MissionCreateComponent,
      nzFooter: null
    });
    modalRef.afterClose.subscribe(result => {
      if (result) {
        this.ngOnInit();
      }
    });
  }
}
