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
  orders: any[]=[];
  showPopup:boolean=false;
  selectedOrder:any;
  isLoading:boolean=false;
  selectedOrderKeyId: string; 

  ordersService:OrdersService=inject(OrdersService);
  userService:UsersService=inject(UsersService);
  messageService: MessageService = inject(MessageService);
  confirmationService: ConfirmationService = inject(ConfirmationService);
  curUser=JSON.parse(localStorage.getItem('user'));
  visible: boolean = false;

 
  ngOnInit() {
      this.loadOrders()
  }
  showDialog() {
    this.visible = true;
}
  loadOrders() {
    this.isLoading=true;
    this.ordersService.getOrders().subscribe({
      next: (data) => {
        if (data) {
          this.orders = data;
          this.fetchUsersAndProducts(0);
        }
        else{
          this.isLoading=false;
        }
      },
      error: (err) => {
        console.error("Error loading orders", err);
        this.isLoading=false;
      }
    });
  }

  fetchUsersAndProducts(index:number) {
    if (index >= this.orders.length) {
      this.isLoading = false;
      return;
    }
    let order=this.orders[index];
    // let count=0;
    // this.orders.forEach((order, index) => {
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
            console.log(user);
          }

          this.fetchUpdatedProducts(index);
          
        },
        error: (err) => {
          console.error("Error fetching user details:", err);
          this.fetchUpdatedProducts(index);
        },
       
      });
    }
  


  fetchUpdatedProducts(index:number) {
    let order=this.orders[index];
    this.ordersService.getOrderProducts(order.keyId).subscribe({
      next: (products) => {
        if (products) {
          let allDelivered = products.every(p => p.deliveryStatus === 'Delivered');
          // let someDelivered = products.some(p => p.deliveryStatus === 'Delivered');

          let newStatus = allDelivered ? 'Delivered' : 'Pending' ;

          this.orders[index] = {
            ...this.orders[index],
            products,
            deliveryStatus: newStatus
          };
        }
      },
      error: (err) => {
        console.error('Error fetching products for order:', err);
      },
       complete: () => {
        this.fetchUsersAndProducts(index + 1); 
    }
  });
  }
  
      deleteOrder(keyId:string){
        this.selectedOrderKeyId = keyId;
        console.log(this.selectedOrder)
        this.visible=true;
   }
   confirmDelete() {
    this.ordersService.deleteOrder(this.selectedOrderKeyId).subscribe({
        next: () => {
            this.loadOrders();
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Order deleted successfully' });
            this.visible = false; 
        },
        error: (err) => {
            console.error("Error deleting order:", err);
        }
    });
}

  getSeverity(status: string) {
    return status=== 'Delivered'?'success':'warn';
}

viewOrder(order){
  console.log("selected Order :", order)
  this.selectedOrder={...order}
  this.showPopup=true;
}
}
