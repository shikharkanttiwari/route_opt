import { Component, Input, OnInit } from '@angular/core';

import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

import { MatProgressBarModule } from '@angular/material/progress-bar';

export interface CustomerData {
  type: string;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-customer-chart',
  templateUrl: './customer-chart.component.html',
  styleUrls: ['./customer-chart.component.scss'],
  imports: [MatCardModule, MatListModule,MatProgressBarModule],
})
export class CustomerChartComponent implements OnInit {
  @Input() customerData: CustomerData[] = [];
  @Input() chartData: any;
  
  constructor() { }

  ngOnInit(): void {
  }
  
  getColorClass(color: string): string {
    switch (color) {
      case '#4CAF50': return 'primary';
      case '#2196F3': return 'accent';
      default: return 'warn';
    }
  }
}