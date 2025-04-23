import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../Services/auth.service";
import { inject } from "@angular/core";

export const canActivate = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> => {
    const authService: AuthService = inject(AuthService);
    console.log(authService.isLoggedIn());
   const user=authService.getcurUser();
        if(authService.isLoggedIn()){
            localStorage.setItem('isLoggedIn','true')
        }
        const  router= inject(Router);
        if (!authService.isLoggedIn()) {
            return router.createUrlTree(['/login']); 
        }
       
        const isAdmin = authService.isAdmin();
        const requestedRoute = state.url;
        console.log('Requested route:', requestedRoute);
        if (isAdmin && (requestedRoute.includes('portal/userhome') )) {
          console.log('Admin already on usersHome, redirecting to home');
          return router.createUrlTree(['/portal/home']);
        } else if (!isAdmin && requestedRoute.includes('portal/home')) {
            console.log("Non-admin should be on /portal/userhome, redirecting");
        return router.createUrlTree(['/portal/userhome']);
        }
        console.log("Access granted to:", requestedRoute);
        return true;
        // if(user){
        //     if (user.isAdmin) {
        //         router.navigate(['/portal/home']);
        //     } else {
        //         router.navigate(['/portal/userhome']);
        //     }
        //     return false;
        // }
        // else{
        //     router.navigate(['/login']);
        //     return false;
        // }
    }
