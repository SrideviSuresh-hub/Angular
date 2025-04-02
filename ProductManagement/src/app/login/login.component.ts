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
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  messageService: MessageService = inject(MessageService);
  login = { email: '', password: '' }

  isLoading: boolean = false;
  showPasswordDialog: boolean = false;
  newPassword: string = '';
  confirmPassword: string = '';
  userId: string = '';
  passwordError: string = '';

  onLogin(form: NgForm) {
    if (form.invalid){
      if (!form.value.email) {
        this.showError("Email is required!");
      } else if (!form.value.password) {
        this.showError("Password is required!");
      } else {
        this.showError("Please fill in all required fields correctly.");
      }
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;
    this.authService.login(email, password).subscribe({
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
            // this.router.navigate(['/portal']);
            if (user.isAdmin) {
              this.router.navigate(['/portal/home']);
            } else {
              // If the user is not an admin, navigate to the users' home
              this.router.navigate(['/portal/usersHome']);
            }
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

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

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


