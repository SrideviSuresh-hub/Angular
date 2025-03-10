import { NgModule } from "@angular/core";
import { AuthInterceptorService } from './Services/auth-interceptor.service';
import { LoggingInterceptorService } from './Services/logging-interceptor.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

@NgModule({
    providers:[ { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptorService, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
      ]
})
export class CoreModule{

}