import { Component, inject } from '@angular/core';
import { OrdersService } from '../../../Services/orders.service';
import { UsersService } from '../../../Services/users.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
orders:any[]=[];
orderService:OrdersService=inject(OrdersService);
userService:UsersService=inject(UsersService);
selectedOrdersProducts:any[]=[];
selectedOrder;
showDialog:boolean=false;
msgService:MessageService=inject(MessageService);

ngOnInit(){
  this.loadOrders()
}
 loadOrders(){
  this.orderService.getAllOrders().subscribe(data=>{
    let updatedOrders=[...data];
    console.log("admin Orders Loaded:",this.orders)
    updatedOrders.forEach(order=>{
      this.userService.getUserbyUserId(order.userId).subscribe(user=>{
        order.userName=user.username;
        order.street1=user.address1;
        order.street2=user.address2;
        order.country=user.country;
        order.state=user.states;
        order.pinCode=user.zipCode;
        console.log(user);
      
    })
  })
  this.orders=updatedOrders;
})
 }


 deleteOrder(orderId: string) {
  if (confirm("Are you sure you want to delete this order?")) {
    this.orderService.deleteOrder(orderId).subscribe(() => {
      this.loadOrders();
    });
  }
}
getSeverity(status:string){
 switch(status){
  case 'Delivered':return 'success';
  case 'Shipped':return 'warn';
  default:return 'info';
 }
}

viewOrder(order){
  this.selectedOrder={...order};
  this.selectedOrdersProducts=order.products;
 this.showDialog=true;
}
markAsDelivered(order){
  this.orderService.updateDeliveryStatus(order.idfire,'Delivered').subscribe(()=>{
    this.msgService.add({severity:'success',summary:'Success',detail:'Order marked as delivered!'})
    this.loadOrders();
  })
}
}