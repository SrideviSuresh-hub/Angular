import { Component, ElementRef, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { Reminder } from '../../Models/reminder';
import { ReminderService } from '../../Services/reminder.service';
import { User } from '../../Models/Users';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import { SampleService } from '../../Services/sample.service';
Chart.register(ChartDataLabels);


@Component({
  selector: 'app-userhome',
  standalone: false,
  templateUrl: './userhome.component.html',
  styleUrl: './userhome.component.css'
})
export class UserhomeComponent implements OnInit {

  visible: boolean = false;
  popupReminders: Reminder[] = [];
  chartData: any;
  chartOption: any;
  reminders: Reminder[] = [];
  user: User | null;
  userId!: number | string;
  sampleService: SampleService = inject(SampleService);
  constructor(
    private router: Router,
    private authService: AuthService,
    private reminderService: ReminderService
  ) {
    this.user = this.authService.getcurUser();
  }

  // Loads reminders
  ngOnInit() {
    localStorage.setItem('curPath', 'portal/userhome');
    // this.loadReminders();
    this.loadPopupReminders();
    if (this.user) {
      this.userId = this.user.id!;
    }
    this.sampleService.getPopupVisible(this.userId)?.subscribe(visible => {
      const popupClosed = localStorage.getItem('popupClosed') === 'true';
      this.visible = !popupClosed && visible;
    });
    setInterval(() => {
      this.sampleService.trackNextReminder(this.userId)
    }, 5000);
  }

  // navigate to reminders
  navigate() {
    this.router.navigate(['portal/reminder'])
  }

  // Fetches reminders
  loadReminders() {
    if (!this.user?.id) return;
    this.reminderService.getReminderbyuserId(this.user.id).subscribe((rem) => {
      this.reminders = [...rem];
      this.reminderChart();
    })
  }

  //loads popup reminders
  loadPopupReminders() {
    if (!this.user?.id) return;
    this.sampleService.loadPopupReminders(this.user.id)?.subscribe((rems) => {
      this.popupReminders = rems;
      this.loadReminders()
    });

  }

  // removes a popup reminder
  dismissReminder(reminder: Reminder) {
    if (!this.user?.id) return;
    this.sampleService.dismissReminder(this.user.id, reminder);
    this.loadPopupReminders();
    // this.loadReminders();
  }

  // removes all popup reminders
  dismissAllReminders() {
    if (!this.user?.id) return;
    this.sampleService.dismissAllReminders(this.user.id);
    this.popupReminders = [];
    this.loadPopupReminders();
    // this.loadReminders();
    this.visible = false;
  }

  // Marks reminder popup as manually closed
  handlePopupClose() {
    localStorage.setItem(`popupClosed`, 'true');
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
    console.log("chart"+ this.chartData);
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
    if (this.chartData) {
      console.log("chartdata loggong"+this.chartData.datasets[0].data);
      
            this.chartData.datasets[0].data = [futureReminders,unreadReminders,inactiveReminders];
            return;
          }
  }
  
}