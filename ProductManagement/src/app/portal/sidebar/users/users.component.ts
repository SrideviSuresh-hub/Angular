import { Component, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { UsersService } from '../../../Services/users.service';
import { User } from '../../../Models/User';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  userService: UsersService = inject(UsersService);
  confirmationService: ConfirmationService= inject(ConfirmationService);
  messageService: MessageService = inject(MessageService);
  
  users: User[] = [];
  selectedUser: User | null = null;
  displayDialog: boolean = false;
  isEditing: boolean = false;
  // curUser=JSON.parse(localStorage.getItem('user'));
  
  defaultUser = {
    id:'',
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
    imageURL: '',
    isAdmin: false
  };
  newUser={...this.defaultUser}
  ngOnInit() {
    this.loadUsers(); 
  }
  loadUsers() {
    this.userService.getUsers().subscribe({
     next:(user) => {
        this.users = Object.keys(user).map(key => ({ ...user[key], id: key }));
        this.users.forEach(user=>user.age=this.calculateAge(user.dob))
      },
      error:(error) => {
        console.error('Error loading users:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users' });
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
  
  openUserDialog(user: any = null) {
    this.isEditing = !!user;
    this.displayDialog = true;
    this.selectedUser = user ?{...user}:null;
    this.newUser = user
      ? { ...user }
      : {...this.defaultUser}
  }

  confirmDeleteUser(userId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      accept: () => {
        this.deleteUser(userId);
      },
    });
  }
  
 
  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.loadUsers();
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'User deleted successfully!' });
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user' });
      },
    });
  }
  closeUserDialog() {
    this.displayDialog = false;
    this.newUser = { ...this.defaultUser }; // Reset only on close
  }
  
  saveUser() {
    if (this.isEditing && this.selectedUser) {
      console.log(this.selectedUser , this.isEditing)
      this.userService.updateUser(this.selectedUser.id, this.newUser).subscribe({
        next: () => {
          console.log(this.selectedUser , this.isEditing)
          this.loadUsers();
          this.closeUserDialog();
          this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'User updated successfully!' });
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user' });
        },
      });
    } else {
      this.userService.addUser(this.newUser).subscribe({
        next: () => {
          this.loadUsers();
          this.closeUserDialog();
          this.messageService.add({ severity: 'success', summary: 'Added', detail: 'User added successfully!' });
        },
        error: (error) => {
          console.error('Error adding user:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add user' });
        },
      });
    }
  }
}
 
  

