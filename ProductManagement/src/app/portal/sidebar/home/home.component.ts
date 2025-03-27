import { Component, inject } from '@angular/core';
import { OrdersService } from '../../../Services/orders.service';
import { UsersService } from '../../../Services/users.service';
import { MessageService } from 'primeng/api';
import { OrderProducts } from '../../../Models/orderproducts';
import { Order } from '../../../Models/orders';


@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls:['./home.component.css']
})
export class HomeComponent {
  orders: Order[] = [];
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
            this.isLoading=true;
            Object.entries(user.orders).forEach(([keyId, order]: any) => {
              if (order.products) {
                order.products.forEach((product: any, index: number) => {
                  newOrders.push({
                    keyId: keyId,
                    orderId:order.orderId,
                    userId: user.id,
                    userName: user.username,
                    // firstName: user.firstName,
                    // lastName: user.lastName || '',
                    // email: user.email,
                    // mobile: user.mobile,
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
  
        this.orders = newOrders ;
        // [...this.orders, ...newOrders];
        console.log('Orders Loaded:', this.orders);
      },
      error: (error) => {
        this.isLoading=false
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
        this.loadOrders();

      },
      error: (err) => {
        console.error("Error updating product delivery status:", err);
      }
    });
  }

  updateOrderStatus(orderId: string, userId: string) {
    this.orderService.getOrderProducts(orderId).subscribe({
      next: (products) => {
        if (!Array.isArray(products)) return;

        let allDelivered = products.every(p => p.deliveryStatus === "Delivered");
        let newStatus = allDelivered ? "Delivered"  : "Pending";

        console.log(`Updating order ${orderId} overall status to ${newStatus}`);

        this.orderService.updateOrderStatus(orderId, userId, newStatus).subscribe()
      //   {
      //     next: () => {
      //       console.log(`Order ${orderId} delivery status updated to ${newStatus}`);
      //     },
      //     error: (err) => {
      //       console.error("Error updating order delivery status:", err);
      //     }
      //   });
      // },
      // error: (err) => {
      //   console.error("Error fetching updated products:", err);
      // }
      }
  });
  }



  getSeverity(status: string) {
    return status === 'Delivered' ? 'success' : 'warn';
    }
  }
  
