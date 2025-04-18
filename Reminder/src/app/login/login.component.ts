import { Component, inject } from '@angular/core';
import { UserService } from '../Services/user.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  router:Router=inject(Router);
 userService:UserService=inject(UserService);
msgService:MessageService=inject(MessageService)
authService:AuthService=inject(AuthService);
ngOnInit(){
  setTimeout(() => {
    // Focus the username input after the component loads
    document.getElementById('username')?.focus();
  }, 0);
}
 onLogin(){
 console.log(this.username+" "+this.password);
this.authService.login(this.username,this.password).subscribe({
  next:(user)=>{
    if(user.isAdmin){

      this.router.navigate(['portal/home']);
    }
    else{
      this.router.navigate(['portal/userhome'])
    }
  },
  error:(err)=>{
    this.msgService.add({severity:'error',summary:'login failed',detail:err.mesaage})
  }
})
}
}
