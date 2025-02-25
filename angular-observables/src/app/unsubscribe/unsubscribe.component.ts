import { Component } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-unsubscribe',
  standalone: false,
  templateUrl: './unsubscribe.component.html',
  styleUrl: './unsubscribe.component.css'
})
export class UnsubscribeComponent {

  counter=interval(1000);
  data1:number[]=[];
  data2:number[]=[];

  subscriber1;
  subscriber2;

  onSubscribe1(){
      this.subscriber1=this.counter.subscribe((val)=>{
        
        this.data1.push(val);
      })
  }

  onUnSubscribe1(){
    this.subscriber1.unsubscribe();
   
  }

  onSubscribe2(){
      this.subscriber2=this.counter.subscribe((val)=>{
        
        this.data2.push(val);
      })
  }

  onUnSubscribe2(){
    this.subscriber2.unsubscribe();
   
  }
}
