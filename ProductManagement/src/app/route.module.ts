import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PortalRouteModule } from "./portal/portal-route.module";

export const routes1: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'signup', component: SignupComponent },
   {path:'portal',loadChildren:()=>import('./portal/portal.module').then((modObj)=>modObj.PortalModule)}
]
@NgModule({
    imports:[RouterModule.forRoot(routes1),PortalRouteModule],
    exports:[RouterModule],
    providers:[]
})
export class RouteModule{

}
