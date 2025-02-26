import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveredOrdersChartComponent } from './delivered-orders-chart.component';

describe('DeliveredOrdersChartComponent', () => {
  let component: DeliveredOrdersChartComponent;
  let fixture: ComponentFixture<DeliveredOrdersChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveredOrdersChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveredOrdersChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
