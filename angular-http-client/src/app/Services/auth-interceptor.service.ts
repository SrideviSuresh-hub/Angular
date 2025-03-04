import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
// import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

// @Injectable({
//     providedIn:'root'
// })
export class AuthInterceptorService implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       
        console.log("auth interceptor called");
        return next.handle(req);
    }
}