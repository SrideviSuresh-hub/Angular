import { inject, Injectable } from "@angular/core";
import { ReminderService } from "./reminder.service";
import { BehaviorSubject } from "rxjs";
import { Reminder } from "../Models/reminder";

@Injectable({
    providedIn: 'root'
})
export class SampleService {
    private userPopupReminders = new Map<string | number, BehaviorSubject<Reminder[]>>();
    private userPopupVisible = new Map<string | number, BehaviorSubject<boolean>>();
    constructor(private reminderService: ReminderService) { }

    loadPopupReminders(userId: string | number) {
        if (!userId) return;

        if (!this.userPopupReminders.has(userId)) {
            this.userPopupReminders.set(userId, new BehaviorSubject<Reminder[]>([]));
            this.userPopupVisible.set(userId, new BehaviorSubject<boolean>(false));
        }
        this.reminderService.getReminderbyuserId(userId).subscribe((reminders) => {
            const now = new Date();
            const updatedReminders = reminders.map(rem => this.updateReminderStatus(rem));
            updatedReminders.forEach(reminder => {
                this.reminderService.updateReminder(reminder).subscribe();
            })
            const activeReminders = reminders.filter(rem => {
                const reminderDate = new Date(rem.reminderdt);
                return reminderDate <= now && !rem.dismissed;
            });
            this.userPopupReminders.get(userId)?.next(activeReminders);
            // this.userPopupVisible.get(userId)?.next(activeReminders.length > 0)
        })
    }
    setPopupVisible(isVisible: boolean, userId: string | number) {
        if (!userId) return;

        if (!this.userPopupVisible.has(userId)) {
            this.userPopupVisible.set(userId, new BehaviorSubject<boolean>(false));
        }

        this.userPopupVisible.get(userId)?.next(isVisible);
    }
    // startReminderTracking(userId: string | number) {
    //     if (!userId) return;

    //     setInterval(() => {
    //         this.reminderService.getReminderbyuserId(userId).subscribe((reminders) => {
    //             const now = new Date();
    //             const updatedReminders = reminders.map(rem => this.updateStatusAndDismiss(rem));
    //             this.userPopupReminders.get(userId)?.next(updatedReminders);
    //             this.userPopupVisible.get(userId)?.next(updatedReminders.length > 0);
    //         });
    //     }, 60000);
    // }

    trackNextReminder(userId: string | number) {
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
                    this.reminderService.updateReminder(updatedReminder).subscribe(() => {
                        const currentReminders = this.userPopupReminders.get(userId)?.value || [];
                        const updatedReminders = currentReminders.map(rem =>
                            rem.id === updatedReminder.id ? updatedReminder : rem
                        );
                        this.userPopupReminders.get(userId)?.next(updatedReminders);
                        this.userPopupVisible.get(userId)?.next(true);
                    });
                }, timeUntilReminder);
            }
        });
    }

    getPopupReminders(userId: string | number) {
        return this.userPopupReminders.get(userId)?.asObservable();
    }
    getPopupVisible(userId: string | number) {
        return this.userPopupVisible.get(userId)?.asObservable();
    }

    // updateStatusAndDismiss(reminder: Reminder) {
    //     const now = new Date();
    //     const reminderDate = new Date(reminder.reminderdt);
    //     if (reminder.dismissed && reminderDate > now) {
    //         return { ...reminder, dismissed: false, status: 'Active' }
    //     }
    //     if (reminderDate > now) {
    //         return { ...reminder, status: 'Active' };
    //     }
    //     if (reminderDate <= now) {
    //         return { ...reminder, status: 'Unread' }
    //     }
    //     return reminder;
    // }
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
    
    dismissReminder(userId: string | number, reminder: Reminder) {
        const updatedReminder = this.updateReminderStatus({...reminder, dismissed: true });
        this.reminderService.updateReminder(updatedReminder).subscribe(() => {
            const updateList = this.userPopupReminders.get(userId)?.value.filter(r => r.id !== reminder.id) || [];
            // this.userPopupReminders.get(userId)?.next(updateList);
            this.userPopupVisible.get(userId)?.next(updateList.length > 0)
        })
    }
 
    dismissAllReminders(userId: string | number) {
        if (!userId) return;
        const updatedReminders = this.userPopupReminders.get(userId)?.value.map(rem => ({
            ...rem,
            dismissed: true,
            status: 'Inactive'
        })) || [];
        updatedReminders.forEach(rem => {
            this.reminderService.updateReminder(rem).subscribe(() => {
                this.refreshReminders(userId);
            })
        })
        this.userPopupReminders.get(userId)?.next([]);
        this.userPopupVisible.get(userId)?.next(false);
    }


    refreshReminders(userId: string | number) {
        if (!userId) return;
        this.reminderService.getReminderbyuserId(userId).subscribe({
            next: (reminders) => {
                const filteredReminders = reminders.filter(rem => !rem.dismissed);
                this.userPopupReminders.get(userId)?.next(filteredReminders);
            }
        })

    }

}