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
  authService: AuthService = inject(AuthService);
  reminderService: ReminderService = inject(ReminderService);
  curUser: User | null = this.authService.getcurUser();
  isDarkMode: boolean = false;
  popupCount: number = 0;

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();
    console.log(this.reminderService.popupReminderCount$);
    //  setTimeout(()=>{
    //   this.popupCount=this.reminderService.popupReminderCount;
    // },1000)
    this.reminderService.popupReminderCount$.subscribe(count => {
      this.popupCount = count;
    });
  }
  onNotify() {
    this.reminderService.setPopupVisible(true);
  }

  isReminderPage(): boolean {
    console.log(this.router.url);
    
    return this.router.url.includes('reminder'); // ✅ Hides the bell icon only on the reminder page
  }
  navigateToHome() {
    if (this.curUser?.isAdmin) {

      this.router.navigate(['portal/home'])
    }
    else {
      this.router.navigate(['portal/userhome'])

    }
  }
  changeTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  applyTheme() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }


  onLogout() {
    this.authService.logout()
  }

}
