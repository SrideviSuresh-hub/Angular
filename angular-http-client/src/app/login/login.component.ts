import { Component, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Observable } from 'rxjs';
import { AuthResponse } from '../Models/authResponse';
import { Router } from '@angular/router';
import { CounterService } from '../Services/counter.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  errorrMsgg: string = null;
  authService: AuthService = inject(AuthService);
  authObs:Observable<AuthResponse>;
  router:Router=inject(Router);
  
    counterService:CounterService=inject(CounterService);
    ngOnInit(){
      this.counterService.increment('LoginComponent')
  
    }
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  onFormSubmit(form: NgForm) {
    console.log(form.value);
    const email = form.value.email;
    const password = form.value.password;
    if (this.isLoginMode) {
     this.authObs= this.authService.login(email,password)
    }
    else {
      this.isLoading = true
      this.authObs=this.authService.signup(email, password)
    }
    this.authObs.subscribe(
      {
        next: (resp) => {
          console.log(resp)
          this.isLoading = false;
          this.router.navigate(['/dashboard'])
          
        }, error: (errMsg) => {
          this.isLoading = false;
          this.errorrMsgg = errMsg;
      this.hideSnakeBar()

        }
      });
      form.reset();
  }
  hideSnakeBar(){
    setTimeout(() => {
      this.errorrMsgg = null;
    }, 3000);
  }
  }


