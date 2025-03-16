import { Component, inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../Services/auth.service';



@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  authService: AuthService = inject(AuthService);
  isLoading: boolean = false;
  title = 'template-driven-form';

  userName: string = '';
  firstName: string = '';
  lastName: string = '';
  dob: string = '';
  emailAddress: string = '';
  gender: string = '';
  country: string = '';
  city: string = '';
  region: string = '';
  postal: string = '';
  IsAdmin: boolean = false;
  states: string[] = [];
  password: string = '';
  confirmpassword: string = '';
  locales: string[] = ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'es-ES', 'zh-CN'];
  @ViewChild('registrationForm') form: NgForm;

  genders = [
    { id: 'check-male', value: 'male', display: 'Male' },
    { id: 'check-female', value: 'female', display: 'Female' },
    { id: 'check-other', value: 'Others', display: 'Prefer not to say' },
  ];

  timezones: string[] = [
    'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00',
    'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00',
    'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+05:00',
    'UTC+06:00', 'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00',
    'UTC+12:00'
  ];
  currentStep = 1;
  passwordMatching = true;

  nextStep() {
    if(this.currentStep==1){
      this.currentStep++;
      console.log('Current Step:', this.currentStep);
    }
  }
  
  previousStep() {
  if(this.currentStep==2){
    this.currentStep--;
    console.log('Current Step:', this.currentStep);
  }
}


 
  onCountryChange(event: any) {
    const selectedCountry = event.target.value;;
    if (selectedCountry === "India") {
      this.states = ['Karnataka', 'Andra Pradesh', 'Tamil Nadu', 'Delhi', 'Chennai'];
    } else if (selectedCountry === 'USA') {
      this.states = ['California', 'Texas', 'New York', 'Florida'];
    } else {
      this.states = [];
    }
  }

  validatePassword() {
    this.passwordMatching = this.password === this.confirmpassword;
  }

  

  onSignup(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;
    this.authService.signUp(email, password).subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }
}