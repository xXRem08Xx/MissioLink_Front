import { Component, OnInit } from '@angular/core';
import { MissionService, Mission } from '../../../services/mission/mission.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-mission-detail',
  standalone: true,
  imports: [CommonModule, NzCardModule],
  templateUrl: './mission-detail.component.html',
  styleUrls: ['./mission-detail.component.css']
})
export class MissionDetailComponent implements OnInit {
  mission: Mission | null = null;
  loading = false;

  constructor(private missionService: MissionService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loading = true;
      this.missionService.getMission(id).subscribe(data => {
        this.mission = data;
        this.loading = false;
      });
    }
  }
}
