import { Component, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  login = {
    username: '',
    password: ''
  }
  isLoading: boolean = false;
  showPasswordDialog: boolean = false;
  newPassword: string = '';
  confirmPassword: string = '';
  userId: string = '';
  passwordError: string = '';
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  messageService: MessageService = inject(MessageService);

  //Checks login status
  ngOnInit() {
    if (Boolean(localStorage.getItem('isLoggedIn'))) {
      this.router.navigate([localStorage.getItem('curPath')]);
    }
  }

  // Validates credentials
  onLogin(form: NgForm) {
    if (form.invalid) {
      if (!form.value.username) {
        this.showError('Please enter a valid email address.');
      }
      // else {
      //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      //   if (!emailRegex.test(form.value.email)) {
      //     this.showError('Please enter a valid email address.');
      //   }
      // }
      if (!form.value.password) {
        this.showError("Password is required!");
      }
      return;
    }
    const name = form.value.username;
    const password = form.value.password;
    this.isLoading = true;
    this.authService.login(name, password).subscribe({
      next: (user) => {
        this.isLoading = false;
        if (user) {
          if (!user) {
            this.showError("Invalid credentials, user not found.");
            return;
          }
          this.userId = user.id;
          if (user.isFirstLogin) {
            this.showPasswordDialog = true;
          } else {
            setTimeout(() => {
              localStorage.setItem('isLoggedIn', 'true');
              if (user.isAdmin) {
                this.router.navigate(['/portal/home']);
              } else {
                this.router.navigate(['/portal/usersHome']);
              }
            }, 100)
          }
          
        } else {
          this.showError("Invalid credentials, user not found.");
        }
      },
      error: (errMsg) => {
        this.isLoading = false;
        this.showError(errMsg);
      }
    });
    form.reset();
  }

  // Displays error message
  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  // Updates password
  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = "Passwords do not match!";
      return;
    }

    if (!this.userId) {
      this.passwordError = "User ID missing!";
      return;
    }

    this.authService.updatePassword(this.userId, this.newPassword).subscribe({
      next: () => {
        this.showPasswordDialog = false;
        this.router.navigate(['/portal']);
      },
      error: () => {
        this.showError("Failed to update password. Try again.");
      }
    });
  }
}


