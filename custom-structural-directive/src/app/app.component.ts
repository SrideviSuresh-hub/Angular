import { Component, ElementRef, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'custom-structural-directive';
  @Input()display:boolean=false;
 
  displayDiv(){
    this.display=true;
  }
}
