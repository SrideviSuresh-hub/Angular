import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../Services/auth.service";
import { inject } from "@angular/core";

export const canActivate = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> => {
    const authService: AuthService = inject(AuthService);
    if (authService.isLoggedIn()) {
        localStorage.setItem('isLoggedIn', 'true')
    }
    const router = inject(Router);
    if (!authService.isLoggedIn()) {
        return router.navigate(['/login']);
    }
    const isAdmin = authService.isAdmin();
    const requestedRoute = state.url;
    if (isAdmin && (requestedRoute.includes('portal/usersHome'))) {
        return router.navigate(['/portal/home']);

    } else if (!isAdmin && requestedRoute.includes('portal/home')) {
        return router.navigate(['/portal/usersHome']);
    }
    return true;
}
