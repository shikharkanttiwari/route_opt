import { Component, Input, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
export interface OrderStat {
  title: string;
  count: number;
  change: string;
  icon: string;
  trend: 'up' | 'down';
  color: string;
}

@Component({
  selector: 'app-order-stats-card',
  templateUrl: './order-stats-card.component.html',
  styleUrls: ['./order-stats-card.component.scss'],
  imports: [MatCardModule, MatListModule,MatIconModule],
})
export class OrderStatsCardComponent implements OnInit {
  @Input() stat!: OrderStat;
  
  constructor() { }

  ngOnInit(): void {
  }
}