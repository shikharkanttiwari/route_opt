import { Component, Input, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
interface MenuItem {
  icon: string;
  title: string;
  route: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [MatCardModule, MatListModule,MatIconModule],
})
export class SidebarComponent implements OnInit {
  @Input() menuItems: MenuItem[] = [];
  
  constructor() { }

  ngOnInit(): void {
  }
}