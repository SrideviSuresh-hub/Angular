import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { CommonModule } from "@angular/common";

const routes:Routes=[
    { path:'',component:HomeComponent},
    {path:'login', loadChildren:()=> import('./login/auth.module').then(mod=>mod.AuthModule)},
    { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashBoardModule) }    // {path:'dashboard',loadChildren:"./dashboard/dashboard.module#DashBoardModule"}
  
]

@NgModule({
    imports:[RouterModule.forRoot(routes,{preloadingStrategy:PreloadAllModules}),CommonModule],
    exports:[RouterModule],
    providers:[]
})
export class RouteModule{
    
}