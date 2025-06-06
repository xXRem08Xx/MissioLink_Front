import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from '../../components/logout/logout.component';

@Component({
  selector: 'app-nav-layout',
  standalone: true,
  imports: [NzDropDownModule, CommonModule, RouterOutlet, NzLayoutModule, NzMenuModule, NzAvatarModule, NzIconModule, LogoutComponent],
  templateUrl: './nav-layout.component.html',
  styleUrls: ['./nav-layout.component.css']
})
export class NavLayoutComponent {
  isCollapsed = true;
  constructor(private router: Router, private authService: AuthService) {}
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
