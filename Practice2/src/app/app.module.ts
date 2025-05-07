import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import Aura from '@primeng/themes/aura'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Comp1Component } from './comp1/comp1.component';
import { Comp2Component } from './comp2/comp2.component';

@NgModule({
  declarations: [
    AppComponent,
    Comp1Component,
    Comp2Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

  ],
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: Aura
        }
    })
],
  bootstrap: [AppComponent]
})
export class AppModule { }
