import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-delivered-orders-chart',
  templateUrl: './delivered-orders-chart.component.html',
  styleUrls: ['./delivered-orders-chart.component.scss'],
  imports: [MatCardModule,MatFormFieldModule,MatSelectModule]
})
export class DeliveredOrdersChartComponent implements OnInit {
  @Input() chartData!: any;
  @Input() selectedYear: string = '2022';
  
  years: string[] = ['2022', '2021'];
  
  constructor() { }

  ngOnInit(): void {
  }
}