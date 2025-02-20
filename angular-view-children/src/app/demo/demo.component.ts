import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-demo',
  standalone: false,
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export class DemoComponent {
  
  textInput:string='hi using property binding';
  logValue(){
    console.log('event binding in component');
  }
}
