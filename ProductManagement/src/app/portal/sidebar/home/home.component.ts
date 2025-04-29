import { Component, inject } from '@angular/core';
import { OrdersService } from '../../../Services/orders.service';
import { UsersService } from '../../../Services/users.service';
import { MessageService } from 'primeng/api';
import { OrderProducts } from '../../../Models/orderproducts';
import { Order } from '../../../Models/orders';
import { PaginatorState } from 'primeng/paginator';


@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  orders: Order[] = [];
  isLoading: boolean = false;
  orderService: OrdersService = inject(OrdersService);
  userService: UsersService = inject(UsersService);
  selectedProduct: any = {};
  showDialog: boolean = false;
  msgService: MessageService = inject(MessageService);

  // Loads cart data
  ngOnInit() {
    this.loadOrders();
    localStorage.setItem('curPath', 'portal/home')
  }

  // Fetches user orders
  loadOrders() {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        if (!users) {
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
                    orderId: order.orderId,
                    userId: user.id,
                    userName: user.username,
                    street1: user.address1,
                    street2: user.address2 || '',
                    state: user.states || '',
                    country: user.country || '',
                    pinCode: user.zipCode || '',
                    orderDate: order.orderDate|| '',
                    deliveryDate:order.deliveryDate,
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
        this.orders = newOrders;
      },
      error: () => {
        this.isLoading = false
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Opens order details i
  viewOrder(product: any) {
    this.selectedProduct = { ...product };
    this.showDialog = true;
  }

  //  Updates product delivery status
  markProductAsDelivered(orderId: string, userId: string, productIndex: number) {
    const currentDateTime = new Date().toISOString(); 
    this.orderService.updateDeliveryStatus(orderId, userId, productIndex, "Delivered",currentDateTime).subscribe({
      next: () => {
        this.updateOrderStatus(orderId, userId);
        this.orders.forEach(order => {
          if (order.orderId === orderId && order.userId === userId && order.productIndex === productIndex) {
            order.deliveryDate = currentDateTime; 
          }
      })
    }
    });
  }

  // Checks if all products in an order are delivered
  updateOrderStatus(orderId: string, userId: string) {
    const currentDateTime = new Date().toISOString();
    this.orderService.getOrderProducts(orderId).subscribe({
      next: (products) => {
        if (!Array.isArray(products)) return;
        let allDelivered = products.every(p => p.deliveryStatus === "Delivered");
        let newStatus = allDelivered ? "Delivered" : "Pending";

       let deliveryDate = allDelivered ? currentDateTime : null; 
        this.orderService.updateOrderStatus(orderId, userId, newStatus,deliveryDate).subscribe();
      }
    });
  }

  // Determines alert styling
  getSeverity(status: string) {
    return status === 'Delivered' ? 'success' : 'warn';
  }
}

