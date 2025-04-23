import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Reminder } from '../../Models/reminder';
import { ReminderService } from '../../Services/reminder.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';

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
  confirmationService: ConfirmationService = inject(ConfirmationService)
  visible: boolean = false;
  mode: 'view' | 'edit' | 'add' = 'view';
  first = 0;
  rows = 10;
  totalRecords = 0;
  curPageInput: number = 1;
  maxPage: number = Math.ceil(this.totalRecords / this.rows);
  @ViewChild('titleInput') titleInput!: ElementRef;

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
  popupReminders: Reminder[] = []
  ngOnInit(): void {
    localStorage.setItem('curPath', 'portal/reminder')
    const user = this.authService.getcurUser();
    if (user) {
      this.userId = user.id!;
      this.newReminder.userId = user.id!;
      this.loadReminders();
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
      table.paginate({ first: this.first, rows: this.rows });

    }
    else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Page',
        detail: 'Invalid page number'
      });
    }
  }

  loadReminders() {
    this.reminderService.getReminderbyuserId(this.userId).subscribe(res => {
      this.reminders = res;
      this.totalRecords = this.reminders.length;
      this.maxPage = Math.ceil(this.totalRecords / this.rows);
    })
  }

  getSeverity(status: String) {
    switch (status.toLowerCase()) {
      case "active":
        return 'tag-active';
      case 'inactive':
        return 'tag-inactive';
      case 'unread':
        return 'tag-unread';
      default:
        return 'tag-default';
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
    if (!form.valid) {
      const alphanumericPattern = /^[a-zA-Z0-9]*$/;
      if (!this.newReminder.title) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation Error',
          detail: 'Title is required'
        });
        return;
      }
      if (!alphanumericPattern.test(this.newReminder.title)) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation Error',
          detail: 'Title should only contain letters, numbers, and spaces'
        });
        return;
      }
      const alphanumericSpacePattern = /^[a-zA-Z0-9 ]*$/;
      if (!this.newReminder.detail) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation Error',
          detail: 'Detail is required'
        });
        return;
      }
      if (!alphanumericSpacePattern.test(this.newReminder.detail)) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation Error',
          detail: 'Detail should only contain letters, numbers, and spaces'
        });
        return;
      }
    }

    console.log("Submitting reminder:", this.newReminder);
    if (form.valid) {
      this.newReminder.userId = this.userId;
      const duplicate = this.reminders.find(rem =>
        rem.title === this.newReminder.title && (this.mode === 'add' || rem.id !== this.newReminder.id)
      )
      if (duplicate) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Duplicate Title',
          detail: 'Reminder title already exists'
        });
        setTimeout(() => {
          this.titleInput.nativeElement.focus();
        }, 1000);
        return;
      }
      this.newReminder = this.updateStatusAndDissmiss(this.newReminder);
      if (this.mode === 'edit') {

        this.reminderService.updateReminder(this.newReminder).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Reminder updated successfully'
          });
          this.loadReminders();
          this.mode = 'view';
          this.visible = false;
        })
      }
      else {
        this.reminderService.addReminder(this.newReminder).subscribe((reminder) => {
          this.reminders.push(reminder);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Reminder added successfully'
          });
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
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this reminder?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.reminderService.deleteReminder(id).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Reminder deleted successfully'
          });
          this.loadReminders();
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Deletion cancelled'
        });
      }
    });
  }

}
