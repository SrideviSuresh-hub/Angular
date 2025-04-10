import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UsersComponent } from "./users/users.component";
import { ReminderComponent } from "./reminder/reminder.component";
import { HomeComponent } from "./home/home.component";
import { HeaderComponent } from "./header/header.component";
import { PortalComponent } from "./portal.component";

export const routes2:Routes=[
    {path:'portal',component:PortalComponent,
        children:[
            {path:'users',component:UsersComponent},
            {path:'reminder',component:ReminderComponent},
            {path:'home',component:HomeComponent},
            {path:'header',component:HeaderComponent}]
    }
];
@NgModule({
imports:[RouterModule.forChild(routes2)],
exports:[RouterModule]
})
export class PortalRouteModule{

}