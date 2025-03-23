import { Component, inject, OnInit } from '@angular/core';
import { OrdersService } from '../../../Services/orders.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsersService } from '../../../Services/users.service';
import { User } from '../../../Models/User';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: any[]=[];
  showPopup:boolean=false;
  selectedOrder:any;
  ordersService:OrdersService=inject(OrdersService);
  userService:UsersService=inject(UsersService);
  messageService: MessageService = inject(MessageService);
  confirmationService: ConfirmationService = inject(ConfirmationService);
  curUser=JSON.parse(localStorage.getItem('user'));
  ngOnInit() {
      this.loadOrders()
  }

  loadOrders(){
    this.ordersService.getOrders().subscribe({
      next:(data)=>{
          console.log(JSON.stringify(data, null, 2));
          if(data){
          this.orders=data;
          this.orders.forEach(order=>{
            this.userService.getUserbyUserId(order.userId).subscribe({
              next:(user)=>{
                console.log("Fetching user details for User ID:", user);
                  order.userName=user?.username||"Unknown";
                  order.address1 = user?.address1 || "";
                  order.address2 = user?.address2 || "";
                  order.state = user?.states || "";
                  order.zipCode = user?.zipCode || "";
              },
              error:(err)=>{
                console.log("Error fetching user Details",err)
              }
            });
            this.ordersService.getOrderProducts(order.keyId).subscribe({
              next:(products)=>{
                console.log(products);
                order.products = products||[];
            }
          });
          });
        }},
            error:(err)=>{
              console.error("Error loading orders", err)
            }
        });
      }
  
      confirmDelete(keyId: string) {
        this.confirmationService.confirm({
          key: 'deleteConfirm',
          message: 'Do you really want to delete the selected item?',
          header: 'Are You sure!?',
          icon: 'pi pi-times-circle',
          acceptLabel: 'Delete',
          rejectLabel: 'Cancel',
          acceptButtonStyleClass: 'custom-delete-btn',
          rejectButtonStyleClass: 'custom-cancel-btn',
          accept: () => {
            this.deleteOrder(keyId);
          }
        });
      }
    

  deleteOrder(keyId:string){
    this.ordersService.deleteOrder(keyId).subscribe({
      next:()=>{
        this.loadOrders();
        console.log("Order deleted Succesfully")
  
      },
      error:(err)=>{
        console.error("Error deleting order:",err);
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


// confirm1(event: Event) {
//   this.confirmationService.confirm({
//       target: event.target as EventTarget,
//       icon: 'pi pi-times-circle',
//       header: 'Danger Zone',
//       message: 'Do you want to delete this record?',
//       rejectLabel: 'Cancel',
//       rejectButtonProps: {
//           label: 'Cancel',
//           severity: 'secondary',
//           outlined: true,
//       },
//       acceptButtonProps: {
//           label: 'Delete',
//           severity: 'danger',
//       },

//       accept: () => {
//           this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
//       },
//       reject: () => {
//           this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
//       },
//   });
// }
