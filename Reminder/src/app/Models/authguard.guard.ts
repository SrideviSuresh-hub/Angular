import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../Services/auth.service";
import { inject } from "@angular/core";

export class AuthGuard implements CanActivate{
    authService:AuthService=inject(AuthService);
    router:Router=inject(Router)
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const user=this.authService.getcurUser();
        if(user ){
            return true;
        }
        else{
            this.router.navigate(['/login']);
            return false;
        }
    }
}