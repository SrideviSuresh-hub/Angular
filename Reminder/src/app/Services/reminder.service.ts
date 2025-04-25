import { inject, Injectable } from "@angular/core";
import { Reminder } from "../Models/reminder";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class ReminderService {
    private url = 'http://localhost:3000/reminders';
    http: HttpClient = inject(HttpClient);
    private popupCountSubject = new BehaviorSubject<number>(0);
    popupReminderCount = this.popupCountSubject.asObservable();
    private popupVisibleSubject = new BehaviorSubject<boolean>(false);
    popupVisible = this.popupVisibleSubject.asObservable();

    // Controls reminder popup visibility
    setPopupVisible(isVisible: boolean) {
        this.popupVisibleSubject.next(isVisible);
    }

    // Updates the number of active popup reminders.
    updatePopupCount(count: number) {
        this.popupCountSubject.next(count);
    }

    // Saves a new reminder
    addReminder(reminder: Reminder): Observable<Reminder> {
        return this.http.post<Reminder>(this.url, reminder);
    }

    // Removes a specific reminde
    deleteReminder(id: string) {
        return this.http.delete<void>(`${this.url}/${id}`);
    }

    // Updates an existing reminder
    updateReminder(reminder: Reminder): Observable<Reminder[]> {
        return this.http.put<Reminder[]>(`${this.url}/${reminder.id}`, reminder);
    }

    // Fetches all reminders
    getReminders(): Observable<Reminder[]> {
        return this.http.get<Reminder[]>(this.url);
    }

    // Retrieves reminders specific to a user
    getReminderbyuserId(userId: string | Date | number | undefined): Observable<Reminder[]> {
        return this.http.get<Reminder[]>(`${this.url}?userId=${userId}`);
    }
}