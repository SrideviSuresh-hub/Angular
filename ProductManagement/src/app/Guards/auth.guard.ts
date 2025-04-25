import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from '../Services/auth.service';
import { inject } from "@angular/core";
import { Observable } from "rxjs";

export const canActivate = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot)
    :boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> => {
    const authService: AuthService = inject(AuthService);
    if(authService.isLoggedIn()){
        localStorage.setItem('isLoggedIn','true')
    }
    const  router= inject(Router);
    if (!authService.isLoggedIn()) {
        router.navigate(['/login']);
         return true;
    }
    const isAdmin = authService.isAdmin();
    const requestedRoute = state.url;
    if (isAdmin && ((requestedRoute.includes('portal/usersHome'))||(requestedRoute.includes('portal/orders') )||(requestedRoute.includes('portal/cart')))) {
      router.navigate([localStorage.getItem('curPath')]);
      return false; 
    } else if (!isAdmin && ((requestedRoute.includes('portal/home'))||(requestedRoute.includes('portal/users')))) {
      router.navigate([localStorage.getItem('curPath')]);
      return false; 
    }
    return true;
}