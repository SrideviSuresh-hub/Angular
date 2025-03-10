import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { RouteModule } from '../app/route.module';
import { SharedModule } from './shared.module';
import { CoreModule } from './core.module';
import { CounterService } from './Services/counter.service';
// import { AuthModule } from './login/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouteModule,
    SharedModule,
    CoreModule
    
  ],
  
    providers:[CounterService],

  bootstrap: [AppComponent]
})
export class AppModule { }
