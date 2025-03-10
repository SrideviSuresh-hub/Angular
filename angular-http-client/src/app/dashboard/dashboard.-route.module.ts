import { NgModule } from "@angular/core";
import { OverviewComponent } from './overview/overview.component';
import { StatsComponent } from './stats/stats.component';
import { RouterModule, Routes } from "@angular/router";
import { canActivate } from "../RouteGaurds/authGaurd";
import { DashboardComponent } from "./dashboard.component";
import { FormsModule } from "@angular/forms";

const routes:Routes=[
    {path:'',
        canActivate:[canActivate],
        // component:DashboardComponent,
         children:[
          {path:'overview',component:OverviewComponent},
          {path:'stats',component:StatsComponent}
         ] 
      }
]
@NgModule({
declarations:[
    // OverviewComponent,
    // StatsComponent,
    // DashboardComponent
],
imports:[RouterModule.forChild(routes),FormsModule],
exports:[RouterModule,FormsModule]
})
export class DashBoardRouteModule{

}