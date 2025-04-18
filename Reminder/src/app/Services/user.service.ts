import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { User } from "../Models/Users";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    url = 'http://localhost:3000/users';
    http: HttpClient = inject(HttpClient);
       
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.url);
    }
    getUserByUsername(username: string): Observable<User> {
        return this.http.get<User[]>(`${this.url}?username=${username}`)
        .pipe(map(users=>users[0]));
    }
    addUser(user: User): Observable<User> {
        return this.http.post<User>(this.url, user)
    }
    updateUser( updateUser: User) {
        return this.http.put<User>(`${this.url}/${updateUser.id}`, updateUser);
    }
    deleteUser(id: string) {
        return this.http.delete(`${this.url}/${id}`);
    }  
    getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.url}/${id}`);
    }
}


