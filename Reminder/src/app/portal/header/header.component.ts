import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { User } from '../../Models/Users';
import { SampleService } from '../../Services/sample.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isDarkMode: boolean = false;
  popupCount: number = 0;
  authService: AuthService = inject(AuthService);
  sampleService: SampleService = inject(SampleService);
  user: User = this.authService.getcurUser();
  router: Router = inject(Router);

  // Loads theme settings,reminder popup  count
  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();
    this.loadPopupCount()

  }

  // popup count
  loadPopupCount() {
    if (!this.user?.id) return;
    this.sampleService.loadPopupReminders(this.user.id)?.subscribe(reminders => {
      this.popupCount = reminders.length;

    });
  }

  // Triggers visibility of reminder popups
  onNotify() {
    if (this.user?.id) {
      localStorage.setItem(`popupClosed`, 'false'); 
      this.sampleService.setPopupVisible(true, this.user.id);
      this.sampleService.getPopupVisible(this.user.id)?.next(true);
    }
  }


  // Logs out user
  onLogout() {
    this.authService.logout()
  }

  //redirects user to the correct home page
  navigateToHome() {
    if (this.user?.isAdmin) {
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

}
