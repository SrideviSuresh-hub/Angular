import { Component } from '@angular/core';
import { SubscribeService } from '../Services/subscribe.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  
})
export class HeaderComponent {
  selectedTab:string='home';
  //how to provide dependency
  constructor(private subService:SubscribeService){
  }
  onSubscribe(){
    this.subService.onSubscribeClicked('yearly');
  }
  HomeClicked(){
    this.selectedTab='home';
  }
  AdminClicked(){
    this.selectedTab='admin'
  }
}
