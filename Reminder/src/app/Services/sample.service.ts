import { ElementRef, inject, Injectable } from "@angular/core";
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
    // private remTable!:ElementRef;
    private reminderTable!: ElementRef;

    setReminderTableRef(tableRef: any) {
        this.reminderTable = tableRef;
    }

    // refreshReminderTable() {
    //     if (this.reminderTable) {
    //         this.reminderTable.reset(); // Refresh PrimeNG table dynamically
    //     }
    // }
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
            const pop = localStorage.getItem('popupClosed');
            const popupClosed = pop ? JSON.parse(pop) : 'false';
            if(!popupClosed){
                this.userPopupVisible.get(userId)?.next(activeReminders.length > 0)
            }
        })
        return this.userPopupReminders.get(userId);
    }

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
                    localStorage.setItem(`popupClosed`, 'false');
                    const updatedReminder = this.updateReminderStatus({ ...upcomingReminder, status: 'Unread' });
                    this.loadPopupReminders(userId);
                    console.log(updatedReminder);
                    
                    this.reminderService.updateReminder(updatedReminder).subscribe(() => {
                        const currentReminders = this.userPopupReminders.get(userId)?.value || [];
                        const updatedReminders = currentReminders.map(rem =>
                            rem.id === updatedReminder.id ? updatedReminder : rem
                        );
                        this.userPopupReminders.get(userId)?.next(updatedReminders);

                        this.userPopupVisible.get(userId)?.next(true);
                        // if(this.remTable){
                        console.log(this.reminderTable.nativeElement());
                            this.reminderTable.nativeElement.refresh();
                        // }
                    });
                }, timeUntilReminder);
            }

        });
    }

    // getPopupReminders(userId: string | number) {
    //     return this.userPopupReminders.get(userId)?.asObservable();
    // }

    getPopupVisible(userId: string | number) {
        return this.userPopupVisible.get(userId);
    }


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
        if (!userId) return;
        const updatedReminder = this.updateReminderStatus({ ...reminder, dismissed: true });
        this.reminderService.updateReminder(updatedReminder).subscribe(() => {
            const updateList = this.userPopupReminders.get(userId)?.value.filter(r => r.id !== reminder.id) || [];
            this.userPopupVisible.get(userId)?.next(updateList.length > 0)
            // return this.userPopupReminders.get(userId);
            return this.userPopupReminders.get(userId)?.next(updateList);
        })

    }

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
                this.dismissReminder(userId, rem)
            })
        })
        return this.userPopupReminders.get(userId)?.next([]);
    }

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