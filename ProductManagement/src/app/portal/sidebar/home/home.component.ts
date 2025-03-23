import { Component, inject } from '@angular/core';
import { OrdersService } from '../../../Services/orders.service';
import { UsersService } from '../../../Services/users.service';
import { MessageService } from 'primeng/api';
import { OrderProducts } from '../../../Models/orderproducts';
import { Order } from '../../../Models/orders';
import { UnsubscriptionError } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  orders: any[] = [];
  orderService: OrdersService = inject(OrdersService);
  userService: UsersService = inject(UsersService);
  selectedProduct: any={};
  showDialog: boolean = false;
  msgService: MessageService = inject(MessageService);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.userService.getUsers().subscribe(users => {
      this.orders = [];
  
      if (!users) {
        console.error('No users found');
        return;
      }
  
      Object.values(users).forEach((user: any) => {
        if (user.orders) {
          Object.entries(user.orders).forEach(([keyId, order]: any) => {
            if (order.products) {
              order.products.forEach((product: any, index: number) => {
                this.orders.push({
                  keyId: keyId,
                  userId: user.id,
                  userName: user.username,
                  orderDate: order.orderDate,
                  productName: product.name,
                  productImage: product.image,
                  quantity: product.quantity,
                  deliveryStatus: product.deliveryStatus || "Shipped", 
                  productIndex: index
                });
              });
            }
          });
        }
      });
  
      console.log('Orders Loaded:', this.orders);
    }, error => {
      console.error('Error fetching users:', error);
    });
  }
  
  viewOrder(product: any) {
    this.selectedProduct = { ...product };
    this.showDialog = true;
  }
  
  markAsDelivered(orderId: string, userId: string, productIndex: number) {
    console.log(`Updating delivery status for Order: ${orderId}, Product Index: ${productIndex}`);

    this.orderService.updateDeliveryStatus(orderId, userId, productIndex, "Delivered").subscribe(() => {
      this.orders = this.orders.map(order => {
          if (order.keyId === orderId && order.userId === userId && order.productIndex === productIndex) {
              return {
                  ...order,
                  deliveryStatus: "Delivered"
              };
          }
          return order;
      });
        console.log("update orders", this.orders);
        
        this.msgService.add({ severity: 'success', summary: 'Success', detail: 'Product marked as Delivered!' });
    }, error => {
        console.error('Error updating delivery status:', error);
    });
}
    
  
   


  getSeverity(status: string) {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Shipped':
        return 'warn';
      default:
        return 'info';
    }
  }
}