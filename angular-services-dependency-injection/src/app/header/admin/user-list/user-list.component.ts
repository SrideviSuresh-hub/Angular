import { Component, Inject, Injectable } from '@angular/core';
import { UserService } from '../../../Services/user.service';
import { User } from '../../../Models/User';
import { User_Token } from '../../../app.module';

@Component({
  selector: 'user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})

export class UserListComponent {
  constructor(@Inject(User_Token) private userService:UserService){}
  userList:User[]=[];
  ngOnInit(){  
  this.userList=this.userService.getAllUsers();
    }
  showUserDetails(user:User){
      this.userService.onShowuserDetails(user);
    }
}
