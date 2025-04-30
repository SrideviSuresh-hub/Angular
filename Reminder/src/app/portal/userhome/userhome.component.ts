import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { Reminder } from '../../Models/reminder';
import { ReminderService } from '../../Services/reminder.service';
import { User } from '../../Models/Users';
import { MessageService } from 'primeng/api';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import { SampleService } from '../../Services/sample.service';
import { BehaviorSubject } from 'rxjs';
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
  chartData: any;
  chartOption: any;
  reminders: Reminder[] = [];
  user: User | null;
  userId!: number | string;
  constructor(
    private router: Router,
    private authService: AuthService,
    private sampleService: SampleService,
    // private msgService: MessageService,
    private reminderService: ReminderService
  ) {
    this.user = this.authService.getcurUser();
  }
  // Loads reminders
  ngOnInit() {
    localStorage.setItem('curPath', 'portal/userhome')
    this.loadReminders();
    if (this.user) {
      this.userId = this.user.id!;
      this.loadPopupReminders();
    }
      this.sampleService.getPopupVisible(this.userId)?.subscribe(visible => {
        this.visible = visible; 
      });
    
      setInterval(() => {
        this.sampleService.trackNextReminder(this.userId)
      }, 1000);
  }

  // navigate to reminders
  navigate() {
    this.router.navigate(['portal/reminder'])
  }

  // Fetches reminders
  loadReminders() {
    if (!this.user?.id) return;
    this.reminderService.getReminderbyuserId(this.user.id).subscribe((reminders: Reminder[]) => {
      this.reminders = reminders.map(reminder => this.updateStatusAndDismiss(reminder)); 
      this.reminderChart();
    })
  }

  loadPopupReminders() {
    if (!this.user?.id) return;
    this.sampleService.loadPopupReminders(this.user.id);
    this.sampleService.getPopupReminders(this.user.id)?.subscribe(reminders => {
      this.popupReminders = reminders.map(reminder => this.updateStatusAndDismiss(reminder));
      // this.visible = reminders.length > 0;
    })
    const popupVisible$ = this.sampleService.getPopupVisible(this.user.id) ?? new BehaviorSubject<boolean>(false).asObservable();
    popupVisible$.subscribe(isVisible => {
      this.visible = isVisible;
    });
    this.loadReminders()
  }



  dismissReminder(reminder: Reminder) {
    if (!this.user?.id) return;
    this.sampleService.dismissReminder(this.user.id, reminder);
    this.reminders = this.reminders.map(r => 
      r.id === reminder.id ? { ...r, status: 'Inactive' } : r
  );
  }

  dismissAllReminders() {
    if (!this.user?.id) return;
    this.sampleService.dismissAllReminders(this.user.id);
    this.popupReminders = [];
    this.reminders = this.reminders.map(r => ({
      ...r, status: 'Inactive'
  }));
    this.visible = false;
  }

  updateStatusAndDismiss(reminder: Reminder) {
    const now = new Date();
    const reminderDate = new Date(reminder.reminderdt);

    if (reminder.dismissed && reminderDate > now) {
      return { ...reminder, dismissed: false, status: 'Active' };
    }
    if (reminderDate > now) {
      return { ...reminder, status: 'Active' };
    }
    if (reminderDate <= now) {
      return { ...reminder, status: 'Unread' };
    }
    return reminder;
  }

  // Marks reminder popup as manually closed
  handlePopupClose() {
    this.visible = false;
  }

  // Generates reminder status chart
  reminderChart() {
    const futureReminders = this.reminders.filter(r => r.status.toLowerCase() === 'active').length;
    const unreadReminders = this.reminders.filter(r => r.status.toLowerCase() === 'unread').length;
    const inactiveReminders = this.reminders.filter(r => r.status.toLowerCase() === 'inactive').length;
    if (this.chartData) {
      this.chartData.datasets[0].data = [futureReminders, unreadReminders, inactiveReminders];
      return;
    }
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
            const dataValues = ctx.chart.data.datasets[0].data;
            return dataValues[ctx.dataIndex] > 0 ? labels[ctx.dataIndex] : '';
          }
        },
        tooltip: {
          enabled: true
        }
      }
    };
  }
}