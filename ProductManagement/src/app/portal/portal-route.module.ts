import {  NgModule } from "@angular/core";
import { HomeComponent } from "./sidebar/home/home.component";
import { ProductsComponent } from "./sidebar/products/products.component";
import { CartComponent } from "./sidebar/cart/cart.component";
import { OrdersComponent } from "./sidebar/orders/orders.component";
import { RouterModule, Routes } from "@angular/router";
import { PortalComponent } from "./portal.component";
import { canActivate } from "../Guards/auth.guard";
import { UsersComponent } from "./sidebar/users/users.component";
import { UserHomeComponent } from "./user-home/user-home.component";

export const routes2:Routes=[
    {path:'portal',
        component:PortalComponent,
        canActivate:[canActivate], 
        children:[
    {path:'',redirectTo:'home',pathMatch:'full'},
   {path:'home',component:HomeComponent},
    {path:'users',component:UsersComponent},
    {path:'products',component:ProductsComponent},
    {path:'cart',component:CartComponent},
    {path:'orders',component:OrdersComponent},
    {path:'usersHome',component:UserHomeComponent}
]}
];

@NgModule({
imports:[RouterModule.forChild(routes2)],
exports:[RouterModule]
})

export class PortalRouteModule{
}