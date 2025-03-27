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
  userInitials:string="";

  generateIntials(fname:string,lname:string){
    this.userInitials=`${fname.charAt(0).toUpperCase()}${lname.charAt(0).toUpperCase()}`
  }

  ngOnInit() {
    this.loadUsers(); 
   
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
     next:(users) => {
      
        // this.users = Object.keys(user).map(key => ({ ...user[key], id: key }));
        users.forEach(user=>{
          user.age=this.calculateAge(user.dob);
          console.log(user.firstName,user.lastName);
          
          this.generateIntials(user.firstName,user.lastName);
        });
        this.users=users;
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
  
 addUserForm(){
  this.selectedUser=null;
  this.isEditing=false;
  this.displayDialog=true;
 }
 editUser(user:User){
  this.selectedUser={...user};
  this.isEditing=true;
  this.displayDialog=true;
 }

  closeUserDialog() {
    this.displayDialog = false;
    this.loadUsers();
  }
  confirmDelete(userId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteUser(userId);
      }
    });
  }
  deleteUser(userId:string){
    this.userService.deleteUser(userId).subscribe({
      next:()=>{
      this.messageService.add({severity:'success',summary:'Deleted',detail:' deleted Successfully'});
      this.loadUsers();
    },
  error:(error)=>{
    this.messageService.add({severity:'error',summary:'error',detail:'Failed to delete User:'+error.message})
  }
})
  }
}
  
