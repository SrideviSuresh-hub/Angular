import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Reminder } from "../Models/reminder";
import { ReminderService } from "./reminder.service";

@Injectable({
    providedIn:'root'
})
export class NotificationService{

    private unreadReminders = new BehaviorSubject<Reminder[]>([]);
    reminders$ = this.unreadReminders.asObservable();
    
    private popupVisible = new BehaviorSubject<boolean>(false);
    popupVisible$ = this.popupVisible.asObservable();
  
    constructor(private reminderService: ReminderService) {}
  
    //popup-visible
    setPopupVisible(isVisible: boolean) {
        this.popupVisible.next(isVisible);
    }

    // Load unread reminders & trigger popup visibility
    loadPopupReminders(userId: string | number | undefined|Date) {
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
        this.reminderService.updateReminder(updatedReminder).subscribe(response => {
          this.unreadReminders.next(this.unreadReminders.value.filter(r => r.id !== reminder.id));
          this.popupVisible.next(this.unreadReminders.value.length > 0);
        });
      }
      
  
    // Dismiss all reminders globally
    dismissAllReminders(userId: string|Date|number|undefined) {
        if (!userId) return;
        const updatedReminders = this.unreadReminders.value.map(reminder => ({
          ...reminder,
          dismissed: true,
        }));  
        updatedReminders.forEach(reminder => {
          this.reminderService.updateReminder(reminder).subscribe();
        });  
        this.unreadReminders.next([]); 
        this.popupVisible.next(false);
  }
}