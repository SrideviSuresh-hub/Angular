import { Component, } from '@angular/core';
// ElementRef, QueryList, ViewChild, ViewChildren

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  // title = 'angular-view-children';
}














//ng-container
// toggle:Boolean=true;
// onToggle(){
//   this.toggle=!this.toggle;
// }




//angular-view-children
// fullname:string="";
// @ViewChildren('inputEL')
// inputElements:QueryList<ElementRef>;

// show(){
//  let name='';
//    this.inputElements.forEach(i=>
//    {
//      name+=i.nativeElement.value+" ";
//    }
//    ) 
//    this.fullname=name.trim();  
// }