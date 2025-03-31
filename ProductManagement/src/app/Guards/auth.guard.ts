import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from '../Services/auth.service';
import { inject } from "@angular/core";
import { Observable } from "rxjs";

export const canActivate = (
    router: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> => {
    const authService: AuthService = inject(AuthService);
    console.log(authService.isLoggedIn());
    const route = inject(Router);
    if (!authService.isLoggedIn()) {
        return route.createUrlTree(['/login']);
    }
   
    const isAdmin = authService.isAdmin();
    const requestedRoute = state.url;
    // if (isAdmin && requestedRoute === '/portal') {
    //     return route.createUrlTree(['/portal/home']);
    // }

    // if (!isAdmin && requestedRoute === '/portal') {
    //     return route.createUrlTree(['/portal/usersHome']);
    // }
    if(!isAdmin && (requestedRoute.includes('/portal/users') || requestedRoute.includes('portal/home'))){
        return route.createUrlTree(['/portal/usersHome']);
    }
    if (isAdmin && (requestedRoute.includes('/portal/cart') || requestedRoute.includes('/portal/orders'))) {
        return route.createUrlTree(['/portal/users']); 
    }

    return true;
}