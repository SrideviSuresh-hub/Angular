import { inject, Injectable } from "@angular/core";
import { Reminder } from "../Models/reminder";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn:'root'
})
export class ReminderService{
    private url='http://localhost:3000/reminders';
    http:HttpClient=inject(HttpClient);
    addReminder(reminder:Reminder):Observable<Reminder>{
        return this.http.post<Reminder>(this.url,reminder);
    }
    deleteReminder(id:string){
        return this.http.delete<void>(`${this.url}/${id}`);
    }
    updateReminder(reminder:Reminder):Observable<Reminder[]>{
        return this.http.put<Reminder[]>(`${this.url}/${reminder.id}`,reminder);
    }
    getReminders():Observable<Reminder[]>{
        return this.http.get<Reminder[]>(this.url);
    }
    getReminderbyuserId(userId:string|Date|number|undefined):Observable<Reminder[]>{
        console.log(`${this.url}?${userId}=${userId}`);
        return this.http.get<Reminder[]>(`${this.url}?${userId}=${userId}`);
        
    }
}