import { inject, Injectable } from "@angular/core";
import { Reminder } from "../Models/reminder";
import { map, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class ReminderService {
    private url = 'http://localhost:3000/reminders';
    http: HttpClient = inject(HttpClient);
  
    // Saves a new reminder
    addReminder(reminder: Reminder): Observable<Reminder> {
        return this.http.post<Reminder>(this.url, reminder);
    }

    // Removes a specific reminde
    deleteReminder(id: string) {
        return this.http.delete<void>(`${this.url}/${id}`);
    }

    // Updates reminder
    updateReminder(reminder: Reminder): Observable<Reminder> {
        return this.http.put<Reminder>(`${this.url}/${reminder.id}`, reminder);
    }

    // Fetches all reminders
    getReminders(): Observable<Reminder[]> {
        return this.http.get<Reminder[]>(this.url);
    }

    // Retrieves reminders specific to a user
    getReminderbyuserId(userId: number|string |Date) {
        return this.http.get<Reminder[]>(`${this.url}`).pipe(
          map(reminders => reminders.filter(reminder => reminder.userId === userId))
        );
      }

}