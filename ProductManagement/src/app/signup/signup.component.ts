import { Component, inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';



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
  timezonee:string='';
  localee:string='';
  userName: string = '';
  firstName: string = '';
  lastName: string = '';
  dob: string = '';
  emailAddress: string = '';
  phone:number;
  // gender: string = '';
  street1:string='';
  street2:string='';
  country: string = '';
  city: string = '';
  postal: string = '';
  IsAdmin: boolean=false;
  statee:string='';
  states: string[] = [];
  password: string = '';
  imageUrl: string | ArrayBuffer | null = "assets/images/defaultAvatar.png";
  confirmpassword: string = '';
  locales: string[] = ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'es-ES', 'zh-CN'];
  userInitials: string = "";

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
  generateIntials(){
    this.userInitials=`${this.firstName.charAt(0).toUpperCase()}${this.lastName.charAt(0).toUpperCase()}`
  }

  // genders = [
  //   { id: 'check-male', value: 'male', display: 'Male' },
  //   { id: 'check-female', value: 'female', display: 'Female' },
  //   { id: 'check-other', value: 'Others', display: 'Prefer not to say' },
  // ];
  genders:any[]=[{label:"Male", gender: 'male'},{label:"Female", gender: 'female'},{label:"Prefer not to say", gender: 'others'}]
 gender!:string;
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
      this.states = ['Karnataka',' Andhra Pradesh', 'Tamil Nadu', 'Delhi', 'Chennai'];
    } else if (selectedCountry === "USA") {
      this.states = ['California', 'Texas', 'New York','Florida'];
    } else {
      this.states = [];
    }
  }

  validatePassword(password, confirmpassword) {
    this.passwordMatching = password === confirmpassword;
  }
  

  onSignup(form : NgForm) {
    if (form.invalid || !this.passwordMatching) {
      return;
    }
    
    this.isLoading=true;
    this.errorMessage='';
    
    let userData={
      username : this.userName,
      firstName : this.firstName,
      lastName : this.lastName,
      genders: this.gender,
      dob : this.dob,
      email : this.emailAddress,
      mobile : this.phone,
      address1 : this.street1,
      address2 : this.street2 ,
      country : this.country,
      states : this.statee,
      zipCode : this.postal,
      timezones : this.timezonee,
      locales :this.localee,
      image :this.imageUrl, 
      isAdmin : this.IsAdmin, 
      password : this.password
    };
    
    this.authService.signUp(userData).subscribe(
      {  
        next:(user)=>{
          this.isLoading=false;
          console.log(user);
          alert('Signup successful! You can now log in.');
          this.router.navigate(['/login']);
        },
        error:(errMsg)=>{
          this.isLoading=false;
          this.errorMessage='Signup Failed. Try Again';
        }
     });
   
    }
}

  // onFileSelected(event: any) {
  //   const file = event.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => this.imageUrl = e.target?.result;
  //     reader.readAsDataURL(file);
  //   }
  // }

    // profileImage: string | ArrayBuffer | null = null;

  // selectFile(e: any): void{
  //   let a = e.target.files[0].type
  //   let b = e.target.files[0].size / (1024 * 1024)
  //   if( a == "image/jpeg" || a == "image/jpg" && b < 2){
  //     // this.selectedFile = e.target.files[0]
  //     const reader = new FileReader();
  //     reader.readAsDataURL(e.target.files[0])
  //     reader.onload = ((event: any)=>{
  //       this.profileImage = event.target.result
  //     })
  //   }else{
  //     // this.messageService.add({ severity: 'error', summary: 'Invalid image format or file size exceeds 2MB limit' });
  //   }
  // }

  // onProfileUpload(event: any) {
  //   const file = event.files[0];

  //   // Check if file type is JPG/PNG
  //   if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
  //     const reader = new FileReader();

  //     reader.onload = ((e: any) => {
  //       this.profileImage = e.target.result;
  //       console.log(this.profileImage) // Save image for preview
  //     });

  //     reader.readAsDataURL(file);
  //   } else {
  //     alert("Only JPG and PNG formats are allowed.");
  //   }
  // }
  
  
    // onFileChange(event: any) {
    //   const file = event.target.files[0];
    //   if (file && file.size < 2 * 1024 * 1024) { // Restrict to 2MB
    //     const reader = new FileReader();
    //     reader.onload = () => this.profileImage = reader.result as string;
    //     reader.readAsDataURL(file);
    //   } else {
    //     this.errorMessage = 'Image must be less than 2MB!';
    //   }
    // }
 
  












  // onSignup(form: NgForm) {
  //   const email = form.value.email;
  //   const password = form.value.password;
  //   this.isLoading = true;
  //   this.authService.signUp(email, password).subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       this.isLoading = false;
  //     }
  //   });
  // }

