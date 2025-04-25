import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReminderService } from '../../Services/reminder.service';
import { UserService } from '../../Services/user.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
Chart.register(ChartDataLabels);

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  router: Router = inject(Router);
  reminderService: ReminderService = inject(ReminderService);
  userService: UserService = inject(UserService);
  doughnutChartData: any;
  lineChartData: any;
  chartOption: any;
  options: any;

  // nitializes data
  ngOnInit(): void {
    this.loadReminders();
    this.userLineChart();
    localStorage.setItem('curPath', 'portal/home')
  }

  // Fetches reminders
  loadReminders() {
    this.reminderService.getReminders().subscribe(reminders => {
      this.reminderDoughnutChart();
    });
  }

  // Redirects user to the portal users page
  navigate() {
    this.router.navigate(['/portal/users']);
  }

  // Generates a doughnut chart
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
            borderWidth: 0,
            borderColor: 'transparent',
            hoverBorderColor: 'transparent',
          }
        ]
      };
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
          }
        }
      }
    })
  }

  //  user created chart
  userLineChart() {
    const last7Days: string[] = [];
    const userCountByDate: { [key: string]: number } = {};
    const weekdays = [ 'Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const daysOfWeek = weekdays[date.getDay()]
      last7Days.push(daysOfWeek);
      userCountByDate[daysOfWeek] = 0;
    }
    this.userService.getUsers().subscribe(users => {
      users.forEach(user => {
        const createdDate = new Date(user.datetime);
        const daysOfWeek = weekdays[createdDate.getDay()];
        if (userCountByDate.hasOwnProperty(daysOfWeek)) {
          userCountByDate[daysOfWeek]++;
        }
      });
      this.lineChartData = {
        labels: [...last7Days],
        datasets: [
          {
            data: last7Days.map(date => userCountByDate[date]),
            borderColor: '#0000B0',
            backgroundColor: '#43A5F5',
            borderWidth: 3,
            fill: false
          },

        ]
      }
      this.options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 10,
            ticks: {
              stepSize: 2
            },
            grid: {
              display: false
            },
            border: {
              color: '#666666'
            }
          },
          x: {
            grid: {
              display: false
            },
            border: {
              color: '#666666'
            },
            font: {
              family: 'Poppins',
              weight: '400',
              size: 13
            },
            ticks: {
              color: '#7A7A7A',
              maxRotation: 90,
              minRotation: 45
            }

          }
        },
        elements: {
          point: {
            radius: 0
          },
          line: {
            tension: 0.4
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true
          },
          datalabels: {
            display: false
          }
        }
      };

    })
  }
}




