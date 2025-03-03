import { Component, inject, OnInit } from '@angular/core';
import { Router ,Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent  implements OnInit{
  title = 'angular-routing';
  router:Router=inject(Router);
showLoader:boolean=false;
  ngOnInit(){
    this.router.events.subscribe((routerEvent:Event)=>{
      if(routerEvent instanceof NavigationStart){
        this.showLoader=true;
      }
      if(routerEvent instanceof NavigationEnd || routerEvent instanceof NavigationCancel || routerEvent instanceof NavigationError)
      {
        this.showLoader=false;
      }

     
    })
  }
  
}
