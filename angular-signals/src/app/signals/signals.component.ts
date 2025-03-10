import { Component, computed, DoCheck, effect, signal } from '@angular/core';

@Component({
  selector: 'app-signals',
  standalone: false,
  templateUrl: './signals.component.html',
  styleUrl: './signals.component.css'
})
export class SignalsComponent implements DoCheck {
  counter = signal(0);//writable 
  message = signal<string[]>([]);
  doubleCounter=computed(()=>this.counter()*2);
  
  increment() {
    this.counter.update((n)=>n+1);
    this.message.update((prev)=>{
      prev.push('counter:'+this.counter());
    return prev;});
    
  }
  decrement() {
    // this.counter.set(this.counter()-1)
    this.counter.update((prevValue)=>prevValue-1);
    this.message.update((prev)=>{
      prev.push('counter:'+this.counter());
    return prev;});

  }
  constructor(){
    effect(()=>console.log('new counter value is'+this.counter()))
  }
  ngDoCheck() {
    console.log("change detection cycle");
  }
}
