import { Routes } from '@angular/router';
import { MissionsComponent } from './missions.component';
import { MissionDetailComponent } from '../mission-detail/mission-detail.component';

export const MISSIONS_ROUTES: Routes = [
  { path: '', component: MissionsComponent },
  { path: ':id', component: MissionDetailComponent },
];
