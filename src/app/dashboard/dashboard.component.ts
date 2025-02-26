import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface OrderStat {
  title: string;
  count: number;
  change: string;
  icon: string;
  trend: 'up' | 'down';
  color: string;
}

interface CustomerData {
  type: string;
  percentage: number;
  color: string;
}

interface SalesFunnelStage {
  title: string;
  count: string;
}

interface Message {
  name: string;
  message: string;
  avatar: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [MatCardModule, MatIconModule, MatSelectModule, MatListModule, MatProgressBarModule]
})
export class DashboardComponent implements OnInit {
  // Order statistics
  orderStats: OrderStat[] = [
    { title: 'Orders', count: 500, change: '+100%', icon: 'shopping_cart', trend: 'up', color: 'primary' },
    { title: 'Orders delivered', count: 375, change: '+75%', icon: 'local_shipping', trend: 'up', color: 'primary' },
    { title: 'Orders in progress', count: 75, change: '+8.05%', icon: 'hourglass_top', trend: 'up', color: 'primary' },
    { title: 'Orders failed', count: 125, change: '-25%', icon: 'error_outline', trend: 'down', color: 'warn' }
  ];
  
  // Chart data for delivered orders
  deliveredOrdersChart = {
    labels: ['April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sold',
        data: [30, 45, 60, 75, 65, 75, 70, 75, 70],
        fill: false,
        borderColor: '#FF5722',
        tension: 0.4
      },
      {
        label: 'Rent',
        data: [40, 30, 45, 35, 45, 35, 40, 30, 35],
        fill: false,
        borderColor: '#4CAF50',
        tension: 0.4
      }
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  };
  
  // Customer data
  customerData: CustomerData[] = [
    { type: 'Current Customer', percentage: 50, color: '#4CAF50' },
    { type: 'New Customer', percentage: 30, color: '#2196F3' },
    { type: 'Retargeted Customer', percentage: 20, color: '#FF5722' }
  ];
  
  // Customer chart data
  customerChartData = {
    labels: ['Current', 'New', 'Retargeted'],
    datasets: [{
      data: [50, 30, 20],
      backgroundColor: ['#4CAF50', '#2196F3', '#FF5722'],
      hoverBackgroundColor: ['#388E3C', '#1976D2', '#E64A19'],
      borderWidth: 0
    }],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%'
    }
  };
  
  // Sales funnel data
  salesFunnel: SalesFunnelStage[] = [
    { title: 'Total Market', count: '142,901' },
    { title: 'Prospects', count: '101,020' },
    { title: 'Leads', count: '60,314' },
    { title: 'Sales', count: '54,280' }
  ];
  
  // Messenger data
  messages: Message[] = [
    {
      name: 'Marvin Mckinney',
      message: 'Amet minim mollit non deserunt ullamco est sit',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Cameron Williamson',
      message: 'Amet minim mollit non deserunt ullamco est sit',
      avatar: 'https://randomuser.me/api/portraits/men/33.jpg'
    }
  ];
  
  selectedYear = '2022';
  
  constructor() { }

  ngOnInit(): void {
  }
}