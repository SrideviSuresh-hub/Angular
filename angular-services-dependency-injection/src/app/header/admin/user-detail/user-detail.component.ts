import { Component, Inject, inject, Injectable, OnInit } from '@angular/core';
import { User } from '../../../Models/User';
import { UserService } from '../../../Services/user.service';
import { User_Token } from '../../../app.module';

@Component({
  selector: 'user-detail',
  standalone: false,
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})

export class UserDetailComponent implements OnInit {

  selectedUser:User;
  constructor(@Inject(User_Token) private userService:UserService){}
  ngOnInit(){
    this.userService.onUserDetailsClicked.subscribe((data:User)=>{
     this.selectedUser=data;
     
    })
  }
}
