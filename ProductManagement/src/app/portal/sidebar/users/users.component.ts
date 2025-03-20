import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../../Services/users.service';
import { User } from '../../../Models/User';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
userService:UsersService=inject(UsersService);
users:User[];
selectedUser:User|null=null;
displayDialog:boolean=false;
isNewUser:boolean=false;

  ngOnInit() {
    this.loadUsers()
  }
  loadUsers(){
    this.userService.getUsers().subscribe((user)=>{
      this.users = Object.keys(user).map(key => ({ ...user[key], id: key }));
    })
  }
  addUser(){
    console.log('lalalalal')
    this.displayDialog=true;
    this.isNewUser=true;
    this.selectedUser= 
    {username:'',
      firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    email: '',
    mobile: '',
    address1: '',
    address2: '',
    country: '',
    state: '',
    zipCode: '',
    timezone: '',
    locale: '',
    image: '',
    isAdmin: false
  };
 

  }
editUser(user:User){
  this.selectedUser={...user};
  this.displayDialog=true;
  this.isNewUser=false;
}  
deleteUser(user:User){
this.userService.deleteUser(user.id).subscribe(()=>{
  this.loadUsers();
});

}
saveUser(){
  if(this.isNewUser){
    this.userService.addUser(this.selectedUser).subscribe(()=>{
      this.loadUsers();
    });
  }
  else{
    this.userService.updateUser(this.selectedUser).subscribe(()=>{
      this.loadUsers();
    });

  }
  this.displayDialog=false
}
}
