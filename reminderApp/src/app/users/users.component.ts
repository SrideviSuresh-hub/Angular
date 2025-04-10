import { Component, inject } from '@angular/core';
import { UserService } from '../Services/user.service';
import { User } from '../Models/users';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  visible: boolean = false;
  userService: UserService = inject(UserService);
  user:User=this.getEmptyUser();
  users: User[] = [];
  states: string[] = [];
  locales: string[] = ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'es-ES', 'zh-CN'];
  genders: any[] = [{ label: "Male", gender: 'male' }, { label: "Female", gender: 'female' }, { label: "Others", gender: 'others' }]
  timezones: string[] = [
    'UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00',
    'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+05:00',
    'UTC+06:00'];
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
  ngOnInit(){
   
  }
  getUsers():void{
    this.userService.getUsers().subscribe(data=>{
      this.users=data
    })
  }
  showDialog(): void {
    this.visible = true;
    this.user = this.getEmptyUser();
  }
  saveUser(userForm:NgForm):void{
    this.user.datetime=new Date();
    this.userService.addUser(this.user).subscribe((savedUser)=>{
      this.users.push(savedUser);
      this.visible=false;
    })
  }
  onImageUpload(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.user.image = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  getEmptyUser(): User {
    return {
      username: '',
      fname: '',
      lname: '',
      gender: '',
      dob: '',
      email: '',
      mobile: 0,
      address1: '',
      address2: '',
      country: '',
      state: '',
      zipcode: '',
      timezone: '',
      locale: '',
      image: '',
      isAdmin: false,
      permissions: '',
      datetime: new Date(),
      status: 'Active'
    };
  }



  getSeverity(status: String) {
    switch (status) {
      case "Active":
        return 'success';
      case 'Disabled':
        return 'secondary';
      default:
        return 'secondary';
    }
  }
  showDailog() {
    this.visible = true;
  }

}

