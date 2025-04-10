import { Component, inject } from '@angular/core';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;

 userService:UserService=inject(UserService);
 onLogin(){
 console.log(this.username+""+this.password);
 
 }
}
