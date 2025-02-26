import { Component, OnInit } from '@angular/core';
import { MissionService, Mission } from '../../../services/mission/mission.service';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AuthService } from '../../../services/auth/auth.service';
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
  categories: string[] = [];
  selectedCategory: string | null = null;
  currentUserId: number | null = null;
  loading = false;

  constructor(
    private missionService: MissionService,
    private router: Router,
    private authService: AuthService
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
      const catSet = new Set<string>();
      this.missions.forEach(m => {
        if (m.categories && Array.isArray(m.categories)) {
          m.categories.forEach(cat => {
            if (cat.label) { catSet.add(cat.label); }
          });
        }
      });
      this.categories = Array.from(catSet);
      this.filteredMissions = this.missions;
      this.loading = false;
    });
  }

  onCategoryChange(value: string | null): void {
    this.selectedCategory = value;
    this.filteredMissions = value 
      ? this.missions.filter(m => m.categories?.some(c => c.label === value))
      : this.missions;
  }

  openMissionDetail(mission: Mission): void {
    this.router.navigate(['/mission', mission.id]);
  }
}
