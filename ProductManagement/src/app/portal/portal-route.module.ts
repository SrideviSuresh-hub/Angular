import { NgModule } from "@angular/core";
import { HomeComponent } from "./sidebar/home/home.component";
import { ProductsComponent } from "./sidebar/products/products.component";
import { CartComponent } from "./sidebar/cart/cart.component";
import { OrdersComponent } from "./sidebar/orders/orders.component";
import { RouterModule, Routes } from "@angular/router";
import { PortalComponent } from "./portal.component";
import { canActivate } from "../Guards/auth.guard";
import { UsersComponent } from "./sidebar/users/users.component";

export const routes2:Routes=[
    {path:'',component:PortalComponent ,canActivate:[canActivate], 
        children:[
    {path:'home',component:HomeComponent},
    {path:'products',component:ProductsComponent},
    {path:'cart',component:CartComponent},
    {path:'orders',component:OrdersComponent},
    {path:'users',component:UsersComponent}
]}
];

@NgModule({
imports:[RouterModule.forChild(routes2)],
exports:[RouterModule]
})

export class PortalRouteModule{

}