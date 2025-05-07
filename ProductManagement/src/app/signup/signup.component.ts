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
  isFirstLogin: boolean = true;
  states: string[] = [];
  state: string = ''
  password: string = '';
  imageUrl: string | ArrayBuffer | null = "assets/images/defaultAvatar.png";
  confirmpassword: string = '';
  currentStep = 1;
  passwordMatching = true;
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  messageService: MessageService = inject(MessageService);
  locales: string[] =
    ['en-US',
      'en-GB',
      'fr-FR',
      'de-DE',
      'es-ES',
      'zh-CN'];
  countries = [
    { label: 'India', value: 'India' },
    { label: 'USA', value: 'USA' }
  ];
  userInitials: string = "";
  genders: any[] =
    [
      { label: "Male", gender: 'male' },
      { label: "Female", gender: 'female' },
      { label: "Others", gender: 'others' }
    ]
  gender: string;
  timezones: string[] =
    [
      "IST - UTC+5:30",
      "PST - UTC-8",
      "EST - UTC-5",
      "CST - UTC-6",
      "MST - UTC-7",
      "AKST - UTC-9"
    ];
  
  // toast notification with custom message severity
  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail });
  }

  //Triggers file selection
  triggerFileInput() {
    document.getElementById('fileInput')?.click();
  }

  //Handles image upload
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.size < 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => this.imageUrl = e.target?.result;
      reader.readAsDataURL(file);
    } else {
      this.showToast('warn', 'image upload failed','File must be PNG or JPG and less than 2MB.');
    }
  }

  //Resets avatar
  removeAvatar(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.imageUrl !== "assets/images/defaultAvatar.png") {
      this.imageUrl = "assets/images/defaultAvatar.png";
    }
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value ="";
    }
  }

  //Generates user initials
  generateIntials() {
    this.userInitials = `${this.firstName.charAt(0).toUpperCase()}${this.lastName.charAt(0).toUpperCase()}`
  }

  //Moves to the next step
  nextStep() {
    if (this.currentStep == 1) {
      this.currentStep++;
    }
  }

  //Moves back to the previous step
  previousStep() {
    if (this.currentStep == 2) {
      this.currentStep--;
    }
  }

  //Loads states dynamically based on country
  onCountryChange(event: any) {
    const selectedCountry = event.value||event.target.value;
    if (selectedCountry === "India") {
      this.states = ['Karnataka', 'Tamil Nadu', 'Delhi', "Madhya Pradesh", "Maharashtra", 'Kerala', "Haryana", "Himachal Pradesh"];
    } else if (selectedCountry === "USA") {
      this.states = ["California", "New York", "Texas", "Florida", "Illinois", "Pennsylvania", "Ohio", "Georgia", "Washington", "Massachusetts"]
    } else {
      this.states = [];
    }
  }

  // Checks if passwords match
  validatePassword(password, confirmpassword) {
    this.passwordMatching = password === confirmpassword;
  }

  // Validates form, checks duplicate usernames, and submits signup data
  onSignup(form: NgForm) {
    let hasError = false;
    if (!this.username) {
      this.showToast('warn', 'Missing Field', 'Username is required.');
      hasError = true;
    } else if (!/^[a-zA-Z0-9]+$/.test(this.username)) {
      this.showToast('warn', 'Invalid Username', 'Username must be alphanumeric.');
      hasError = true;
    }
    if (!this.firstName) {
      this.showToast('warn', 'Missing Field', 'First Name is required.');
      hasError = true;
    } else if (!/^[a-zA-Z0-9]+$/.test(this.firstName)) {
      this.showToast('warn', 'Invalid First Name', 'First Name must be alphanumeric.');
      hasError = true;
    }

    if (!this.emailAddress) {
      this.showToast('warn', 'Missing Field', 'Email is required.');
      hasError = true;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.emailAddress)) {
      this.showToast('warn', 'Invalid Email', 'Enter a valid email address.');
      hasError = true;
    }

    if (!this.phone) {
      this.showToast('warn', 'Missing Field', 'Phone Number is required.');
      hasError = true;
    } else if (!/^\d{10}$/.test(this.phone.toString())) {
      this.showToast('warn', 'Invalid Mobile Number', 'Enter a 10-digit phone number.');
      hasError = true;
    }

    if (!this.street1) {
      this.showToast('warn', 'Missing Field', 'Address Line 1 is required.');
      hasError = true;
    }

    if (!this.password) {
      this.showToast('warn', 'Missing Field', 'Password is required.');
      hasError = true;
    }

    if (!this.confirmpassword) {
      this.showToast('warn', 'Missing Field', 'Confirm Password is required.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    if (form.invalid || !this.passwordMatching) {
      return;
    }

    if (!this.passwordMatching) {
      this.showToast('error', 'Password Mismatch', 'Passwords do not match.');
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
          state: this.state,
          zipCode: this.postal,
          timezones: this.timezonee,
          locales: this.localee,
          image: this.imageUrl,
          isAdmin: this.IsAdmin,
          password: this.password,
          isFirstLogin: this.firstName
        };

        this.authService.signUp(userData).subscribe(
          {
            next: (user) => {
              this.isLoading = false;
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






