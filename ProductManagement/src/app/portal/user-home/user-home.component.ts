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
    // responsive: true,
    plugins: { legend: { display: false } },
  };
  barChartOptions: ChartOptions<'bar'> = {
    // responsive: true,
    plugins: { legend: { display: false } },
  };
  orderService:OrdersService=inject(OrdersService);
  productService:ProductService=inject(ProductService);
  ngOnInit(): void {
    this.loadOrdersData();
    this.loadUsersProductData();
  }

  loadOrdersData() {
    this.orderService.getOrders().subscribe(orders => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      let orderCounts = Array(7).fill(0);
      
      orders.forEach(order => {
        const orderDate = new Date(order.orderDate);
        const dayIndex = orderDate.getDay();
        console.log(dayIndex);
        if (dayIndex > 0)
          {
             orderCounts[dayIndex - 1] += 1; 
          }
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
    });
  }

  loadUsersProductData(){
    this.orderService.getOrders().subscribe(orders=>{
      let prodCount:{[prodName:string]:number}={};
      orders.forEach(order=>{
        order.products.forEach((prod:any)=>{
          if(prodCount[prod.name]){
            prodCount[prod.name]+=prod.quantity;
          }
          else{
            prodCount[prod.name]=prod.quantity;
          }
        });
      });
      this.barChartData={
        labels:Object.keys(prodCount),
        datasets:[{
          label:'Quantity',
          data:Object.values(prodCount),
          backgroundColor:'blue'
        }]
      }
    })
  
  }
 
  
}

// loadProductsData() {
//   this.productService.getProducts().subscribe(products => {
//     const productNames = products.map(p => p.name);
//     const stockQuantities = products.map(p => p.quantity);
//     const soldQuantities = products.map(p => p.sold || 0); 

//     this.barChartData = {
//       labels: productNames,
//       datasets: [
//         {
//           label: 'Stock Quantity',
//           data: stockQuantities,
//           backgroundColor: 'purple'
//         },
//         {
//           label: 'Sold Quantity',
//           data: soldQuantities,
//           backgroundColor: 'orange'
//         }
//       ]
//     };
//   });
// }