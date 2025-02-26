import { GoogleMapsModule, MapDirectionsService } from '@angular/google-maps';
import { Component, ViewChild, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


interface MenuItem {
  icon: string;
  title: string;
  route: string;
  active?: boolean;
}

@Component({
  selector: 'app-root',
  // standalone: true, 
  imports: [CommonModule,RouterModule,RouterOutlet, GoogleMapsModule,MatFormFieldModule, MatToolbarModule,MatIconModule,MatSidenavModule, MatListModule,MatBadgeModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isHandset$!: Observable<boolean>;
  
  @ViewChild('leftSidenav') leftSidenav!: MatSidenav;
  @ViewChild('rightSidenav') rightSidenav!: MatSidenav;
  
  title = 'route-optimization';

  menuItems: MenuItem[] = [
    { icon: 'dashboard', title: 'Dashboard', route: '/dashboard', active: true },
    { icon: 'add_circle_outline', title: 'New', route: '/new' },
    { icon: 'list_alt', title: 'Manage Order', route: '/orders' },
    { icon: 'star_rate', title: 'Reviews', route: '/reviews' },
    { icon: 'payment', title: 'Payments', route: '/payments' },
    { icon: 'assignment_return', title: 'Returns', route: '/returns' },
    { icon: 'directions_car', title: 'Drivers Manage', route: '/drivers' },
    { icon: 'message', title: 'SMS Logs', route: '/sms-logs' },
    { icon: 'store', title: 'Branch Manage', route: '/branches' },
    { icon: 'swap_horiz', title: 'Transfer', route: '/transfer' },
    { icon: 'schedule', title: 'Driver shift', route: '/driver-shifts' }
  ];

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(result => result.matches),
      shareReplay()
    );
  }

  toggleLeftSidenav(): void {
    this.leftSidenav.toggle();
  }

  toggleRightSidenav(): void {
    this.rightSidenav.toggle();
  }
}
