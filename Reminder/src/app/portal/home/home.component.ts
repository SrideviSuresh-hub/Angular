import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReminderService } from '../../Services/reminder.service';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  router: Router = inject(Router);
  reminderService: ReminderService = inject(ReminderService);
  userService:UserService=inject(UserService);
  doughnutChartData: any;
  lineChartData:any;
  chartOption:any;
  options:any;
  ngOnInit(): void {
    this.reminderDoughnutChart();
    this.userLineChart();
  }

  navigate() {
    this.router.navigate(['/portal/users']);
  }

  reminderDoughnutChart() {
    this.reminderService.getReminders().subscribe(reminders => {
      const futureReminders = reminders.filter(r => r.status.toLowerCase() === 'active').length;
      const unreadReminders = reminders.filter(r => r.status.toLowerCase() === 'unread').length;
      const inactiveReminders = reminders.filter(r => r.status.toLowerCase() === 'inactive').length;
      this.doughnutChartData = {
        labels: ['Future', 'Unread', 'Inactive'],
        datasets: [
          {
            data: [futureReminders, unreadReminders, inactiveReminders],
            backgroundColor: ['#B8AFFC', '#0000B0', '#5240DA'],
            hoverBackgroundColor: ['#B8AFFC', '#0000B0', '#5240DA'],
            // boxshadow: ['0px 4px 4px rgba(0, 0, 0, 0.25)', '0px 4px 4px rgba(0, 0, 0, 0.25)', '0px 4px 4px rgba(0, 0, 0, 0.25)']
            borderWidth: 0,
            borderColor: 'transparent',
            hoverBorderColor: 'transparent',
          },
        ],
      },
      this.chartOption = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
        },cales: {
          y: {
            beginAtZero:true,
            ticks: {
              stepSize: 10,
              callback: function(value: number) {
        return value === 0 ? '' : value; 
      }
            },
            grid: { display: false }
          },
          x: {
            offset: true,

            ticks: {
              autoSkip: false,
              maxRotation: 45,
              minRotation: 45
            },
            grid: { display: false }
          }
        },
      }
    })
  }

  userLineChart() {
    const last7Days: string[] = [];
    const userCountByDate: { [key: string]: number } = {};
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const daysOfWeek=weekdays[date.getDay()]
      last7Days.push(daysOfWeek);
      userCountByDate[daysOfWeek]=0;
    }
    this.userService.getUsers().subscribe(users=>{
      users.forEach(user=>{
        const createdDate=new Date(user.datetime);
        const daysOfWeek=weekdays[createdDate.getDay()];
        if(userCountByDate.hasOwnProperty(daysOfWeek)){
          userCountByDate[daysOfWeek]++;
        }
      });
      
      this.lineChartData={
        labels:last7Days,
        datasets:[
          {
          label:'User Created',
          data:last7Days.map(date=>userCountByDate[date]),
          borderColor:'#43A5F5',
          fill:false
        },

      ]
      }
      this.options={
        responsive:true,
        maintainAspectRatio:false,
      
        
      }
    })
  }
}
