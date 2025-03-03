import { Component } from '@angular/core';
import { IDeactivateComponent } from '../Services/authguard.service';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements IDeactivateComponent{
fname:string='';
lname:string='';
country:string='india';
msg:string='';

isSubmitted:boolean=false;

onSubmit(){
   this.isSubmitted=true;
}
canExit(){
  if((this.fname || this.lname || this.msg) && !this.isSubmitted){
   return confirm('you have unSaved Changes. Do u want to navigate away??');

  }
  else{
    return true;
  }
}
}
