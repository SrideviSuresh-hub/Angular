import { Component, inject } from '@angular/core';
import { SubscribeService } from '../../../Services/subscribe.service';

@Component({
  selector: 'app-hero',
  standalone: false,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
 
})
export class HeroComponent {
  //how to provide dependency
  // constructor(private subService:SubscribeService){
  // }
  subService=inject(SubscribeService);
  onSubscribe(){
    this.subService.onSubscribeClicked('monthly');
  }
}