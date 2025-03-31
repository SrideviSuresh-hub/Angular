import { Component, inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  isLoading: boolean = false;
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  errorMessage: string = '';
  timezonee: string = '';
  localee: string = '';
  username: string = '';
  firstName: string = '';
  lastName: string = '';
  dob: string = '';
  emailAddress: string = '';
  phone: number;
  street1: string = '';
  street2: string = '';
  country: string = '';
  city: string = '';
  postal: string = '';
  IsAdmin: boolean = false;
  // statee: string = '';
  states: string[] = [];
  state: string = ''
  password: string = '';
  imageUrl: string | ArrayBuffer | null = "assets/images/defaultAvatar.png";
  confirmpassword: string = '';
  locales: string[] = ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'es-ES', 'zh-CN'];
  userInitials: string = "";

  messageService:MessageService=inject(MessageService);

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail });
  }
  triggerFileInput() {
    document.getElementById('fileInput')?.click();
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file && file.size < 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => this.imageUrl = e.target?.result;
      reader.readAsDataURL(file);
    } else {
      alert("File must be PNG or JPG and less than 2MB.");
    }
  }
  generateIntials() {
    this.userInitials = `${this.firstName.charAt(0).toUpperCase()}${this.lastName.charAt(0).toUpperCase()}`
  }

  genders: any[] = [{ label: "Male", gender: 'male' }, { label: "Female", gender: 'female' }, { label: "Prefer not to say", gender: 'others' }]
  gender!: string;
  timezones: string[] = [
    'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00',
    'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00',
    'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+05:00',
    'UTC+06:00', 'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00',
    'UTC+12:00'
  ];

  @ViewChild('signupForm') form: NgForm;

  currentStep = 1;
  passwordMatching = true;

  nextStep() {
    if (this.currentStep == 1) {
      this.currentStep++;
      console.log('Current Step:', this.currentStep);
    }
  }
  previousStep() {
    if (this.currentStep == 2) {
      this.currentStep--;
      console.log('Current Step:', this.currentStep);
    }
  }

  onCountryChange(event: any) {
    const selectedCountry = event.target.value;
    if (selectedCountry === "India") {
      this.states = ['Karnataka', ' Andhra Pradesh', 'Tamil Nadu', 'Delhi', 'Chennai'];
    } else if (selectedCountry === "USA") {
      this.states = ['California', 'Texas', 'New York', 'Florida'];
    } else {
      this.states = [];
    }
  }

  validatePassword(password, confirmpassword) {
    this.passwordMatching = password === confirmpassword;
  }


  onSignup(form: NgForm) {
    if (form.invalid || !this.passwordMatching) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.getAllUsers().subscribe({
      next: (users) => {
        const existingUser = users.find(user => user.username === this.username)
        if (existingUser) {
          this.isLoading = false;
          this.showToast('warn', 'Signup Failed', 'Username already exists! Please choose a different one.');
          return;
        }
        let userData = {
          username: this.username,
          firstName: this.firstName,
          lastName: this.lastName,
          genders: this.gender,
          dob: this.dob,
          email: this.emailAddress,
          mobile: this.phone,
          address1: this.street1,
          address2: this.street2,
          country: this.country,
          state: this.states,
          zipCode: this.postal,
          timezones: this.timezonee,
          locales: this.localee,
          image: this.imageUrl,
          isAdmin: this.IsAdmin,
          password: this.password
        };

        this.authService.signUp(userData).subscribe(
          {
            next: (user) => {
              this.isLoading = false;
              console.log(user);
              this.showToast('success', 'Signup Successful', 'You can now log in.');
              this.router.navigate(['/login']);
            },
            error: (errMsg) => {
              this.isLoading = false;
              this.showToast('error', 'Signup Failed', 'Try Again. ' + errMsg);
            }
          });

      }

    })
  }
}













