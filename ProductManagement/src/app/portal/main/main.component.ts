import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  
  // Receives sidebar collapse state
  @Input() isLeftSidebarCollapsed: boolean = false;
}
