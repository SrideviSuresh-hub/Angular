import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { User } from '../../Models/Users';
import { ReminderService } from '../../Services/reminder.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  router: Router = inject(Router);
  isDarkMode: boolean = false;
  popupCount: number = 0;
  authService: AuthService = inject(AuthService);
  reminderService: ReminderService = inject(ReminderService);
  curUser: User | null = this.authService.getcurUser();

  // Loads theme settings,reminder popup  count
  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();
    this.reminderService.popupReminderCount.subscribe(count => {
      this.popupCount = count;
    });
  }

  // Triggers visibility of reminder popups
  onNotify() {
    this.reminderService.setPopupVisible(true);
  }

  // Logs out user
  onLogout() {
    this.authService.logout()
  }

  //redirects user to the correct home page
  navigateToHome() {
    if (this.curUser?.isAdmin) {
      this.router.navigate(['portal/home'])
    }
    else {
      this.router.navigate(['portal/userhome'])
    }
  }

  // toggles between dark and light themes
  changeTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  // Applies the selected theme
  applyTheme() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
  // Checks if the current page is the reminder view.
  isReminderPage(): boolean {
    return this.router.url.includes('reminder');
  }

}
