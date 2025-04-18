import { Component, inject } from '@angular/core';
import { User } from '../../Models/Users';
import { UserService } from '../../Services/user.service';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  messageService: MessageService = inject(MessageService)
  userService: UserService = inject(UserService);
  authService: AuthService = inject(AuthService);
  users: User[] = [];
  states: string[] = [];
  visible: boolean = false;
  mode: 'view' | 'edit' | 'add' = 'view';
  curUser = this.authService.getcurUser();
  uploadedFileName: string = '';
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

  countries = [
    { label: 'India', value: 'India' },
    { label: 'USA', value: 'USA' }
  ];

  permissionLabels = ['Add', 'Delete', 'Edit', 'View'];

  permissions = this.permissionLabels.map(label => ({
    label,
    value: label.toLowerCase()
  }));


  newUser: User = {
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
    permissions: [],
    datetime: new Date(),
    status: 'Active',
    password: '12345'
  };

  onPermissionChange() {
    const permissionsSet = new Set(this.newUser.permissions);
    if (permissionsSet.has('edit')) {
      permissionsSet.add('view');
    }
    this.newUser.permissions = Array.from(permissionsSet);
  }

  // toggleAdmin() {
  //   // if (this.newUser.isAdmin) {
  //   //   this.newUser.permissions = ['add', 'delete', 'view', 'edit']; // Default full access
  //   // } else {
  //   //   this.newUser.permissions = []; // Reset permissions if unchecked
  //   // }
  // }

  hasPermission(action: string): boolean | undefined {
    console.log('Checking permission for:', action);
    console.log('Permissions available:', this.permissions); // Make sure it's populated correctly
    if (!this.curUser?.permissions) {
      return false; // No permissions assigned, deny action
    }
  
    // Directly check if the action exists in the permissions array
    return this.curUser.permissions.includes(action);
  }
  showPermissionError(action: string) {
    this.messageService.add({ severity: 'warn', summary: "Permission Denied", detail: `You don't have permission to ${action}` })
  }

  ngOnInit() {
    this.fetchUsers()
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe((data: any[]) => {
      this.users = data;
    })
  }
  onCountryChange(event: any) {
    const selectedCountry = event.value || event.target?.value;
    this.states = this.getStatesByCountry(selectedCountry);
  }

  getStatesByCountry(country: string): string[] {
    if (country === 'India')
      return ['Karnataka', 'Tamil Nadu', 'Maharashtra'];
    if (country === 'USA')
      return ['California', 'Texas', 'New York'];
    return [];
  }

  showDailog(user: User | null, mode: 'view' | 'add' | 'edit' = 'add') {

    this.mode = mode;
    if (!this.hasPermission(this.mode)) {
      console.log(!this.hasPermission(this.mode));    
      console.log(this.mode);
      this.showPermissionError(this.mode);
      return;
    }
    if (user) {
      this.newUser = { ...user, dob: new Date(user.dob) };
      this.states = this.getStatesByCountry(user.country);
    } else {
      this.newUser = {
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
        datetime: new Date().toISOString(),
        status: 'Active',
        password: '12345'
      }
      // this.mode = 'add';
    }

    this.visible = true
  }

  confirmDelete(user: any) {
    if (!this.hasPermission('delete')) {
      this.showPermissionError('delete');
      return;
    }
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (confirmed && user?.id) {
      this.userService.deleteUser(user.id).subscribe(() => {
        this.users = this.users.filter(u => u.id !== user.id);
      });
    }
  }

  saveUser(userForm: NgForm): void {


    if (userForm.valid) {
      this.newUser.datetime = new Date();
      const duplicate = this.users.find(user =>
        user.username === this.newUser.username && (this.mode === 'add' || user.id !== this.newUser.id)
      )
      if (duplicate) {
        alert('username already exists!!');
        return;
      }
      if (this.mode === 'edit') {
        this.userService.updateUser(this.newUser).subscribe(() => {
          alert('reminder updated')
          this.fetchUsers();
          this.mode = 'view';
          this.visible = false;
        })
      } else {
        this.userService.addUser(this.newUser).subscribe((newUser: User) => {
          this.users.push(newUser);
          alert('userinder added succesfully');
          this.fetchUsers();
          this.mode = 'view';
          this.visible = false;
        })
      }
      userForm.resetForm();
    }

  }
  onImageUpload(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'File Too Large',
          detail: 'Image must be less than 2MB'
        });
        return;
      }

      this.uploadedFileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.newUser.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  removeImage() {
    this.uploadedFileName = '';
    this.newUser.image = null;
  }
  getSeverity(status: string): string {
    switch (status) {
      case 'Active': return 'success';
      case 'Disabled': return 'secondary';
      default: return 'secondary';
    }
  }
  onCancel() {
    if (this.mode === 'add') {
      this.visible = false;
    }
    else if (this.mode === 'edit') {
      this.mode = 'view';
    }
  }

}

