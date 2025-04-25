import { Component, inject, OnInit } from '@angular/core';
import { OrdersService } from '../../Services/orders.service';
import { ChartData, ChartOptions } from 'chart.js';
import { ProductService } from '../../Services/products.service';
@Component({
  selector: 'app-user-home',
  standalone: false,
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {

  lineChartData!: ChartData<'line'>;
  barChartData!: ChartData<'bar'>;

  lineChartOptions!: ChartOptions<'line'>;
  barChartOptions!: ChartOptions<'bar'>;

  orderService: OrdersService = inject(OrdersService);
  productService: ProductService = inject(ProductService);
  isLoading:boolean=false;
  
  // Loads order and product data
  ngOnInit(): void {
    this.loadOrdersData();
    this.loadUsersProductData();
    localStorage.setItem('curPath','portal/usersHome')
  }

  // Fetches order statistics
  loadOrdersData() {
    this.isLoading=true
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        let orderCounts = Array(7).fill(0);
        orders.forEach(order => {
          const orderDate = new Date(order.orderDate);
          let dayIndex = (orderDate.getDay() + 6) % 7;
          orderCounts[dayIndex]++;
        });
        const maxValue = Math.max(...orderCounts);
        const chartMax = Math.max(70, Math.ceil(maxValue / 10) * 10);
        this.lineChartOptions = {
          responsive: true,
          scales: {
            y: {
              beginAtZero:true,
              min: 0,
              max: chartMax,
              ticks: {
                stepSize: 10,
                callback: function(value: number) {
          return value === 0 ? '' : value; 
        }
              },
              grid: { display: false }
            },
            x: {
              offset: true,

              ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 45
              },
              grid: { display: false }
            }
          },
          plugins: {
            legend: { display: false }
          }
        };
        this.lineChartData = {
          labels: days,
          datasets: [{
            data: orderCounts,
            borderColor: 'darkgreen',
            backgroundColor: 'transparent',
            pointBackgroundColor: 'darkgreen',
            pointBorderColor: 'darkgreen'
          }]
        };
        this.isLoading=false
      },
      error: (err) => {
        this.isLoading=false
      }
    });
  }

  // user product data
  loadUsersProductData() {
    this.isLoading=true
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        let prodCount: { [prodName: string]: number } = {};
        orders.forEach(order => {
          order.products.forEach((prod: any) => {
            prodCount[prod.name] = (prodCount[prod.name] || 0) + prod.quantity;
          });
        });
        const barValues = Object.values(prodCount);
        const maxBar = Math.max(...barValues);
        const chartMax = Math.max(70, Math.ceil(maxBar / 10) * 10);
        const chartMin = Math.min(...barValues) > 10 ? Math.floor(Math.min(...barValues) / 10) * 10 : 0;
        this.barChartOptions = {
          responsive: true,
          scales: {
            y: {
              min: chartMin,
              max: chartMax,
              ticks: {
                stepSize: 10,
                padding: 20,
                callback: (value) => value
              },
              grid: { display: false }
            },
            x: {
              ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 45
              },
              grid: { display: false }
            }
          },
          plugins: {
            legend: { display: false },
          }
        };

        this.barChartData = {
          labels: Object.keys(prodCount),
          datasets: [{
            label: 'Quantity',
            data: barValues,
            backgroundColor: 'blue'
          }]
        };
        this.isLoading=false;
      },
      error: (err) => {
        this.isLoading=false
      }
    });
  }
}