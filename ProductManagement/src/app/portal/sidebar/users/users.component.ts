import { Component, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { UsersService } from '../../../Services/users.service';
import { User } from '../../../Models/User';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  displayDialog: boolean = false;
  isEditing: boolean = false;
  imageUrl: string | ArrayBuffer | null = "assets/images/defaultAvatar.png";
  file: File | null = null;
  states: string[] = [];
  locales: string[] = ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'es-ES', 'zh-CN'];
  genders: any[] = [{ label: "Male", gender: 'male' }, { label: "Female", gender: 'female' }, { label: "Prefer not to say", gender: 'others' }]
  gender!: string;
  timezones: string[] = [
    'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00',
    'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00',
    'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+05:00',
    'UTC+06:00', 'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00',
    'UTC+12:00'
  ];

  userService: UsersService = inject(UsersService);
  authService: AuthService = inject(AuthService);
  msgService: MessageService = inject(MessageService);
  router: Router = inject(Router);
  confirmationService: ConfirmationService = inject(ConfirmationService); 
  userInitials: string = "";

  


 ngOnInit(): void{
    this.loadUsers();
  }
  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
      
        users.forEach(user=>{
          user.age=this.calculateAge(user.dob);
          console.log(user.firstName,user.lastName);
          
          this.getUserInitials(user);
        });
        this.users=users;
      },
      error: (err) => {
        console.error("Error fetching users:", err);
        this.msgService.add({ severity: 'error', detail: 'Error fetching users' });
      }
    });
  }
  calculateAge(dob: string): number {
    if (!dob) return 0;  
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  addUserForm(): void {
    this.selectedUser = this.getEmptyUser();
    this.isEditing = false;
    this.imageUrl = "assets/images/defaultAvatar.png";
    this.displayDialog = true;
  }

  editUser(user: User): void {
    this.selectedUser = { ...user };
    this.isEditing = true;
    this.imageUrl = user.image || 'assets/images/defaultAvatar.png';
    this.displayDialog = true;
  }

  triggerFileInput(): void {
    document.getElementById('fileInput')?.click();
  }

  onFileSelected(event: any): void {
    this.file = event.target.files[0];
    if (this.file && this.file.size < 2 * 1024 * 1024 && (this.file.type === 'image/png' || this.file.type === 'image/jpeg')) {
      const reader = new FileReader();
      reader.onload = (e) => this.imageUrl = e.target?.result;
      reader.readAsDataURL(this.file);
    } else {
      this.msgService.add({ severity: 'warn', summary: 'Invalid File', detail: 'File must be PNG or JPG and less than 2MB.' });
    }
  }

  onCountryChange(event: any): void {
    const selectedCountry = event.target.value;
    this.states = selectedCountry === "India" ? ['Karnataka', 'Tamil Nadu', 'Delhi', 'Chennai']
      : selectedCountry === "USA" ? ['California', 'Texas', 'New York']
      : [];
  }

  onSave(form: NgForm): void {
    if (form.invalid) return;

    if (this.file) {
      setTimeout(() => {
        this.selectedUser!.image = this.imageUrl as string;
        this.saveUser(form);
      }, 1000);
    } else {
      this.saveUser(form);
    }
  }
  

  saveUser(form: NgForm): void {
    if (this.isEditing) {
      this.userService.updateUser(this.selectedUser!).subscribe({
        next: (resp) => {
          this.msgService.add({ severity: 'success', detail: 'User Updated Successfully!' });
          this.displayDialog = false;
          this.loadUsers();
        },
        error: (err) => {
          this.msgService.add({ severity: 'error', detail: 'Error Updating User!' });
          console.error('Error updating user:', err);
        }
      });
    } else {
      this.userService.getUsers().subscribe({
        next: (users) => {
          const existingUser = users.find(user => user.username === this.selectedUser?.username);
          if (existingUser) {
            this.msgService.add({ severity: 'warn', summary: 'Signup Failed', detail: 'Username already exists! Please choose a different one.' });
            this.displayDialog = false;
            return;
          }
          this.userService.addUser(this.selectedUser!).subscribe({
            next: () => {
              this.msgService.add({ severity: 'success', summary: 'Success', detail: 'User Added Successfully!' });
              this.displayDialog = false;
              this.loadUsers();
              form.resetForm();
            },
            error: () => {
              this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Error Adding User!' });
            }
          });
        },
        error: () => {
          this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Error Fetching Users!' });
        }
      });
    }
  }
  

  confirmDelete(id: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      accept: () => {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.users = this.users.filter(user => user.id !== id);
            this.msgService.add({ severity: 'warn', detail: 'User Deleted' });
          },
          error: (err) => {
            this.msgService.add({ severity: 'error', detail: 'Error Deleting User' });
            console.error('Error deleting user:', err);
          }
        });
      }
    });
  }

  getEmptyUser(): User {
    return {
      username: '',
      firstName: '',
      lastName: '',
      gender: '',
      dob: '',
      email: '',
      mobile: '',
      address1: '',
      address2: '',
      country: '',
      state: '',
      zipCode: '',
      timezone: '',
      locale: '',
      isAdmin: false,
      password: '',
      image: ''
    };
  }

  closeUserDialog(): void {
    this.displayDialog = false;
  }

  getUserInitials(user: User): string {
    if (!user.firstName || !user.lastName) {
      return '';
    }
    const firstInitial = user.firstName.charAt(0).toUpperCase();
    const lastInitial = user.lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }
}
