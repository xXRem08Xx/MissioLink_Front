import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout.component';
import { LoginComponent } from '../../components/login/login.component';
import { RegisterComponent } from '../../components/register/register.component';

export const AUTH_LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },

      // ✅ Ajout du forgot-password
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('../../components/forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent
          ),
      },

      // ✅ Ajout du reset-password/:token
      {
        path: 'reset-password/:token',
        loadComponent: () =>
          import('../../components/reset-password/reset-password.component').then(
            (m) => m.ResetPasswordComponent
          ),
      },
    ],
  },
];
// Note: The above code assumes that the ForgotPasswordComponent and ResetPasswordComponent are lazy-loaded.