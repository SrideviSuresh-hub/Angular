import { ChangeDetectorRef, Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Reminder } from '../../Models/reminder';
import { ReminderService } from '../../Services/reminder.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SampleService } from '../../Services/sample.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-reminder',
  standalone: false,
  templateUrl: './reminder.component.html',
  styleUrl: './reminder.component.css'
})
export class ReminderComponent implements OnInit {
  visible: boolean = true;
  visibleRemPopup: boolean = false;
  mode: 'view' | 'edit' | 'add' = 'view';
  first = 0;
  rows = 10;
  totalRecords = 0;
  curPageInput: number = 1;
  paginatorMargin: number = 0;
  maxPage: number = Math.ceil(this.totalRecords / this.rows);
  reminderService: ReminderService = inject(ReminderService);
  authService: AuthService = inject(AuthService);
  sampleService: SampleService = inject(SampleService);
  messageService: MessageService = inject(MessageService);
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  confirmationService: ConfirmationService = inject(ConfirmationService);
  @ViewChild('titleInput') titleInput!: ElementRef;
  @ViewChild('dt') tableRef!: ElementRef;
  user = this.authService.getcurUser();
  newReminder: Reminder = {
    title: '',
    detail: '',
    reminderdt: '',
    dismissed: false,
    status: 'Active',
    createdatetime: new Date().toISOString(),
    userId: 0
  }
  userId!: number | string;
  reminders: Reminder[] = [];
  popupReminders: Reminder[] = [];
  minDate!: Date;

  // loads user reminders
  ngOnInit(): void {
    localStorage.setItem('curPath', 'portal/reminder');
    if (this.user) {
      this.userId = this.user.id!;
      this.newReminder.userId = this.user.id!;
      this.loadReminders();
      this.loadPopupReminders();
    }
    this.sampleService.getPopupVisible(this.userId)?.subscribe(visible => {
      this.visible = visible; 
    });
    setInterval(() => {
      this.sampleService.trackNextReminder(this.userId)
    }, 1000);
    const today = new Date();
    this.minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

  // Adjusts paginator position after view initialization.
  ngAfterViewInit() {
    this.adjustPaginatorPosition();
  }

  // Recalculates paginator position on window resize
  @HostListener('window:resize')
  onResize() {
    this.adjustPaginatorPosition();
  }

  // Dynamically positions paginator
  adjustPaginatorPosition() {
    if (this.tableRef) {
      const tableHeight = this.tableRef.nativeElement.clientHeight;
      const viewportHeight = window.innerHeight;
      const marginValue = viewportHeight - tableHeight - 80;
      document.documentElement.style.setProperty('--paginator-margin', `${marginValue}px`);
    }
  }

  // on table page  chnage
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.maxPage = Math.ceil(this.totalRecords / this.rows);
    this.curPageInput = event.page + 1
  }

  // goes to specific page
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

  loadPopupReminders() {
    if (!this.user?.id) return;
    this.sampleService.loadPopupReminders(this.userId);
    this.sampleService.getPopupReminders(this.userId)?.subscribe((reminders) => {
        this.popupReminders = reminders.filter(r => !r.dismissed);
    })
    // const popupVisible$ = this.sampleService.getPopupVisible(this.user.id) ?? new BehaviorSubject<boolean>(false).asObservable();
    //     popupVisible$.subscribe(isVisible => {
    //       this.visible = isVisible;
    //     });
    // this.cdr.detectChanges(); 

  }
  dismissReminder(reminder: Reminder) {
    if (!this.userId) return;
    this.sampleService.dismissReminder(this.userId, reminder);
    this.sampleService.getPopupReminders(this.userId)?.subscribe((reminders)=>{
    //   this.popupReminders = rem.map(r => 
    //     r.id === reminder.id ? { ...r, status: 'Inactive' } : r
    // );
    this.popupReminders = reminders.filter(r => !r.dismissed);
      this.visible = this.popupReminders.length > 0;
    })
  }
  dismissAllReminders() {
    if (!this.userId) return;
    this.sampleService.dismissAllReminders(this.userId);
    this.sampleService.getPopupReminders(this.userId)?.subscribe(()=>{
      this.popupReminders = [];
      this.loadReminders();
    // this.reminders = this.reminders.map(r => ({
    //     ...r, status: 'Inactive'
    // }));
  })
    this.visible = false;
  }

  // Fetches reminders
  loadReminders() {
    if (!this.user?.id) return;
    this.reminderService.getReminderbyuserId(this.userId).subscribe(res => {
      // this.reminders = res.map(reminder => this.updateStatusAndDismiss(reminder));
      this.reminders = res;
      this.totalRecords = this.reminders.length;
      this.maxPage = Math.ceil(this.totalRecords / this.rows);
    })
  }

  handlePopupClose() {
    this.visible = false;
  }


  // Returns severity class
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

  // display modal
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
    this.visibleRemPopup = true
  }

  // Updates reminder status
  updateStatusAndDismiss(reminder: Reminder) {
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

  // Validates reminder input
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
      if (!this.newReminder.reminderdt) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation Error',
          detail: 'Reminder date time is required'
        });
        return;
      }
    }
    if (form.valid) {
      this.newReminder.userId = this.userId;
      const duplicate = this.reminders.find(rem =>
        rem.title === this.newReminder.title && (this.mode === 'add' || rem.id !== this.newReminder.id)
      )
      const now = new Date();
      const reminderDate = new Date(this.newReminder.reminderdt);
      if (reminderDate <= now) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation Error',
          detail: 'Reminder date and time must be in the future'
        });
        return;
      }

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

      this.newReminder = this.updateStatusAndDismiss(this.newReminder);
      if (this.mode === 'edit') {
        this.newReminder.createdatetime = new Date().toISOString();
        this.reminderService.updateReminder(this.newReminder).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Reminder updated successfully'
          });
          this.loadReminders();
          this.loadPopupReminders();
          this.mode = 'view';
          this.visibleRemPopup = false;
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
          this.loadPopupReminders();
          this.mode = 'view';
          this.visibleRemPopup = false;
        })
      }
      form.resetForm();
    }
  }

  // Handles closing of reminder modal
  onCancel() {
    if (this.mode === 'add') {
      this.visibleRemPopup = false;
    }
    else if (this.mode === 'edit') {
      this.mode = 'view'
    }

  }

  // Deletes reminder
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

      }
    });
  }
}
