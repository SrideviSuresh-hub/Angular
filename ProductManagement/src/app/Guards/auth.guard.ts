import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from '../Services/auth.service';
import { inject } from "@angular/core";
import { Observable } from "rxjs";


export const canActivate = (
    router: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
):boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> => {
    const authService: AuthService = inject(AuthService);
    const loggedIn = authService.isLoggedIn;
    const route=inject(Router);
    if (loggedIn) {
        return true;
    }
    else {
        return route.createUrlTree(['/login']);
    }

}