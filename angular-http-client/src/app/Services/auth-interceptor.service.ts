import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, tap } from "rxjs";


export class AuthInterceptorService implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //    const modifiedReq=req.clone({headers:req.headers.append('authHeader','abcxyz')});
    //     console.log("auth interceptor called" + modifiedReq.url);
    //     const resp= next.handle(modifiedReq);
        return next.handle(req).pipe(tap((event:HttpEvent<any>)=>{
            if(event.type === HttpEventType.Response){
                console.log('response has arrived ')
                console.log(event.body);
            }
        }))
    }
}