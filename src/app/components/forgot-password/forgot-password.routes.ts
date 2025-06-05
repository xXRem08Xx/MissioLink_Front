import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

export const routes: Routes = [
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  // ... autres routes
];
