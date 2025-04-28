import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { Reminder } from '../../Models/reminder';
import { ReminderService } from '../../Services/reminder.service';
import { User } from '../../Models/Users';
import { MessageService } from 'primeng/api';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import { NotificationService } from '../../Services/notification.service';
Chart.register(ChartDataLabels);


@Component({
  selector: 'app-userhome',
  standalone: false,
  templateUrl: './userhome.component.html',
  styleUrl: './userhome.component.css'
})
export class UserhomeComponent implements OnInit {

  visible: boolean = true;
  popupReminders: Reminder[] = [];
  router: Router = inject(Router);
  chartData: any;
  chartOption: any;
  reminders: Reminder[] = [];
  isPopupManuallyClosed: boolean = false;
  authService: AuthService = inject(AuthService);
  reminderService: ReminderService = inject(ReminderService);
  msgService: MessageService = inject(MessageService);
  user: User | null = this.authService.getcurUser();
  notificationService:NotificationService=inject(NotificationService);

  // Loads reminders
  ngOnInit() {
    localStorage.setItem('curPath', 'portal/userhome')
    this.notificationService.popupVisible$.subscribe(visible => {
        this.visible = visible;
    });
    this.notificationService.reminders$.subscribe(reminders => {
      this.popupReminders = reminders.filter(r => !r.dismissed && new Date(r.reminderdt) <= new Date());
      this.visible = this.popupReminders.length > 0;
      this.reminderChart(); 
    });
    this.loadReminders();
    this.loadPopupReminders();
  }

  // navigate to reminders
  navigate() {
    this.router.navigate(['portal/reminder'])
  }

  //load popup reminders -unread
  loadPopupReminders() {
    if (this.isPopupManuallyClosed) return;
    const now = new Date();
    if (!this.user?.id) return; 
    this.notificationService.loadPopupReminders(this.user.id); // Ensures reminders are correctly retrieved
    this.notificationService.reminders$.subscribe(reminders => {
      this.popupReminders = reminders.filter(r => !r.dismissed && new Date(r.reminderdt) <= now);
      this.visible = this.popupReminders.length > 0;
    });   
    this.reminderChart();
  }

  //remove particular reminder
  dismissReminder(reminder: Reminder) {
    const updatedReminder = { ...reminder, dismissed: true, status: "Inactive" };
    this.popupReminders = this.popupReminders.filter(r => r.id !== reminder.id);
    this.visible = this.popupReminders.length > 0;
    this.notificationService.dismissReminder(updatedReminder); 
    this.loadReminders();
  }
  
  //remove all reminders
  dismissAllReminders() {
    this.notificationService.dismissAllReminders(this.user?.id);
    this.notificationService.reminders$.subscribe(reminders => {
      this.popupReminders = [];
      this.visible = false;
      this.loadReminders();
    });
  }
  

  // Fetches reminders
  loadReminders() {
    if (!this.user?.id) return;
    this.reminderService.getReminderbyuserId(this.user.id).subscribe((reminders: Reminder[]) => {
      this.reminders = reminders;
      this.reminderChart();
    })
  }

  // Marks reminder popup as manually closed
  handlePopupClose() {
    this.isPopupManuallyClosed = true;
    this.visible = false;
  }

  // Generates reminder status chart
  reminderChart() {
    const futureReminders = this.reminders.filter(r => r.status.toLowerCase() === 'active').length;
    const unreadReminders = this.reminders.filter(r => r.status.toLowerCase() === 'unread').length;
    const inactiveReminders = this.reminders.filter(r => r.status.toLowerCase() === 'inactive').length;
    this.chartData = {
      labels: ['Future', 'Unread', 'Inactive'],
      datasets: [
        {
          data: [futureReminders, unreadReminders, inactiveReminders],
          backgroundColor: ['#B8AFFC', '#0000B0', '#5240DA'],
          hoverBackgroundColor: ['#B8AFFC', '#0000B0', '#5240DA'],
          borderWidth: 0,
          borderColor: 'transparent',
          hoverBorderColor: 'transparent',
        },
      ],
    }
    this.chartOption = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          anchor: 'center',
          align: 'center',
          font: {
            family: 'Roboto',
            weight: '500',
            size: 16,
            style: 'italic'
          },
          color: 'white',
          formatter: (_: any, ctx: any) => {
            const labels = ['Future', 'Unread', 'Inactive'];
            return labels[ctx.dataIndex];
          }
        },
        tooltip: {
          enabled: true
        }
      }
    };
  }
}