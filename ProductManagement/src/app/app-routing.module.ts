import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { PortalRouteModule } from "./portal/portal-route.module";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes1: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'portal', loadChildren: () => import('./portal/portal.module').then((modObj) => modObj.PortalModule) },
  { path: '**', component: PageNotFoundComponent }
]
@NgModule({
  imports: [RouterModule.forRoot(routes1), PortalRouteModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
