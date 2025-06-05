import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  message = '';

  constructor(private auth: AuthService) {}

  onSubmit(): void {
    this.auth.forgotPassword(this.email).subscribe({
      next: () => this.message = 'Un lien de réinitialisation a été envoyé.',
      error: () => this.message = 'Erreur lors de l’envoi.'
    });
  }
}
