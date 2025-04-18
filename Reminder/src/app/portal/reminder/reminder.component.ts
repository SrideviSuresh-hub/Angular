import { Component, inject, OnInit } from '@angular/core';
import { Reminder } from '../../Models/reminder';
import { ReminderService } from '../../Services/reminder.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reminder',
  standalone: false,
  templateUrl: './reminder.component.html',
  styleUrl: './reminder.component.css'
})
export class ReminderComponent implements OnInit {
  reminderService: ReminderService = inject(ReminderService);
  authService: AuthService = inject(AuthService);
  messageService: MessageService = inject(MessageService);
  visible: boolean = false;
  mode: 'view' | 'edit' | 'add' = 'view';
  first = 0;
  rows = 10;
  totalRecords = 0;
  curPageInput: number = 1;
  maxPage: number = 1;

  newReminder: Reminder = {
    title: '',
    detail: '',
    reminderdt: '',
    dismissed: false,
    status: 'Active',
    createdatetime: new Date().toISOString(),
    userId: 0
  }

  userId!: Date | number | string;
  reminders: Reminder[] = [];

  ngOnInit(): void {
    const user = this.authService.getcurUser();
    if (user) {
      this.userId = user.id!;
      this.newReminder.userId = user.id!;
      this.loadReminders();
      this.totalRecords = this.reminders.length;
      this.maxPage = Math.ceil(this.totalRecords / this.rows)

    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.maxPage = Math.ceil(this.totalRecords / this.rows);
    this.curPageInput = event.page + 1
  }

  goToPage(table: any) {
    const targetPage = this.curPageInput;
    if (targetPage >= 1 && targetPage <= this.maxPage) {
      this.first = (targetPage - 1) * this.rows;
      table.first = this.first;
    }
    else {
      alert("Invalid page number")

    }
  }

  loadReminders() {
    this.reminderService.getReminderbyuserId(this.userId).subscribe(res => {
      this.reminders = res;
      this.reminders.forEach(rem => {
        console.log(rem.dismissed + " " + rem.status + " " + rem.title);

      })

    })
  }

  getSeverity(status: String) {
    switch (status.toLowerCase()) {
      case "active":
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'unread':
        return 'warn';
      default:
        return 'info';
    }
  }

  showDailog(reminder: Reminder | null, mode: 'view' | 'add' | 'edit' = 'add') {
    if (reminder) {
      this.newReminder = { ...reminder, reminderdt: new Date(reminder.reminderdt) };
      this.mode = mode;
    }
    else {
      this.newReminder = {
        title: '',
        detail: '',
        reminderdt: '',
        dismissed: false,
        status: 'Active',
        createdatetime: new Date().toISOString(),
        userId: this.userId
      };
      this.mode = 'add';
    }
    this.visible = true
  }

  updateStatusAndDissmiss(reminder: Reminder) {
    const now = new Date();
    const reminderDate = new Date(reminder.reminderdt);
    if (reminder.dismissed && reminderDate > now) {
      return { ...reminder, dismissed: false, status: 'Active' }
    }
    if (reminderDate > now) {
      return { ...reminder, status: 'Active' };
    }
    if (reminderDate <= now) {
      return { ...reminder, status: 'Unread' }
    }
    return reminder;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.newReminder.userId = this.userId;
      const duplicate = this.reminders.find(rem =>
        rem.title === this.newReminder.title && (this.mode === 'add' || rem.id !== this.newReminder.id)
      )
      if (duplicate) {
        alert('title already exists');
        return;
      }
      this.newReminder = this.updateStatusAndDissmiss(this.newReminder);
      if (this.mode === 'edit') {
        this.reminderService.updateReminder(this.newReminder).subscribe(() => {
          alert('reminder updated');
          this.loadReminders();
          this.mode = 'view';
          this.visible = false;
        })
      }
      else {
        this.reminderService.addReminder(this.newReminder).subscribe((reminder) => {
          this.reminders.push(reminder);
          alert('reminder added succesfully');
          this.loadReminders();
          this.mode = 'view';
          this.visible = false;
        })
      }
      form.resetForm();
    }
  }

  onCancel() {
    if (this.mode === 'add') {
      this.visible = false;
    }
    else if (this.mode === 'edit') {
      this.mode = 'view'
    }

  }

  deleteReminder(id: string) {
    if (confirm('Are you sure you want to delete this reminder?')) {
      this.reminderService.deleteReminder(id).subscribe(() => {
        this.loadReminders();
      });
    }
  }
}
