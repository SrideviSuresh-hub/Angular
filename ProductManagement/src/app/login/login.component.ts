import { Component, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

router:Router=inject(Router);
authService:AuthService=inject(AuthService);
 login={email:'', password:''}

 isLoading:boolean=false;
 errorMessage: string | null = null;
 
 onLogin(form:NgForm){
  if(form.invalid) return;
  const email=form.value.email;
  const password=form.value.password;
  this.isLoading=true;
  this.authService.login(email,password).subscribe({
    next:(user)=>{
      if(user){
        this.isLoading=false;
        this.router.navigate(['/portal'])
      }
      else{
        this.isLoading=false;
        this.errorMessage="Invalid data not found";
      }
    },
    error:(errMsg)=>{
              this.isLoading=false;
              this.errorMessage=errMsg;
              this.hideSnackBar();
            }
  })
    form.reset();
 }
 
 
 hideSnackBar(){
  setTimeout(()=>{
    this.errorMessage=null
  },3000);
 }

}



// onLogin(form:NgForm){
//   if(form.invalid) return ;

//   const email=form.value.email;
//   const password=form.value.password;
//   this.isLoading=true;
  
//     this.authService.login(email,password).subscribe({
//       next:(resp)=>{console.log(resp)
//         this.isLoading=false;
//         this.authService.active=true;
//         this.router.navigate(['/portal']);
//       },
//       error:(errMsg)=>{
//         this.isLoading=false;
//         this.errorMessage=errMsg;
//         this.authService.active=false;
//         this.hideSnackBar()
//       }
//     })
//     form.reset();
//  }