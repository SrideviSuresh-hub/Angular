import { Injectable } from "@angular/core";

@Injectable()
export class CounterService{
counter:number=0;
increment(compName:string){
    console.log(compName+":"+this.counter++);
}
}