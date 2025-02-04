import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NzLayoutModule, NzMenuModule, NzIconModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  isCollapsed = false;
  constructor(private authService: AuthService, private router: Router) {}
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
