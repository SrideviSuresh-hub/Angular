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
  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      y: {
        min: 10,
        max: 70,  
        ticks: {
          stepSize: 10,
         padding:20,
          callback: function(value) {
            return value;
          }
        },
        grid: {
          display: false
        }
      },
      x: {
        
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          display: false
        }
      }
    },
    plugins: { legend: { display: false } },
  };
  
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        min: 10,
        max: 70,  
        ticks: {
          stepSize: 10,
          padding:20,
          callback: function(value) {
            return value;
          }
        },
        grid: {
          display: false
        }
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          display: false
        }
      }
    },
    plugins: { legend: { display: false } },
  };
  orderService: OrdersService = inject(OrdersService);
  productService: ProductService = inject(ProductService);
  ngOnInit(): void {
    this.loadOrdersData();
    this.loadUsersProductData();
  }
  loadOrdersData() {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        let orderCounts = Array(7).fill(0);

        orders.forEach(order => {
          const orderDate = new Date(order.orderDate);
          const dayIndex = orderDate.getDay();
            orderCounts[dayIndex ] += 1;
          // if (dayIndex > 0) {
          //   orderCounts[dayIndex - 1] += 1;
          // }
        });

        this.lineChartData = {
          labels: days,
          datasets: [{
            data: orderCounts,
            borderColor: 'darkgreen',
            backgroundColor: 'transparent',
            pointBackgroundColor: 'darkgreen',
            pointBorderColor: 'darkgreen',
          }]
        };
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      }
    });
  }

  loadUsersProductData() {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        let prodCount: { [prodName: string]: number } = {};
        orders.forEach(order => {
          order.products.forEach((prod: any) => {
            if (prodCount[prod.name]) {
              prodCount[prod.name] += prod.quantity;
            } else {
              prodCount[prod.name] = prod.quantity;
            }
          });
        });

        this.barChartData = {
          labels: Object.keys(prodCount),
          datasets: [{
            label: 'Quantity',
            data: Object.values(prodCount),
            backgroundColor: 'blue'
          }]
        };
      },
      error: (err) => {
        console.error('Error fetching product data:', err);
      }
    });
  }
}