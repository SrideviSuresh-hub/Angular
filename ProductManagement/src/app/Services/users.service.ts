import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { User } from "../Models/User";

@Injectable({
    providedIn:'root'
})
export class UsersService{
    http:HttpClient=inject(HttpClient);
    private baseUrluser='https://assignment-a22f7-default-rtdb.firebaseio.com/user';


    getUsers(){
        return this.http.get<{[key:string]:User}>(`${this.baseUrluser}.json`)
        .pipe(
            map((userdata)=>{
                if(!userdata) return [];
                return Object.keys(userdata).map((key)=>({
                    ...userdata[key],
                    id:key
                }))
            })
        )
    }

    addUser(user:any):Observable<any>{
        return this.http.post(`${this.baseUrluser}.json`,user);
    }
    updateUser(user:any):Observable<any>{
        return this.http.put(`${this.baseUrluser}/${user.id}`,user);
    }
    deleteUser(userId:string):Observable<any>{
        return this.http.delete(`${this.baseUrluser}/${userId}.json`)
    }

    getUserbyUserId(userId):Observable<any>{
            return this.http.get(`${this.baseUrluser}/${userId}.json`);
            
    }}
   