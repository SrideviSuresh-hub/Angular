import { Component, inject } from '@angular/core';
import { User } from '../../Models/Users';
import { UserService } from '../../Services/user.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  showDialogs: boolean = false;
  user:any={};
  // user: User = this.getEmptyUser();
  users: User[] = [];
  states: string[] = [];

  userService: UserService = inject(UserService);
  locales: string[] =
   ['en-US', 'en-GB', 'fr-FR',
     'de-DE', 'es-ES', 'zh-CN'];
  
  genders: any[] = [
    { label: "Male", gender: 'male' },
     { label: "Female", gender: 'female' },
      { label: "Others", gender: 'others' }
    ]

  timezones: string[] = [
    'UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00',
    'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+05:00',
    'UTC+06:00'];

  countries= [
    { label: 'India', value: 'India' },
    { label: 'USA', value: 'USA' }
  ];

  onCountryChange(event: any) {
    const selectedCountry = event.value||event.target?.value;
    console.log(selectedCountry);

    if (selectedCountry === "India") {
      this.states = ['Karnataka', ' Andhra Pradesh', 'Tamil Nadu', 'Delhi', 'Chennai'];
    } else if (selectedCountry === "USA") {
      this.states = ['California', 'Texas', 'New York', 'Florida'];
    } else {
      this.states = [];
    }
  }
  ngOnInit() {
this.fetchUsers()

  }
  fetchUsers():void{
    this.userService.getUsers().subscribe((data:any[])=>{
      this.users=data;
    })
  }
  //  getEmptyUser(): User {
  //   return {
  //     username: '',
  //     fname: '',
  //     lname: '',
  //     gender: '',
  //     dob: '',
  //     email: '',
  //     mobile:0,
  //     address1: '',
  //     address2: '',
  //     country: '',
  //     state: '',
  //     zipcode: '',
  //     timezone: '',
  //     locale: '',
  //     image: '',
  //     isAdmin: false,
  //     permissions: '',
  //     datetime: new Date(),
  //     status: 'Active',
  //     password: '12345',
  //     reminders:[]
  //   };
  // }


 
  showDialog(): void {
    this.user={};
    this.states=[];
    this.showDialogs = true;
  }
  editUser(selectedUser:any){
    this.user={...selectedUser};
    this.onCountryChange({value:selectedUser.country});
    this.showDialogs=true;
  }
  confirmDelete(user:any){
    const confirmed=window.confirm('Are you sure u want to dlt the user')
    if(confirmed){
      this.deleteUser(user.username);
    }
  }
  deleteUser(username:string){
    this.userService.deleteUser(username).subscribe(()=>{
      this.users=this.users.filter(user=>user.username!== username);
    })
  }
  saveUser(userForm: NgForm): void {
    this.user.datetime = new Date();

    if(this.user.username && this.users.some(u=>u.username===this.user.username)){
      this.userService.updateUser(this.user.username,this.user).subscribe((updatedUser:any)=>{
        const index=this.users.findIndex(u=>u.username===updatedUser.username);
        if(index!==-1){
          this.users[index]=updatedUser;
        }
        this.closeDialog(userForm);
      })
    }else{
    this.userService.addUser(this.user).subscribe((newUser) => {
      this.users.push(newUser);
      this.closeDialog(userForm);
      
    })
  }
  }
  closeDialog(form:NgForm){
    this.showDialogs=false;
    form.resetForm();
  }
 
 onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.user.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
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

}
