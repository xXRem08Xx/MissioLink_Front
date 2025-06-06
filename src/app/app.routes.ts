import { Routes } from '@angular/router';
import { NavLayoutComponent } from './layout/nav-layout/nav-layout.component';
import { AuthGuard } from './services/auth/auth.guard';
import { NoAuthGuard } from './services/auth/noauth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  {
    path: '',
    component: NavLayoutComponent,
    canActivate: [AuthGuard], 
    children: [
      { path: 'dashboard', loadChildren: () => import('./components/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES) },
      { path: 'profile', loadChildren: () => import('./components/profile/profile.routes').then(m => m.PROFILE_ROUTES) },
      { path: 'missions', loadChildren: () => import('./components/mission/missions/missions.routes').then(m => m.MISSIONS_ROUTES) },
      { path: 'mission/:id', loadChildren: () => import('./components/mission/mission-detail/mission-detail.routes').then(m => m.MISSION_DETAIL_ROUTES) },
      { path: 'mission/:id/edit', loadChildren: () => import('./components/mission/mission-edit/mission-edit.routes').then(m => m.MISSION_EDIT_ROUTES) },
      { path: 'mission/:id/candidates', loadChildren: () => import('./components/mission/mission-candidates/mission-candidates.routes').then(m => m.MISSIONS_CANDIDATES_ROUTES) },
      { path: 'mission/:id/create', loadChildren: () => import('./components/mission/mission-create/mission-create.routes').then(m => m.MISSIONS_CREATE_ROUTES) },
    ]
  },
  {
    path: '',
    loadChildren: () => import('./layout/auth-layout/auth-layout.routes').then(m => m.AUTH_LAYOUT_ROUTES),
    canActivate: [NoAuthGuard]
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];
