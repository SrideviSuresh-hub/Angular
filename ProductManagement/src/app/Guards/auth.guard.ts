import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from '../Services/auth.service';
import { inject } from "@angular/core";
import { Observable } from "rxjs";

export const canActivate = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> => {
    const authService: AuthService = inject(AuthService);
    console.log(authService.isLoggedIn());
    const  router= inject(Router);
    if (!authService.isLoggedIn()) {
        router.navigate(['/login']);
         return false;
    }
   
 
    const isAdmin = authService.isAdmin();
    const requestedRoute = state.url;
  
    console.log('Requested route:', requestedRoute);
  
    if (isAdmin && requestedRoute.includes('portal/usersHome')) {
      console.log('Admin already on usersHome, redirecting to home');
      router.navigate(['/portal/home']);
      return false; // Stop navigation
    } else if (!isAdmin && requestedRoute.includes('portal/home')) {
      console.log('Non-admin already on home, redirecting to usersHome');
      router.navigate(['/portal/usersHome']);
      return false; // Stop navigation
    }
  

    return true;
}