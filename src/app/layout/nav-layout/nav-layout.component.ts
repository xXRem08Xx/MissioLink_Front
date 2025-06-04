import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { LogoutComponent } from '../../components/logout/logout.component';

@Component({
  selector: 'app-nav-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, LogoutComponent],
  templateUrl: './nav-layout.component.html',
  styleUrls: ['./nav-layout.component.css']
})
export class NavLayoutComponent {
  isMenuOpen = false;
  constructor(private router: Router, private authService: AuthService) {}
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
  goToMissions(): void {
    this.router.navigate(['/missions']);
  } 
}
