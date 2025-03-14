import { Inject, Injectable } from "@angular/core";

@Injectable({providedIn:'root'})
export class ActionService{
    value:boolean=false;

    changeAction(){
        this.value=!this.value;
        if(this.value){
            return 'Start Again';  
        }
        else{
            return 'Done';
        }
    }
}