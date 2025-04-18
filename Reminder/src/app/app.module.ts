import { NgModule } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { BrowserModule } from '@angular/platform-browser';
import Aura from '@primeng/themes/aura'
import { AppRoutingModule, routes1 } from './app-routing.module';
import { AppComponent } from './app.component';
import { providePrimeNG } from 'primeng/config';
import { LoginComponent } from './login/login.component';
import { PortalModule } from './portal/portal.module';
import { RouterModule } from '@angular/router';
import { PortalRouteModule } from './portal/portals-route.module';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PortalModule,
    PortalRouteModule,
    RouterModule.forRoot(routes1)
  ],
  exports: [

  ],
  providers: [provideAnimationsAsync(),
  providePrimeNG({
    theme: {
      preset: Aura
    }
  })],
  bootstrap: [AppComponent]
})
export class AppModule { }
