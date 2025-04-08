import { Component } from '@angular/core';
import { Reminder } from '../Models/reminder';

@Component({
  selector: 'app-reminder',
  standalone: false,
  templateUrl: './reminder.component.html',
  styleUrl: './reminder.component.css'
})
export class ReminderComponent {
  visible:boolean=true;
 reminders: Reminder[] = [
    {
        title: "Doctor's Appointment",
        reminderdt: "2025-04-10T10:00:00",
        status: "Disabled",
        createdatetime: new Date()
    },
    {
        title: "Team Meeting",
        reminderdt: "2025-04-07T14:00:00",
        status: "Active",
        createdatetime: new Date()
    },
    {
        title: "Project Deadline",
        reminderdt: "2025-04-15T17:00:00",
        status: "Active",
        createdatetime: new Date()
    },
    {
        title: "Anniversary Celebration",
        reminderdt: "2025-04-20T19:00:00",
        status: "Disabled",
        createdatetime: new Date()
    },
    {
        title: "Grocery Shopping",
        reminderdt: "2025-04-08T18:00:00",
        status: "Disabled",
        createdatetime: new Date()
    }
];

getSeverity(status:String){
  switch(status){
    case "Active":
      return 'success';
      case 'Disabled':
        return 'secondary';
      default:
        return 'secondary';
  }
}
showDailog(){
  this.visible=true;
}
}
