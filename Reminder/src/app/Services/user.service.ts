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
      
    // Fetches all users
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.url);
    }

    // Retrieves a user by username
    getUserByUsername(username: string): Observable<User> {
        return this.http.get<User[]>(`${this.url}?username=${username}`)
        .pipe(map(users=>users[0]));
    }

    // Creates a new user
    addUser(user: User): Observable<User> {
        return this.http.post<User>(this.url, user)
    }

    // Modifies an existing user's details
    updateUser( updateUser: User) {
        return this.http.put<User>(`${this.url}/${updateUser.id}`, updateUser);
    }

    // Removes a user by ID
    deleteUser(id: string) {
        return this.http.delete(`${this.url}/${id}`);
    }  
    
    // Fetches a specific user by ID
    getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.url}/${id}`);
    }
}


