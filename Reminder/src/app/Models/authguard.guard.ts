import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../Services/auth.service";
import { inject } from "@angular/core";

export const canActivate = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> => {
    const authService: AuthService = inject(AuthService);
    const user = authService.getcurUser();
    if (authService.isLoggedIn()) {
        localStorage.setItem('isLoggedIn', 'true')
    }

    const router = inject(Router);
    if (!authService.isLoggedIn()) {
        return router.createUrlTree(['/login']);
    }

    const isAdmin = authService.isAdmin();
    const requestedRoute = state.url;
    if (isAdmin && (requestedRoute.includes('portal/userhome'))) {
        return router.createUrlTree(['/portal/home']);
    } else if (!isAdmin && requestedRoute.includes('portal/home')) {
        return router.createUrlTree(['/portal/userhome']);
    }
    
    return true;
}
