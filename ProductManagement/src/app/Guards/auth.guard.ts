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
  
    console.log('Requested route:', requestedRoute);
    if (isAdmin && (requestedRoute.includes('portal/usersHome') )) {
      console.log('Admin already on usersHome, redirecting to home');
      router.navigate(['/portal/home']);
      return false; 
    } else if (!isAdmin && requestedRoute.includes('portal/home')) {
      console.log('Non-admin already on home, redirecting to usersHome');
      router.navigate(['/portal/userhome']);
      return false; 
    }
   
    return true;
}