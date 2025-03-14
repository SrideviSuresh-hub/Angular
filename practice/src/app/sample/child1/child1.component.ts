import { Component, Input } from '@angular/core';
import { User } from './Models/user';

@Component({
  selector: 'app-child1',
  standalone: false,
  templateUrl: './child1.component.html',
  styleUrl: './child1.component.css'
})
export class Child1Component {

  @Input()
  childUser:User;
}
