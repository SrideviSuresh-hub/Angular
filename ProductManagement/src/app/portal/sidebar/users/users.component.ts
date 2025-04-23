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
  genders: any[] = [{ label: "Male", gender: 'male' }, { label: "Female", gender: 'female' }, { label: "Others", gender: 'others' }]
  gender!: string;
  visible: boolean = false;
  selectedUserKeyId: string;
  timezones: string[] =
    ["IST - UTC+5:30", "PST - UTC-8", "EST - UTC-5",
      "CST - UTC-6", "MST - UTC-7", "AKST - UTC-9"];

  userService: UsersService = inject(UsersService);
  authService: AuthService = inject(AuthService);
  msgService: MessageService = inject(MessageService);
  router: Router = inject(Router);
  confirmationService: ConfirmationService = inject(ConfirmationService);
  userInitials: string = "";
  isLoading: boolean = false;

  ngOnInit(): void {
    this.loadUsers();

  }
  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        users.forEach(user => {
          user.age = this.calculateAge(user.dob);
          console.log(user.firstName, user.lastName);
          this.getUserInitials(user);
          this.userService.getTotalOrderProductCount(user.id).subscribe({
            next: (count) => {
              user.productCount = count;
            },
            error: () => user.productCount = 0
          });
        });
          this.users = users; 
        
        this.isLoading=false;
      },
      error: (err) => {
        console.error("Error fetching users:", err);
        this.msgService.add({ severity: 'error', detail: 'Error fetching users' });
        this.isLoading = false;
      }
    });
  }
  calculateAge(dob: string | Date): number {
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
    if (user.dob) {
      this.selectedUser.dob = new Date(user.dob);
    }

    this.onCountryChange({ target: { value: user.country } });

    this.selectedUser.timezone = this.timezones.includes(user.timezone) ? user.timezone : "";
    this.selectedUser.locale = this.locales.includes(user.locale) ? user.locale : "";

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
    this.states = selectedCountry === "India" ? ['Karnataka', 'Tamil Nadu', 'Delhi', "Madhya Pradesh", "Maharashtra", 'Kerala', "Haryana", "Himachal Pradesh"]
      : selectedCountry === "USA" ? ["California", "New York", "Texas", "Florida", "Illinois", "Pennsylvania", "Ohio", "Georgia", "Washington", "Massachusetts"]
        : [];
  }

  onSave(form: NgForm): void {
    console.log('Form Valid:', form.valid);
    console.log('Selected User:', this.selectedUser);

    if (form.invalid) {
      if (!this.selectedUser?.username) {
        this.msgService.add({ severity: 'error', summary: 'Validation Error', detail: 'Username is required!' });
      }
      if (!this.selectedUser?.firstName) {
        this.msgService.add({ severity: 'error', summary: 'Validation Error', detail: 'First Name is required!' });
      }
      if (!this.selectedUser?.email) {
        this.msgService.add({ severity: 'error', summary: 'Validation Error', detail: 'Email is required!' });
      }

      else {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(this.selectedUser?.email)) {
          this.msgService.add({ severity: 'error', summary: 'Validation Error', detail: 'Email is not valid!' });
        }
      }
      if (!this.selectedUser?.mobile || this.selectedUser.mobile.length !== 10) {
        this.msgService.add({ severity: 'error', summary: 'Validation Error', detail: 'Mobile number is required and must be exactly 10digit number!' });
      }
      if (!this.selectedUser?.address1) {
        this.msgService.add({ severity: 'error', summary: 'Validation Error', detail: 'Address line1  is required!' });
      }
      if (!this.selectedUser?.password) {
        this.msgService.add({ severity: 'error', summary: 'Validation Error', detail: 'Password is required!' });
      }
      return;

    }

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
      console.log('editing');

      this.userService.updateUser(this.selectedUser!).subscribe({
        next: (resp) => {
          console.log('User updated successfully.');
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

  deleteUser(keyId: string) {
    this.selectedUserKeyId = keyId;
    this.visible = true;
  }

  confirmDelete() {
    console.log(this.selectedUserKeyId);

    this.userService.deleteUser(this.selectedUserKeyId).subscribe({
      next: () => {
        this.loadUsers()
        this.msgService.add({ severity: 'warn', detail: 'User Deleted' });
        this.visible = false;
      },
      error: (err) => {
        this.msgService.add({ severity: 'error', detail: 'Error Deleting User', summary: err });
      }
    })
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
      image: '',
      isFirstLogin: true
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
