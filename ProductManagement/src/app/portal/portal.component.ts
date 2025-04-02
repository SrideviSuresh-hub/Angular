import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-portal',
  standalone: false,
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.css'
})
export class PortalComponent {
  selectedLabel: string = '';

  onLabelSelected(label: string) {
    this.selectedLabel = label;
    console.log("Selected Label: ", label);
  }

}
