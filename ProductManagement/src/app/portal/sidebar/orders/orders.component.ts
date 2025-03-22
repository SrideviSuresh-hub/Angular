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
  curUser=JSON.parse(localStorage.getItem('user'));
  ngOnInit() {
      this.loadOrders()
  }

  loadOrders(){
    this.ordersService.getOrders().subscribe(data=>{
      console.log( "data",data);
      this.orders=data;
      this.orders.forEach(order=>{
        this.userService.getUserbyUserId(order.userId).subscribe(user=>{
          order.userName=user.username;
          order.address=`${user.street1||''},${user.street2||''}
           ${user?.city || ''}, ${user?.state || ''}, ${user?.postcode || ''}`;
        })
        this.ordersService.getOrderProducts(order.idfire).subscribe(products => {
          console.log(products)
          order.products = products;
      })
      console.log("Orders loaded", this.orders);
    })
  })
}
  deleteOrder(idfire:string){
   if(confirm("Do you want to really delete order?")){
    this.ordersService.deleteOrder(idfire).subscribe(()=>{
      this.loadOrders();
      console.log("Order deleted Succesfully")
    })
   }
  }


  getSeverity(status: string) {
    switch (status) {
        case 'Delivered':
            return 'success';
        case 'Shipped':
            return 'warn';
       default:
        return 'warn'

    }
}

viewOrder(order){
  console.log("selected Order :", order)
  this.selectedOrder={...order};
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
