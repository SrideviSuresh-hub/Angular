import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UsersComponent } from "./users/users.component";
import { ReminderComponent } from "./reminder/reminder.component";
import { HomeComponent } from "./home/home.component";
import { HeaderComponent } from "./header/header.component";
import { PortalComponent } from "./portal.component";
import { UserhomeComponent } from "./userhome/userhome.component";
import { canActivate } from "../Models/authguard.guard";

export const routes2:Routes=[
    {path:'',component:PortalComponent,canActivate:[canActivate],
        children:[
            {path:'',redirectTo:'home',pathMatch:'full'},
            {path:'users',component:UsersComponent},
            {path:'reminder',component:ReminderComponent},
            {path:'home',component:HomeComponent},
            {path:'header',component:HeaderComponent},
            {path:'userhome',component:UserhomeComponent},
        ]
    }
];
@NgModule({
imports:[RouterModule.forChild(routes2)],
exports:[RouterModule]
})
export class PortalRouteModule{

}