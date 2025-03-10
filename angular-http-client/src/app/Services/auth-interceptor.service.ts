import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { exhaustMap, Observable, take, tap } from "rxjs";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";


export class AuthInterceptorService implements HttpInterceptor{
    authService:AuthService=inject(AuthService);
    
    intercept(req: HttpRequest<any>, next: HttpHandler) {
      return  this.authService.user.pipe(take(1),exhaustMap(user=>{
        if(!user){
            return next.handle(req);
        }
            const modifiedReq=req.clone({
                params:new HttpParams().set('auth',user.token   
            )})
        return next.handle(modifiedReq);
    }));
}
}

//  //    const modifiedReq=req.clone({headers:req.headers.append('authHeader','abcxyz')});
//     //     console.log("auth interceptor called" + modifiedReq.url);
//     //     const resp= next.handle(modifiedReq);
//     return next.handle(req).pipe(tap((event:HttpEvent<any>)=>{
//         if(event.type === HttpEventType.Response){
//             console.log('response has arrived ')
//             console.log(event.body);
//         }
//     }))