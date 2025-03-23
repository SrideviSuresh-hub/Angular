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
  isLoading:boolean=false;
  orderService: OrdersService = inject(OrdersService);
  userService: UsersService = inject(UsersService);
  selectedProduct: any={};
  showDialog: boolean = false;
  msgService: MessageService = inject(MessageService);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() { 
    this.userService.getUsers().subscribe({
      next: (users) => {
        if (!users) {
          console.error('No users found');
          return;
        }
  
        let newOrders: any[] = [];
        
        Object.values(users).forEach((user: any) => {
          if (user.orders) {
            Object.entries(user.orders).forEach(([keyId, order]: any) => {
              if (order.products) {
                order.products.forEach((product: any, index: number) => {
                  newOrders.push({
                    keyId: keyId,
                    orderId:order.orderId,
                    userId: user.id,
                    userName: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName || '',
                    email: user.email,
                    mobile: user.mobile,
                    street1: user.address1,
                    street2: user.address2 || '',
                    state: user.states || '',
                    country: user.country || '',
                    pinCode: user.zipCode || '',
                    orderDate: order.orderDate,
                    deliveryStatus: product.deliveryStatus || 'Pending',
                    productName: product.name,
                    productImage: product.image,
                    quantity: product.quantity,
                    productIndex: index
                  });
                });
              }
            });
          }
        });
  
        this.orders = [...this.orders, ...newOrders];
        console.log('Orders Loaded:', this.orders);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
      complete: () => {
        this.isLoading = false;
        console.log('User orders fetch complete.');
      }
    });
  }
  
  
  viewOrder(product: any) {
    this.selectedProduct = { ...product };
    this.showDialog = true;
  }
  
 
  markProductAsDelivered(orderId: string, userId: string, productIndex: number) {
    this.orderService.updateDeliveryStatus(orderId, userId, productIndex, "Delivered").subscribe({
      next: () => {
        console.log(`Product ${productIndex} in order ${orderId} marked as Delivered`);
        this.updateOrderStatus(orderId, userId);
      },
      error: (err) => {
        console.error("Error updating product delivery status:", err);
      }
    });
  }

  updateOrderStatus(orderId: string, userId: string) {
    this.orderService.getOrderProducts(orderId).subscribe({
      next: (products) => {
        if (!products) return;

        let allDelivered = products.every(p => p.deliveryStatus === "Delivered");
        let someDelivered = products.some(p => p.deliveryStatus === "Delivered");

        let newStatus = allDelivered ? "Delivered" : someDelivered ? "Partially Delivered" : "Pending";

        console.log(`Updating order ${orderId} overall status to ${newStatus}`);

        this.orderService.updateOrderStatus(orderId, userId, newStatus).subscribe({
          next: () => {
            console.log(`Order ${orderId} delivery status updated to ${newStatus}`);
            this.loadOrders(); 
          },
          error: (err) => {
            console.error("Error updating order delivery status:", err);
          }
        });
      },
      error: (err) => {
        console.error("Error fetching updated products:", err);
      }
    });
  }



  getSeverity(status: string) {
    return status === 'Delivered' ? 'success' : 'warn';
    }
  }
