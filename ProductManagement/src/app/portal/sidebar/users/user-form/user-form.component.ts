import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { User } from '../../../../Models/User';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../Services/auth.service';
import { UsersService } from '../../../../Services/users.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {

 
  @Input() user: any = {};
  @Output() closeForm = new EventEmitter<void>();
  userService:UsersService=inject(UsersService);
  authService: AuthService = inject(AuthService);
  msgService:MessageService=inject(MessageService);
  router: Router = inject(Router);
  errorMessage: string = '';
  states:string[]=[];
  state:string='';
  imageUrl: string | ArrayBuffer | null = "assets/images/defaultAvatar.png";
  file: File | null = null;
  locales: string[] = ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'es-ES', 'zh-CN'];
  // userInitials: string = "";

  // ngOnInit(){
  //  this.user=this.getEmptyUser();
  // }
  
  triggerFileInput() {
    document.getElementById('fileInput')?.click();
  }
  onFileSelected(event: any) {
    this.file = event.target.files[0];

    if (this.file && this.file.size < 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => this.imageUrl = e.target?.result;
      reader.readAsDataURL(this.file);
    } else {
      alert("File must be PNG or JPG and less than 2MB.");
    }
  }
  // generateIntials() {
  //   this.userInitials = `${this.firstName.charAt(0).toUpperCase()}${this.lastName.charAt(0).toUpperCase()}`
  // }

  genders: any[] = [{ label: "Male", gender: 'male' }, { label: "Female", gender: 'female' }, { label: "Prefer not to say", gender: 'others' }]
  gender!: string;
  timezones: string[] = [
    'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00',
    'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00',
    'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+05:00',
    'UTC+06:00', 'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00',
    'UTC+12:00'
  ];
  
  onCountryChange(event: any) {
    const selectedCountry = event.target.value;
    if (selectedCountry === "India") {
      this.states= ['Karnataka', ' Andhra Pradesh', 'Tamil Nadu', 'Delhi', 'Chennai'];
    } else if (selectedCountry === "USA") {
      this.states = ['California', 'Texas', 'New York', 'Florida'];
    } else {
      this.states = [];
    }
  }


  onSave(form:NgForm) {
    if (form.invalid) return;
    console.log("User Before Save:", this.user);
    if(this.file){
      setTimeout(() => {
        this.user.image=this.imageUrl;
        this.saveUser(form);
      }, 1000);
    }
    else{
      this.saveUser(form);
    }

  }
 
  saveUser(form:NgForm){
    if(this.user.id){
      console.log("Updating User:", this.user);
      this.userService.updateUser(this.user).subscribe({next:(resp)=>{
        console.log(resp);
        this.msgService.add({severity:'success',detail:'User Update Successfully!'});
        this.closeForm.emit();
      },
      error:(err)=>{
        console.error(err);
        this.msgService.add({severity:'erroe',detail:'Error Updating user!'});

      }
    })
    }else{
      console.log("Adding New User:", this.user);
      this.userService.addUser(this.user).subscribe({
        next:(response)=>{
          console.log("Add Response:", response);
        this.msgService.add({severity:'success',detail:'User Added Successfully!'});
        this.closeForm.emit();
        form.resetForm();
      },error:(err)=>{
        console.error(err);
        this.msgService.add({ severity: 'error', detail: 'Error adding user!' }); 
      }
    })
    }

  }
  private getEmptyUser():User{
    return {
      username: '',
      firstName: '',
      lastName: '',
      gender: '',
      dob:' ',
      email: '',
      mobile: '',
      address1: '',
       address2: '', 
       country: '', 
       state: '', 
       zipCode: '' ,
      timezone: '',
      locale: '',
      isAdmin: false,
      password: '',
      image: ''
    }
  }
  
  cancelDailog(){
    this.closeForm.emit();
  }
}

