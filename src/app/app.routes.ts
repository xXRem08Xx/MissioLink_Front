import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthGuard } from './services/auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  { 
    path: '', 
    component: AuthLayoutComponent, 
    children: [
      { path: 'login', loadChildren: () => import('./components/login/login.routes').then(m => m.LOGIN_ROUTES) },
      { path: 'register', loadChildren: () => import('./components/register/register.routes').then(m => m.REGISTER_ROUTES) }
    ]
  },
  { 
    path: '', 
    component: MainLayoutComponent, 
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadChildren: () => import('./components/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES) }
    ]
  }
];
