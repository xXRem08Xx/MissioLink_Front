import { Component, OnInit } from '@angular/core';
import { MissionService, Mission } from '../../../services/mission/mission.service';
import { Router } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
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
  imports: [CommonModule, NzTableModule, NzSelectModule, FormsModule, NzModalWrapperModule, NzInputModule, NzCheckboxModule],
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css']
})
export class MissionsComponent implements OnInit {
  missions: Mission[] = [];
  filteredMissions: Mission[] = [];
  categories: Category[] = [];
  selectedCategories: Category[] = [];
  searchText = '';
  priceMin: number | null = null;
  priceMax: number | null = null;
  showMyMissions = false;
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
      // Conserver uniquement les missions non terminées
      this.missions = data.filter(m => m.statutMission?.label !== 'Terminée');
      this.applyFilters();
      this.loading = false;
    });
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  onCategoryChange(values: Category[]): void {
    this.selectedCategories = values;
    this.applyFilters();
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

  applyFilters(): void {
    let result = this.missions;

    if (!this.showMyMissions && this.currentUserId) {
      result = result.filter(m => m.employer?.id !== this.currentUserId);
    }

    if (this.selectedCategories && this.selectedCategories.length > 0) {
      result = result.filter(m =>
        m.categories && m.categories.some(c => this.selectedCategories.some(v => v.label === c.label))
      );
    }

    if (this.searchText.trim()) {
      const term = this.searchText.toLowerCase();
      result = result.filter(m =>
        m.titre.toLowerCase().includes(term) ||
        m.description.toLowerCase().includes(term)
      );
    }

    if (this.priceMin !== null) {
      result = result.filter(m => m.prix >= this.priceMin!);
    }
    if (this.priceMax !== null) {
      result = result.filter(m => m.prix <= this.priceMax!);
    }

    this.filteredMissions = result;
  }
}
