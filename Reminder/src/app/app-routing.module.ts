import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
// import { PortalRouteModule } from './portal/portals-route.module';

 export const routes1: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'portal', loadChildren:()=>import('./portal/portal.module').then((modObj)=>modObj.PortalModule)},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes1)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
