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
      { path: 'profile', loadChildren: () => import('./components/profile/profile.routes').then(m => m.PROFILE_ROUTES) }
    ]
  },
  {
    path: '',
    loadChildren: () => import('./layout/auth-layout/auth-layout.routes').then(m => m.AUTH_LAYOUT_ROUTES),
    canActivate: [NoAuthGuard]
  }
];
