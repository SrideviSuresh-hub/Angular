import { Component } from '@angular/core';
import { SubscribeService } from '../../../Services/subscribe.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
 
})
export class SidebarComponent {
  //how to provide dependency
  constructor(private subService:SubscribeService){
  }
  onSubscribe(){
    this.subService.onSubscribeClicked('quaterly');
  }
}
