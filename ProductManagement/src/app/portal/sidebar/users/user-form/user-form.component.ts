import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../../Models/User';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {

  @Input() isEditing: boolean = false;
  @Input() newUser: any = {};
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();
  userImage: string = ''; 
  // genders =[
  //   { id: 'check-male', value: 'Male', display: 'Male' },
  //   { id: 'check-female', value: 'Female', display: 'Female' },
  //   { id: 'check-other', value: 'TransGender', display: 'TransGender' }
  // ];

  genders:any[]=[{label:"Male", gender: 'male'},{label:"Female", gender: 'female'},{label:"Prefer not to say", gender: 'others'}]
  gender!:string;
  
  countries = ['India', 'USA'];
  states = [];
  locales = ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'es-ES', 'zh-CN'];
  timezones = [
    'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00',
    'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00',
    'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+05:00',
    'UTC+06:00', 'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00',
    'UTC+12:00'
  ];

  onCountryChange() {
    this.states = this.newUser.country === 'India'
      ? ['Karnataka', 'Andhra Pradesh', 'Tamil Nadu', 'Delhi', 'Chennai']
      : ['California', 'Texas', 'New York', 'Florida'];
  }

  onImageUpload(event:any){
    const file=event.target.files[0];
    if(file.size<2*1024*1024){
      const reader=new FileReader();
      reader.onload = (e: any) => {
        this.userImage = e.target.result; 
      };
      reader.readAsDataURL(file);
    }
    else{
      alert('Image shld be less tan 2MB!')
    }
  }

  saveUser(){
    if(this.newUser.password!== this.newUser.confirmPassword){
      alert('passwords do not match');
    return;
    }
    this.save.emit(this.newUser);
  }
  cancelDailog(){
    this.cancel.emit();
  }
}

