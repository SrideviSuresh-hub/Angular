import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-lifecycle-hook';
  inputVal:string=''
;// ;  inputVal: string[]= ['hello','hi there'];

toDestroy:boolean=false;
  constructor() {
    console.log('app constructor called');
  }
  ngAfterViewInit(){
    console.log("ngAfterViewInit parent is called"); 
 } 
 ngAfterViewChecked(){
  console.log("ngAfterViewChecked parent is called"); 
} 
 

  onBtnClicked(inputEl: HTMLInputElement) {
    this.inputVal = inputEl.value;
    // this.inputVal.push( inputEl.value);
  }

  destroyComponent(){
    this.toDestroy=!this.toDestroy;
  }
}
