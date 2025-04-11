import { Component, inject } from '@angular/core';
import { UserService } from '../Services/user.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

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
ngOnInit(){
  setTimeout(() => {
    // Focus the username input after the component loads
    document.getElementById('username')?.focus();
  }, 0);
}
 onLogin(){
 console.log(this.username+" "+this.password);
 this.userService.getUserByUsername(this.username).subscribe({
  next:(user)=>{
    console.log(user);
    
    if(user && user.password===this.password){
      this.router.navigate(['/portal/home']);
    }
    else{
      this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Credentials' });

    }
  },
  error:(err)=>{
    this.msgService.add({ severity: 'error', summary: 'Error', detail:err.message});

  }
 })
}
}
