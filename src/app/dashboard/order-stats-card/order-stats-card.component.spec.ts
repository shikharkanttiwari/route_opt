import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatsCardComponent } from './order-stats-card.component';

describe('OrderStatsCardComponent', () => {
  let component: OrderStatsCardComponent;
  let fixture: ComponentFixture<OrderStatsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStatsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStatsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
