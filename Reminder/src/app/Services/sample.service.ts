import { Injectable } from "@angular/core";
import { ReminderService } from "./reminder.service";
import { BehaviorSubject, tap } from "rxjs";
import { Reminder } from "../Models/reminder";

@Injectable({
    providedIn: 'root'
})
export class SampleService {
    private userPopupReminders = new Map<string | number, BehaviorSubject<Reminder[]>>();
    private userPopupVisible = new Map<string | number, BehaviorSubject<boolean>>();
    private userReminderTimeouts = new Map<number, any>();
    constructor(private reminderService: ReminderService) { }


    // Loads popup reminders and updates visibility state.
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
            const activeReminders = updatedReminders.filter(rem => {
                const reminderDate = new Date(rem.reminderdt);
                return reminderDate <= now && !rem.dismissed && rem.status === 'Unread';
            });
            this.userPopupReminders.get(userId)?.next(activeReminders);
            const popup = localStorage.getItem('popupClosed');
            const popupClosed = popup ? JSON.parse(popup) : 'false';
            if (!popupClosed) {
                this.userPopupVisible.get(userId)?.next(activeReminders.length > 0)
            }
        })
        return this.userPopupReminders.get(userId);
    }

    // Sets the visibility state of the reminder popup
    setPopupVisible(isVisible: boolean, userId: string | number) {
        if (!userId) return;
        if (!this.userPopupVisible.has(userId)) {
            this.userPopupVisible.set(userId, new BehaviorSubject<boolean>(false));
        }
        this.userPopupVisible.get(userId)?.next(isVisible);
        if (!isVisible) {
            localStorage.setItem(`popupClosed`, 'true');
        }
    }

    // Tracks the next upcoming reminder 
    trackNextReminder(userId: string | number) {
        if (!userId) return;
        this.reminderService.getReminderbyuserId(userId).subscribe(reminders => {
            const now = new Date();
            const futureReminders = reminders
                .filter(r => !r.dismissed && new Date(r.reminderdt) > now)
                .sort((a, b) => new Date(a.reminderdt).getTime() - new Date(b.reminderdt).getTime());
            if (futureReminders.length === 0) return;
            const nextReminder = futureReminders[0];
            const delay = new Date(nextReminder.reminderdt).getTime() - now.getTime();
            if (this.userReminderTimeouts.has(+userId)) {
                clearTimeout(this.userReminderTimeouts.get(+userId));
            }
            const timeout = setTimeout(() => {
                const updatedReminder = this.updateReminderStatus({
                    ...nextReminder,
                    status: 'Unread'
                });
                this.reminderService.updateReminder(updatedReminder).subscribe(() => {
                    localStorage.setItem('popupClosed', 'false');

                    this.loadPopupReminders(userId); const remindersNow = this.userPopupReminders.get(userId)?.value || [];
                    const updatedReminders = remindersNow.map(rem =>
                        rem.id === updatedReminder.id ? updatedReminder : rem
                    );
                    this.userPopupReminders.get(userId)?.next(updatedReminders);
                    this.userPopupVisible.get(userId)?.next(true);
                    this.trackNextReminder(userId);
                });
            }, delay);
            this.userReminderTimeouts.set(+userId, timeout);
        });
    }

    // Returns the visibility state of the popup 
    getPopupVisible(userId: string | number) {
        return this.userPopupVisible.get(userId);
    }

    // Updates the status of a reminder 
    updateReminderStatus(reminder: Reminder): Reminder {
        const now = new Date();
        const reminderDate = new Date(reminder.reminderdt);
        let updatedStatus = reminder.status;
        if (reminder.dismissed) {
            updatedStatus = reminderDate > now ? 'Active' : 'Inactive';
        } else {
            updatedStatus = reminderDate > now ? 'Active' : 'Unread';
        }
        return { ...reminder, status: updatedStatus };
    }

    // Marks a specific reminder as dismissed
    dismissReminder(userId: string | number, reminder: Reminder) {
        if (!userId) return;
        const updatedReminder = this.updateReminderStatus({ ...reminder, dismissed: true });
        return this.reminderService.updateReminder(updatedReminder).pipe(tap(() => {
            const updateList = this.userPopupReminders.get(userId)?.value.filter(r => r.id !== reminder.id) || [];
            this.userPopupReminders.get(userId)?.next(updateList);
            this.userPopupVisible.get(userId)?.next(updateList.length > 0);
        }));
    }


    // Dismisses all popup reminders for a user
    dismissAllReminders(userId: string | number) {
        if (!userId) return;
        const currentReminders = this.userPopupReminders.get(userId)?.value || [];
        if (currentReminders.length === 0) {
            this.userPopupVisible.get(userId)?.next(false);
            return;
        }
        const updatedReminders = currentReminders.map(rem => ({
            ...rem,
            dismissed: true,
            status: 'Inactive'
        }));
        updatedReminders.forEach(rem => {
            this.reminderService.updateReminder(rem).subscribe(() => {
            })
        })
        return this.userPopupReminders.get(userId)?.next([]);
    }

    // Refreshes reminders by fetching updated ones from the service
    refreshReminders(userId: string | number) {
        if (!userId) return;
        this.reminderService.getReminderbyuserId(userId).subscribe({
            next: (reminders) => {
                const filteredReminders = reminders.filter(rem => !rem.dismissed);
                return this.userPopupReminders.get(userId)?.next(filteredReminders);
            }
        })
    }
}