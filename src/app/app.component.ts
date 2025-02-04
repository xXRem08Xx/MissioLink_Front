import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterOutlet } from '@angular/router';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NzLayoutModule, NzMenuModule, NzIconModule, RouterOutlet, NzDropDownModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'missiolink_front';
  isCollapsed = false;
}
