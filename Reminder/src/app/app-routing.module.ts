import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PortalComponent } from './portal/portal.component';
import { PortalRouteModule } from './portal/portals-route.module';

 export const routes1: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'portal', loadChildren:()=>import('./portal/portal.module').then((modObj)=>modObj.PortalModule)},
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes1),PortalRouteModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
