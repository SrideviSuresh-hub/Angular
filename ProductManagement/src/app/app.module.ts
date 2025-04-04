import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { InputTextModule } from 'primeng/inputtext';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';

import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { PasswordModule} from 'primeng/password';
import { HttpClientModule } from '@angular/common/http';
import { Ripple } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClass } from 'primeng/styleclass';
import { PortalRouteModule } from './portal/portal-route.module';
import { routes1 } from './app-routing.module';
import { PortalModule } from './portal/portal.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
@NgModule({
  declarations: [
  AppComponent,
  LoginComponent,
  SignupComponent,
  PageNotFoundComponent,
  
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    PortalModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    DropdownModule,
    CheckboxModule,
    PaginatorModule,
    FormsModule,
    CalendarModule,
    FileUploadModule,
    RouterModule.forRoot(routes1),
    HttpClientModule,
    ProgressSpinnerModule,
  PortalRouteModule,
    Ripple,
    AvatarModule,
    StyleClass
  ],
 
  providers: [   provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: Aura
        }
    })],
  bootstrap: [AppComponent]
})
export class AppModule { }
