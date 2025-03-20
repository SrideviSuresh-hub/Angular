import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class UsersService{
    http:HttpClient=inject(HttpClient);
    private baseUrluser='https://assignment-a22f7-default-rtdb.firebaseio.com/user';

    getUsers(){
        return this.http.get(`${this.baseUrluser}.json`)
    }

    addUser(user:any):Observable<any>{
        return this.http.post(`${this.baseUrluser}.json`,user);
    }
    updateUser(user:any):Observable<any>{
        return this.http.put(`${this.baseUrluser}/${user.id}`,user);
    }
    deleteUser(id:string):Observable<any>{
        return this.http.delete(`${this.baseUrluser}/${id}.json`)
    }
}
