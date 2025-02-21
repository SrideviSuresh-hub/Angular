import { Component, Inject } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { User_Token } from '../../app.module';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
 
})
export class AdminComponent {

constructor( @Inject(User_Token) private userService:UserService){}
 name:string='';
 gender:string='male';
 subType:string='yearly';
 status:string='active';

 createNewUser(){
   this.userService.createUser(this.name,this.gender,this.subType,this.status);
   console.log(this.userService.users)
 }
}
