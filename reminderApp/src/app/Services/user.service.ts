import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { User } from "../Models/users";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    url = 'http://localhost:3000/users';
    http:HttpClient=inject(HttpClient);

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.url);
      }

    getUserByUsername(username:string):Observable<User>{
        return this.http.get<User>(`${this.url}/${username}`);
    }
    addUser(user:User):Observable<User>{
        return this.http.post<User>(this.url,user)
    }
    updateUser(username:string,updateUser:User){
        return this.http.put<User>(`${this.url}/${username}`,updateUser);
    }
    deleteUser(username:string){
        return this.http.delete(`${this.url}/${username}`);
    }
}