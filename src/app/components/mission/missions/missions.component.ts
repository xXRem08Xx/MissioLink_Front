import { Component, OnInit } from '@angular/core';
import { MissionService, Mission } from '../../../services/mission/mission.service';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AuthService } from '../../../services/auth/auth.service';
import { CategoryService, Category } from '../../../services/category/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzSelectModule, FormsModule],
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
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const parsed = JSON.parse(authData);
      this.currentUserId = parsed.user.id;
    }
    this.loading = true;
    this.missionService.getMissions().subscribe(data => {
      this.missions = data.filter(m => !this.currentUserId || m.employer?.id !== this.currentUserId);
      this.filteredMissions = this.missions;
      this.loading = false;
    });
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  onCategoryChange(values: Category[]): void {
    this.selectedCategories = values;
    if (values && values.length > 0) {
      this.filteredMissions = this.missions.filter(m => 
        m.categories && m.categories.some(c => values.some(v => v.label === c.label))
      );
    } else {
      this.filteredMissions = this.missions;
    }
  }

  openMissionDetail(mission: Mission): void {
    this.router.navigate(['/mission', mission.id]);
  }
}
