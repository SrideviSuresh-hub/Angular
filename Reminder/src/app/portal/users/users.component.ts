import { Component, inject } from '@angular/core';
import { User } from '../../Models/Users';
import { UserService } from '../../Services/user.service';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  messageService:MessageService=inject(MessageService)
  userService: UserService = inject(UserService);
  users: User[] = [];
  user:any={};
  states: string[] = [];
  showDialogs: boolean = false;
  editMode:boolean=false;
  viewMode:boolean=false;
  // isAddUserMode:boolean=false;
  uploadedFileName: string | null = null;

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
  ngOnInit() {
    this.fetchUsers()
    
      }
      fetchUsers():void{
        this.userService.getUsers().subscribe((data:any[])=>{
          this.users=data;
        })
      }
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
 
   getDefaultUser(): User {
    return {
      username: '',
      fname: '',
      lname: '',
      gender: '',
      dob: '',
      email: '',
      mobile:0,
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
      status: 'Active',
      password: '12345',
      reminders:[],
      id:new Date()
    };
  }

  onRowCLick(user:User){
    this.user={...user};
    this.onCountryChange({value:user.country});
    this.viewMode=true;
    this.editMode=false;
    this.showDialogs=true;
    // this.isAddUserMode=false;
  }

  showAddUser():void{
    this.user=this.getDefaultUser();
      this.states=[];
      // this.isAddUserMode=true;
      this.editMode=true;
      this.viewMode=false;
      this.showDialogs=true;
  }
  enableEdit():void{
    this.editMode=true;
    this.viewMode=false;
  }
  confirmDelete(user: any) {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (confirmed && user?.id) {
      this.userService.deleteUser(user.id.toString()).subscribe(() => {
        this.users = this.users.filter(u => u.id !== user.id);
      });
    }
  }
  // confirmDelete(user:any){
  //   const confirmed=window.confirm('Are you sure u want to dlt the user')
  //   if(confirmed && user){
  //     this.deleteUser(user.id);
  //   }
  // }
  // deleteUser(id:string){
  //   this.userService.deleteUser(id).subscribe(()=>{
  //   this.users=this.users.filter(user=>user.id!== id);
  //   })
  // }
  saveUser(userForm: NgForm): void {
    this.user.datetime = new Date();
    
    if(this.user.username && this.editMode && !this.viewMode){
      this.userService.updateUser(this.user.id,this.user).subscribe((updatedUser:any)=>{
        const index=this.users.findIndex(u=>u.username===updatedUser.username);
        if(index!==-1){
          this.users[index]=updatedUser;
        }
        this.closeDialog(userForm);
      })
    }else{
    this.userService.addUser(this.user).subscribe((newUser:User) => {
      this.users.push(newUser);
      this.closeDialog(userForm);  
    })
  }
  }
  closeDialog(form:NgForm){
    this.showDialogs=false;
    form.resetForm();
    this.user={};
    this.editMode=false;
  }
  onImageUpload(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Ensure the file is less than 2MB
        this.messageService.add({
          severity: 'error',
          summary: 'File Too Large',
          detail: 'Image must be less than 2MB'
        });
        return;
      }

      this.uploadedFileName = file.name;  // Update the file name display

      const reader = new FileReader();
      reader.onload = () => {
        this.user.image = reader.result as string; // Store base64 or file URL
      };
      reader.readAsDataURL(file);
    }
  }
  removeImage() {
    this.uploadedFileName = null;
    this.user.image = null;
  }
  getSeverity(status: string): string {
    switch (status) {
      case 'Active': return 'success';
      case 'Disabled': return 'secondary';
      default: return 'secondary';
    }
  }
  isFieldDisabled(): boolean {
    return this.viewMode && !this.editMode;
  }
  
}
