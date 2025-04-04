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
    if(label!== 'Home')
    {
    this.selectedLabel = `Home > ${label}`;
    }
    else{
      this.selectedLabel="";
    }
    console.log("Selected Label: ", this.selectedLabel);
  }

}
