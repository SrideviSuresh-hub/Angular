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
  selectedOrder:any=null;
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
      console.log("Orders loaded", this.orders);
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
        case 'Returned':
            return 'danger';
       default:
        return 'success'

    }
}

viewOrder(idfire:number){
  this.ordersService.getOrderById(idfire).subscribe((order)=>{
    console.log(idfire)
    if(order){
      console.log(order)
      this.selectedOrder={
        ...order,
        userName:this.curUser.userName,
        street1:this.curUser.street1,
        street2:this.curUser.street2,
        country:this.curUser.country,
        state:this.curUser.state,
        postcode:this.curUser.postcode
      }
    }
    else{
      console.log('null order');
    }
  })
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
