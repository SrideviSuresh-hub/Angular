import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { Reminder } from '../../Models/reminder';
import { ReminderService } from '../../Services/reminder.service';
import { User } from '../../Models/Users';
import { MessageService } from 'primeng/api';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
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
  intervalId: any;
  isPopupManuallyClosed: boolean = false;
  authService: AuthService = inject(AuthService);
  reminderService: ReminderService = inject(ReminderService);
  msgService: MessageService = inject(MessageService);
  user: User | null = this.authService.getcurUser();

  // Loads reminders
  ngOnInit() {
    this.loadReminders();
    localStorage.setItem('curPath', 'portal/userhome')
    this.reminderService.popupVisible.subscribe(isVisible => {
      this.visible = isVisible;
    });
    this.loadPopupReminders()
    this.intervalId = setInterval(() => {
      this.loadPopupReminders();
    }, 10000);
    this.reminderService.popupReminderCount.subscribe();
  }

  // navigate to reminders
  navigate() {
    this.router.navigate(['portal/reminder'])
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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

  // Updates reminder status
  updateStatusAndDissmiss(reminder: Reminder) {
    const now = new Date();
    const reminderDate = new Date(reminder.reminderdt);
    if (reminder.dismissed) {
      if (reminderDate > now) {
        return { ...reminder, dismissed: false, status: 'Active' }
      }
      return { ...reminder, status: 'Inactive' }
    }

    if (reminderDate > now) {
      return { ...reminder, status: 'Active' };
    }
    if (reminderDate <= now) {
      return { ...reminder, status: 'Unread' }
    }
    return reminder;
  }

  // Refreshes reminder popup
  loadPopupReminders() {
    if (this.isPopupManuallyClosed) return;
    const now = new Date();
    if (!this.user?.id) return;
    this.reminderService.getReminderbyuserId(this.user.id).subscribe((reminders: Reminder[]) => {
      reminders.forEach(reminder => {
        const updatedReminder = this.updateStatusAndDissmiss(reminder);
        this.reminderService.updateReminder(updatedReminder).subscribe()
      })
      this.popupReminders = reminders.filter(r =>
        !r.dismissed && new Date(r.reminderdt) <= now
      );
      this.visible = this.popupReminders.length > 0;
      this.reminderService.updatePopupCount(this.popupReminders.length);
    });
  }

  // Marks a specific reminder as dismissed
  dismissReminder(reminder: Reminder) {
    const updatedReminder = { ...reminder, dismissed: true };
    this.popupReminders = this.popupReminders.filter(r => r.id !== reminder.id);
    this.visible = this.popupReminders.length > 0
    this.reminderService.updateReminder(updatedReminder).subscribe({
      next: () => {
        this.loadReminders();
        this.loadPopupReminders();
        this.reminderChart();
      },
      error: () => {
        this.msgService.add({ severity: 'error', summary: "Error", detail: 'Failed to dissmiss Reminder.' })
      }
    })
  }

  // Marks all popup reminders as dismissed
  dismissAllReminders() {
    if (this.popupReminders.length === 0) return;
    this.visible = false;
    const remindersToDismiss = [...this.popupReminders]
    remindersToDismiss.forEach(reminder => {
      const updatedReminder = { ...reminder, dismissed: true };
      this.reminderService.updateReminder(updatedReminder).subscribe({
        next: () => {
          this.popupReminders = [];
          this.loadReminders();
          this.loadPopupReminders();
          this.reminderChart()
        },
        error: () => {
          this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Failed to dismiss Reminders.' })
        }
      })
    })
  }
}
