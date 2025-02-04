import { Component, OnInit } from '@angular/core';
import { MissionService, Mission } from '../../../services/mission/mission.service';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [CommonModule, NzCardModule],
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css']
})
export class MissionsComponent implements OnInit {
  missions: Mission[] = [];
  loading = false;

  constructor(private missionService: MissionService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true;
    this.missionService.getMissions().subscribe((data) => {
      this.missions = data;
      this.loading = false;
    });
  }

  openMissionDetail(mission: Mission): void {
    this.router.navigate(['/mission', mission.id]);
  }
}
