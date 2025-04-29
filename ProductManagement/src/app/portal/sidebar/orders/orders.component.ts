import { Component, inject, OnInit } from '@angular/core';
import { OrdersService } from '../../../Services/orders.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsersService } from '../../../Services/users.service';


@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  showPopup: boolean = false;
  selectedOrder: any;
  isLoading: boolean = false;
  selectedOrderKeyId: string;
  ordersService: OrdersService = inject(OrdersService);
  userService: UsersService = inject(UsersService);
  messageService: MessageService = inject(MessageService);
  confirmationService: ConfirmationService = inject(ConfirmationService);
  curUser = JSON.parse(localStorage.getItem('user'));
  visible: boolean = false;

  // Loads orders
  ngOnInit() {
    this.loadOrders();
    localStorage.setItem('curPath', 'portal/orders')
  }

  //Opens confirmation dialog
  showDialog() {
    this.visible = true;
  }

  // Fetches user orders
  loadOrders() {
    this.isLoading = true;
    this.ordersService.getOrders().subscribe({
      next: (data) => {
        if (data) {
          this.orders = data ? data : [];
          this.fetchUsersAndProducts(0);
        }
        else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', detail: 'Error loading orders', summary: err });
        this.isLoading = false;
      }
    });
  }

  // Retrieves user details
  fetchUsersAndProducts(index: number) {
    if (index >= this.orders.length) {
      this.isLoading = false;
      return;
    }
    let order = this.orders[index];
    this.userService.getUserbyUserId(order.userId).subscribe({
      next: (user) => {
        if (user) {
          this.orders[index] = {
            ...order,
            userName: user.username || "Unknown",
            address1: user.address1 || "",
            address2: user.address2 || "",
            state: user.states || "",
            zipCode: user.zipCode || ""
          };
        }
        this.fetchUpdatedProducts(index);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', detail: 'Error Deleting User', summary: err });
      },

    });
  }

  // Loads products for an order
  fetchUpdatedProducts(index: number) {
    let order = this.orders[index];
    this.ordersService.getOrderProducts(order.keyId).subscribe({
      next: (products) => {
        if (products) {
          let allDelivered = products.every(p => p.deliveryStatus === 'Delivered');
          let newStatus = allDelivered ? 'Delivered' : 'Pending';
          this.orders[index] = {
            ...this.orders[index],
            products,
            deliveryStatus: newStatus
          };
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', detail: 'Error Deleting User', summary: err });
      },
      complete: () => {
        this.fetchUsersAndProducts(index + 1);
      }
    });
  }

  // Prepares order for deletion
  deleteOrder(keyId: string) {
    this.selectedOrderKeyId = keyId;
    this.visible = true;
  }

  // Deletes the order
  confirmDelete() {
    this.ordersService.deleteOrder(this.selectedOrderKeyId).subscribe({
      next: () => {
        this.loadOrders();
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Order deleted successfully' });
        this.visible = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', detail: 'Error Deleting User', summary: err });
      }
    });
  }

  // Assigns UI severity levels
  getSeverity(status: string) {
    return status === 'Delivered' ? 'success' : 'warn';
  }

  // Displays order details
  viewOrder(order) {
    this.selectedOrder = { ...order }
    this.showPopup = true;
  }
}
