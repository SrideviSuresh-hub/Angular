import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Reminder } from "../Models/reminder";
import { ReminderService } from "./reminder.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private unreadReminders = new BehaviorSubject<Reminder[]>([]);
  reminders$ = this.unreadReminders.asObservable();

  private popupVisible = new BehaviorSubject<boolean>(false);
  popupVisible$ = this.popupVisible.asObservable();

  constructor(private reminderService: ReminderService) { }

  //popup-visible
  setPopupVisible(isVisible: boolean) {
    this.popupVisible.next(isVisible);
  }

  // Load unread reminders & trigger popup visibility
  loadPopupReminders(userId: string | number | undefined | Date) {
    if (!userId) return;
    this.reminderService.getReminderbyuserId(userId).subscribe(reminders => {
      const updatedReminders = reminders.map(reminder => this.updateReminderStatus(reminder));
      updatedReminders.forEach(reminder => {
        this.reminderService.updateReminder(reminder).subscribe();
      });
      this.unreadReminders.next(updatedReminders.filter(rem => !rem.dismissed && new Date(rem.reminderdt) <= new Date()));
      this.popupVisible.next(this.unreadReminders.value.length > 0);
    });
  }

  //tracking upcomming reminder to show in popup 
  trackNextReminder(userId: number | undefined | Date | string) {
    if (!userId) return;
    this.reminderService.getReminderbyuserId(userId).subscribe(reminders => {
      const now = new Date();
      const upcomingReminder = reminders
        .filter(r => !r.dismissed && new Date(r.reminderdt) > now)
        .sort((a, b) => new Date(a.reminderdt).getTime() - new Date(b.reminderdt).getTime())[0];
      if (upcomingReminder) {
        const timeUntilReminder = new Date(upcomingReminder.reminderdt).getTime() - now.getTime();
        setTimeout(() => {
          this.loadPopupReminders(userId);
          const updatedReminder = { ...upcomingReminder, status: 'Unread' };
        this.reminderService.updateReminder(updatedReminder).subscribe(()=>
        {
          const updatedReminders = [...this.unreadReminders.value, upcomingReminder];
          this.unreadReminders.next(updatedReminders);
        })
      }, timeUntilReminder);
      }
    });
  }

  // Updates reminder status dynamically based on time
  updateReminderStatus(reminder: Reminder): Reminder {
    const now = new Date();
    const reminderDate = new Date(reminder.reminderdt);
    let updatedStatus = reminder.status; // Default to current status 
    if (reminder.dismissed) {
      updatedStatus = reminderDate > now ? 'Active' : 'Inactive';
    } else {
      updatedStatus = reminderDate > now ? 'Active' : 'Unread';
    }
    return { ...reminder, status: updatedStatus };
  }

  // Dismiss a single reminder globally
  dismissReminder(reminder: Reminder) {
    const updatedReminder = this.updateReminderStatus({ ...reminder, dismissed: true });
    this.reminderService.updateReminder(updatedReminder).subscribe(() => {
      this.unreadReminders.next(this.unreadReminders.value.filter(r => r.id !== reminder.id));
      this.popupVisible.next(this.unreadReminders.value.length > 0);
    });
  }


 // Dismiss all reminders globally
  dismissAllReminders(userId: string | Date | number | undefined) {
    if (!userId) return;
    const updatedReminders = this.unreadReminders.value.map(reminder => ({
      ...reminder,
      dismissed: true,
      status:'Inactive'
    }));
    updatedReminders.forEach(reminder => {
      this.reminderService.updateReminder(reminder).subscribe(()=>{
        this.refreshReminders(userId);
      });
    });
    this.unreadReminders.next([]);
    this.popupVisible.next(false);
  }

  // refresh after dismissal
  refreshReminders(userId: string | Date | number | undefined) {
    if (!userId) return;
    this.reminderService.getReminderbyuserId(userId).subscribe(reminders => {
      this.unreadReminders.next(reminders.filter(rem => !rem.dismissed));
    });
  }
}