import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, ContentChild, DoCheck, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-demo',
  standalone: false,
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})

export class DemoComponent implements OnChanges,OnInit,DoCheck,AfterContentInit,AfterViewInit,AfterViewChecked,OnDestroy{
  title:string="demo component";
  @Input() msg:string;
  // @Input() msg:string[];
  @ViewChild('temp')
  tempPara:ElementRef;

  @ContentChild('temp')
  paraContent:ElementRef;

 constructor(){
  console.log("demo constructor called");
  // console.log(this.title);
  // console.log(this.msg);
}

ngOnChanges(changes:SimpleChanges){
  console.log('ngOnChange hook is called');
  //  console.log(this.msg);
  // console.log( changes)
}
ngOnInit(){
  console.log("ngOnInit Called");
  // console.log("in ngOnInit-"+this.paraContent);
  // console.log(this.tempPara.nativeElement.innerHTML)-- error 
}
ngDoCheck(){
  console.log("ngDoCheck hook called");
  // console.log("in ngDoCheck-"+this.paraContent);
}
ngAfterContentInit(){
  console.log('ngAfterContentInit is called')
  // console.log("in ngAfterContentInit-"+ this.paraContent);
}

ngAfterContentChecked(){
   console.log("in ngAfterContentChecked-")
  //  + this.paraContent.nativeElement);
  //  console.log("in ngAfterContentChecked-"+ this.tempPara);   
   
  }
  ngAfterViewInit(){
    console.log("ngAfterViewInit is called")
    // console.log("in ngAfterViewInit-"+ this.tempPara);   
  } 
  ngAfterViewChecked(){
    console.log(" ngAfterViewChecked called");   
    // console.log("in ngAfterViewInit-"+ this.tempPara.nativeElement.textContent);   
  
 }
 ngOnDestroy(){
  console.log('ngOnDestroy called');
 }
}
