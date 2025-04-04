import { Component, inject, OnInit } from '@angular/core';
import { OrdersService } from '../../Services/orders.service';
import { ChartData, ChartOptions } from 'chart.js';
import { ProductService } from '../../Services/products.service';
import { Order } from '../../Models/orders';
import { OrderProducts } from '../../Models/orderproducts';
@Component({
  selector: 'app-user-home',
  standalone: false,
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {
lineChartData: any;
  barChartData: any;

  lineChartOptions: any;
  barChartOptions: any;

  orderService: OrdersService = inject(OrdersService);
  productService: ProductService = inject(ProductService);

  ngOnInit(): void {
    this.loadOrdersData();
    this.loadUsersProductData();

    // Chart options
    this.lineChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45,
            color: '#000',
          },
        },
        y: {
          min: 10,
          max: 70,
          ticks: {
            stepSize: 10,
            padding: 20,
            color: '#000',
          },
          grid: {
            display: false,
          },
        },
      },
    };

    this.barChartOptions = { ...this.lineChartOptions };
  }

  loadOrdersData() {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        let orderCounts = Array(7).fill(0);

        orders.forEach((order) => {
          const orderDate = new Date(order.orderDate);
          const dayIndex = orderDate.getDay();
          if (dayIndex > 0) {
            orderCounts[dayIndex - 1] += 1;
          } else {
            orderCounts[6] += 1; // Sunday
          }
        });

        this.lineChartData = {
          labels: days,
          datasets: [
            {
              label: 'Orders',
              data: orderCounts,
              fill: false,
              borderColor: 'darkgreen',
              tension: 0.4,
              backgroundColor: 'darkgreen',
              pointBackgroundColor: 'darkgreen',
            },
          ],
        };
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      },
    });
  }

  loadUsersProductData() {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        let prodCount: { [prodName: string]: number } = {};

        orders.forEach((order) => {
          if (order.products) {
            order.products.forEach((prod: any) => {
              prodCount[prod.name] = (prodCount[prod.name] || 0) + prod.quantity;
            });
          }
        });

        this.barChartData = {
          labels: Object.keys(prodCount),
          datasets: [
            {
              label: 'Quantity',
              data: Object.values(prodCount),
              backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF6384', '#36A2EB'],
            },
          ],
        };
      },
      error: (err) => {
        console.error('Error fetching product data:', err);
      },
    });
  }
}
//   loadUsersProductData() {
//     this.orderService.getOrders().subscribe({
//       next: (orders) => {
//         let prodCount: { [prodName: string]: number } = {};
//         orders.forEach(order => {
//           order.products.forEach((prod: any) => {
//             if (prodCount[prod.name]) {
//               prodCount[prod.name] += prod.quantity;
//             } else {
//               prodCount[prod.name] = prod.quantity;
//             }
//             console.log(prodCount);
            
//           });
//         });

//         this.barChartData = {
//           labels: Object.keys(prodCount),
//           datasets: [{
//             label: 'Quantity',
//             data: Object.values(prodCount),
//             backgroundColor: 'blue'
//           }]
//         };
//       },
//       error: (err) => {
//         console.error('Error fetching product data:', err);
//       }
//     });
//   }



// loadOrdersData() {
//   this.orderService.getOrders().subscribe({
//     next: (orders) => {
//       const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
//       let orderCounts = Array(7).fill(0);

//       orders.forEach(order => {
//         const orderDate = new Date(order.orderDate);
//         const dayIndex = orderDate.getDay();
//           // orderCounts[dayIndex ] += 1;
//         if (dayIndex > 0) {
//           orderCounts[dayIndex - 1] += 1;
//         }
//         console.log(orderCounts);
        
//       });

//       this.lineChartData = {
//         labels: days,
//         datasets: [{
//           data: orderCounts,
//           borderColor: 'darkgreen',
//           backgroundColor: 'transparent',
//           pointBackgroundColor: 'darkgreen',
//           pointBorderColor: 'darkgreen',
//         }]
//       };
//     },
//     error: (err) => {
//       console.error('Error fetching orders:', err);
//     }
//   });
// }