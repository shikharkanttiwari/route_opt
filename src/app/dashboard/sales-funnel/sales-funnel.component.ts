import { Component, Input, OnInit } from '@angular/core';

export interface SalesFunnelStage {
  title: string;
  count: string;
}

@Component({
  selector: 'app-sales-funnel',
  templateUrl: './sales-funnel.component.html',
  styleUrls: ['./sales-funnel.component.scss']
})
export class SalesFunnelComponent implements OnInit {
  @Input() funnelStages: SalesFunnelStage[] = [];
  
  constructor() { }

  ngOnInit(): void {
  }
}