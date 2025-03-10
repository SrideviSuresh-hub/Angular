import {  NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard.component";
import { TaskDetailsComponent } from "./task-details/task-details.component";
import { CreateTaskComponent } from "./create-task/create-task.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared.module";
import { OverviewComponent } from './overview/overview.component';
import { StatsComponent } from './stats/stats.component';
import { DashBoardRouteModule } from "./dashboard.-route.module";
import { RouterModule } from "@angular/router";


@NgModule({
    declarations:[
        DashboardComponent,
       CreateTaskComponent,
        TaskDetailsComponent,
        OverviewComponent,
        StatsComponent
    ],
    exports:[
        // DashboardComponent,
        // CreateTaskComponent,
        //  TaskDetailsComponent,
        
         SharedModule,
         DashBoardRouteModule
    ],
    imports:[
        CommonModule,
        RouterModule,
        DashBoardRouteModule,SharedModule
    ]
})
export class DashBoardModule{

}