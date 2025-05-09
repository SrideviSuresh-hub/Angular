import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  authService: AuthService = inject(AuthService);
  router: Router = inject(Router)
  curUser = JSON.parse(localStorage.getItem('user'))
  userInitials: string = "";
  imgURL = this.curUser.imageUrl || this.userInitials;

  @Input() selectedLabel: string = '';

  // Initializes user initials
  ngOnInit() {
    this.userInitials = this.generateIntials();
  }

  // Creates user initials
  generateIntials() {
    return this.userInitials = `${this.curUser.firstName.charAt(0).toUpperCase()}${this.curUser.lastName.charAt(0).toUpperCase()}`
  }

  // Logs out the user
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login'])
  }
}

