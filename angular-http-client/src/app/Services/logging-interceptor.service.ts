import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";

export class LoggingInterceptorService implements HttpInterceptor{

    intercept(req:HttpRequest<any>,next:HttpHandler){
        console.log('logging interceptor called')
        console.log('req sent to url'+req.url);
        return next.handle(req);
    }
}