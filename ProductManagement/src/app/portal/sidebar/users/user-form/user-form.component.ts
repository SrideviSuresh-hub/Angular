import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../../Models/User';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {

  @Input()  isNewUser:boolean=false;
  @Input()  selectedUser:User|null=null
  @Input()  displayDailog:boolean=false;
  @Output()  save=new EventEmitter<User>();
  @Output()  cancel=new EventEmitter<void>();


  onImageUpload(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (this.selectedUser) {
        this.selectedUser.image = reader.result as string;
      }
    };
    reader.readAsDataURL(file);
  }
  saveUser(){
    if(this.selectedUser){
      this.save.emit(this.selectedUser);
    }
  }
  cancelDailog(){
    this.cancel.emit();
  }
}
