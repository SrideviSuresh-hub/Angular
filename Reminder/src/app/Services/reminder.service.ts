import { inject, Injectable } from "@angular/core";
import { Reminder } from "../Models/reminder";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn:'root'
})
export class ReminderService{
    private url='http://localhost:3000/reminders';
    http:HttpClient=inject(HttpClient);
    private popupCountSubject = new BehaviorSubject<number>(0);
    popupReminderCount$ = this.popupCountSubject.asObservable();
    private popupVisibleSubject = new BehaviorSubject<boolean>(false);     
    popupVisible$ = this.popupVisibleSubject.asObservable();
   
    setPopupVisible(isVisible: boolean) {
      this.popupVisibleSubject.next(isVisible);
    }
   
      updatePopupCount(count: number) {
        this.popupCountSubject.next(count);
    }

    ngOnInit(){
    console.log(this.popupReminderCount$);
   }
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