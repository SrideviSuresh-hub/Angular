import { Component, inject } from '@angular/core';
import { User } from '../../Models/Users';
import { UserService } from '../../Services/user.service';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
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
  first = 0;
  rows = 10;
  totalRecords = 0;
  curPageInput: number = 1;
  confirmationService:ConfirmationService=inject(ConfirmationService);
  maxPage: number = Math.ceil(this.totalRecords / this.rows); 
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
    datetime: new Date().toISOString(),
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



  hasPermission(action: string): boolean | undefined {
    console.log('Checking permission for:', action);
    console.log('Permissions available:', this.curUser?.permissions); // Make sure it's populated correctly
    if (!this.curUser?.permissions) {
      return false;
    }
    return this.curUser.permissions.includes(action);
  }
  showPermissionError(action: string) {
    this.messageService.add({ severity: 'warn', summary: "Permission Denied", detail: `You don't have permission to ${action}` })
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
  ngOnInit() {
    this.fetchUsers();
    localStorage.setItem('curPath','portal/users')

  }
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.maxPage = Math.ceil(this.totalRecords / this.rows);
    this.curPageInput = event.page + 1
  }

  goToPage(table: any) {
    const targetPage = this.curPageInput;
    if (targetPage >= 1 && targetPage <= this.maxPage) {
      this.first = (targetPage - 1) * this.rows;
      table.first = this.first;
      table.paginate({ first: (this.curPageInput - 1) * 5, rows: 5 });

    }
    else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Page',
        detail: 'Invalid page number'
      });
    }
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe((data: any[]) => {
      this.users = data;
      this.totalRecords = this.users.length; 
    this.maxPage = Math.ceil(this.totalRecords / this.rows);
    })
  }
  
  switchToEditMode(): boolean {
    if (!this.hasPermission('edit')) {
      this.showPermissionError('edit');
      return false;
    }

    this.mode = 'edit';
    return true;
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
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this reminder?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.userService.deleteUser(user.id).subscribe(() => {
          this.users = this.users.filter(u => u.id !== user.id);
              this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Reminder deleted successfully'
          });
        });
 
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Deletion cancelled'
        });
      }
    });
  }
  

  saveUser(userForm: NgForm): void {
    console.log(userForm);
    
    const usernameControl = userForm.controls['userName'];
    if (this.mode === 'add' && (usernameControl.value.trim() === '' || !/^[a-zA-Z0-9]*$/.test(usernameControl.value))) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Username',
        detail: 'Username is required, alphanumeric, and max length of 20 characters.'
      });
      return;
    }
  
    const firstNameControl = userForm.controls['firstName'];
    if (firstNameControl.value.trim() === '' || !/^[a-zA-Z0-9 ]*$/.test(firstNameControl.value)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid First Name',
        detail: 'First Name is required, alphanumeric, and max length of 30 characters.'
      });
      return;
    }
  
    const lastNameControl = userForm.controls['lastName'];
    if (lastNameControl.value.trim() !== '' && !/^[a-zA-Z0-9 ]*$/.test(lastNameControl.value)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Last Name',
        detail: 'Last Name can only contain alphanumeric characters and spaces (max length 30).'
      });
      return;
    } 
     const emailControl = userForm.controls['email'];
    if (emailControl.value.trim() === '' || !/\S+@\S+\.\S+/.test(emailControl.value) || emailControl.value.length > 100) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Email',
        detail: 'Please provide a valid email address (max 100 characters).'
      });
      return;
    }
    const addressField1Control = userForm.controls['address1'];
    if (addressField1Control.value.trim() === '' || addressField1Control.value.length > 100) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid AddressField1',
        detail: 'AddressField1 is required and can have a maximum length of 100 characters.'
      });
      return;
    }
  
    const addressField2Control = userForm.controls['address2'];
    if (addressField2Control.value.length > 100) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid AddressField2',
        detail: 'AddressField2 can have a maximum length of 100 characters.'
      });
      return;
    }
    if (userForm.valid) {
      this.newUser.datetime = new Date();
      const duplicate = this.users.find(user =>
        user.username === this.newUser.username && (this.mode === 'add' || user.id !== this.newUser.id)
      )
      if (duplicate) {
        this.messageService.add({
          severity: 'error',
          summary: 'Duplicate Username',
          detail: 'Username already exists!'
        });
        return;
      }
      if (this.mode === 'edit') {
        this.onCountryChange({ target: { value: this.newUser.country } });
        this.userService.updateUser(this.newUser).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'User Updated',
            detail: 'User details updated successfully.'
          });          this.fetchUsers();
          this.mode = 'view';
          this.visible = false;
        })
      } else {
        this.userService.addUser(this.newUser).subscribe((newUser: User) => {
          this.users.push(newUser);
          this.messageService.add({
            severity: 'success',
            summary: 'User Added',
            detail: 'User added successfully.'
          });          this.fetchUsers();
          this.mode = 'view';
          this.visible = false;
        })
      }
      userForm.resetForm();
    }

  }
  onImageUpload(event: any) {
    const file: File = event.target.files[0];
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (file && !validTypes.includes(file.type)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid File',
        detail: 'Only PNG, JPEG, and JPG formats are allowed.'
      });
      return;
    }

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
















//   const confirmed = window.confirm('Are you sure you want to delete this user?');
  //   if (confirmed && user?.id) {
  //     this.userService.deleteUser(user.id).subscribe(() => {
  //       this.users = this.users.filter(u => u.id !== user.id);
  //     });
  //   }
  // }