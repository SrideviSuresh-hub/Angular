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
  curUser=JSON.parse(localStorage.getItem('user'));
  @ViewChild('delete')id:string=this.curUser.id;
  
  newUser = {
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
    image: '',
    isAdmin: false
  };

  
  openUserDialog(user: any = null) {
    this.displayDialog = true;
    this.isEditing = !!user;
    this.selectedUser = user;
    this.newUser = user
      ? { ...user }
      : {
          userName: "",
          firstName: "",
          lastName: "",
          gender: "",
          dob: "",
          email: "",
          mobile: "",
          address1: "",
          address2: "",
          country: "",
          state: "",
          zipCode: "",
          timezone: "",
          locale: "",
          userImage: "",
          isAdmin: false,
        };
  }

 
  
  ngOnInit() {
    this.loadUsers();
    
  }
  loadUsers() {
    this.userService.getUsers().subscribe(
      (user) => {
      this.users = Object.keys(user).map(key => ({ ...user[key], id: key }));
    })
  }
 
  deleteUser(id) {
    this.userService.deleteUser(id).subscribe(() => {
      console.log("deleted user ", id);
      this.loadUsers();
    });
  }
    age(){
    this.users.forEach((user)=>{
      const dob=user.dob;
      console.log(dob)
    })

    }
  
  saveUser() {
    if (this.isEditing) {
      this.userService.updateUser(this.selectedUser.id,this.newUser).subscribe(() => {
      this.loadUsers();
      this.displayDialog=false;
      this.messageService.add({ severity: "success", summary: "Updated", detail: "User updated successfully!" });
    });
    }
    else {
        this.userService.addUser(this.newUser).subscribe(() => {
          this.loadUsers();
          this.displayDialog=false;
          this.messageService.add({ severity: "success", summary: "Added", detail: "User added successfully!" });
      });
    }
  }
  confirmDeleteUser(userId: string) {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete this user?",
      accept: () => {
        this.userService.deleteUser(userId).subscribe(() => {
          this.loadUsers();
          this.messageService.add({ severity: "success", summary: "Deleted", detail: "User deleted successfully!" });
        });
      },
    });
  }
}

