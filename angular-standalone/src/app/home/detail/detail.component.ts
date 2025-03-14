import { Component, inject } from '@angular/core';
import { ActionService } from '../shared/action .service';

@Component({
  selector: 'app-detail',
  standalone: false,
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent {

  action:string='Done';
 actionService:ActionService=inject(ActionService);
  onClick(){
    this.actionService.changeAction()
  }
}
