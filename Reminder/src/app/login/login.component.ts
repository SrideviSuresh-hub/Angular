import { Component, inject } from '@angular/core';
import { UserService } from '../Services/user.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../Services/auth.service';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../Services/notification.service';
import { User } from '../Models/Users';
import { SampleService } from '../Services/sample.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  router: Router = inject(Router);
  userService: UserService = inject(UserService);
  msgService: MessageService = inject(MessageService)
  authService: AuthService = inject(AuthService);
  sampleService:SampleService=inject(SampleService);
  curUser: User  = this.authService.getcurUser();
// Loads order and product data
  ngOnInit() {
    if (Boolean(localStorage.getItem('isLoggedIn'))) {
      this.router.navigate([localStorage.getItem('curPath')]);
    }
  }

  // Validates login form and navigates
  onLogin(form: NgForm) {
    if (form.invalid) {
      if (!form.value.username) {
        this.msgService.add({ severity: 'warn', summary: 'Validation Error', detail: "Please enter a valid user name!" });
      }
      if (!form.value.password) {
        this.msgService.add({ severity: 'warn', summary: 'Validation Error', detail: "Password is required!" });
      }
      return;
    }
    this.authService.login(this.username, this.password).subscribe({
      next: (user) => {
        if (user) {
          setTimeout(() => {
            localStorage.setItem('isLoggedIn', 'true');
            // localStorage.setItem('popupClosed', 'false');
            if (user.isAdmin) {
              this.router.navigate(['/portal/home']);
            } else {
              this.router.navigate(['/portal/userhome']);
              localStorage.setItem(`popupClosed`, 'false');

              // if(user.id){
              //   this.sampleService.setPopupVisible(true,user.id)
              // }
            }
          }, 100)
        }
      },
      error: (err) => {
        this.msgService.add({ severity: 'error', summary: 'please enter valid credentials', detail: err.mesage })
      }
    })
  }
}
