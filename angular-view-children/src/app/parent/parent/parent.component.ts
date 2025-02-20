import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-parent',
  standalone: false,
  templateUrl: './parent.component.html',
  styleUrl: './parent.component.css'
})
export class ParentComponent {
@ViewChild('para') parentPara:ElementRef;
// @ContentChild('para') parentPara:ElementRef;-undefined
showParpara(){
  console.log(this.parentPara);
}
}
