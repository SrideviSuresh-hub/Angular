import { BehaviorSubject, map, Observable } from "rxjs";
import { User } from "../Models/Users";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "./user.service";
@Injectable({
    providedIn:'root'
})
export class AuthService {
    private curUserSubject: BehaviorSubject<User | null>;
    public curUser: Observable<User | null>;
    userService:UserService=inject(UserService);
    http: HttpClient = inject(HttpClient);
    router:Router=inject(Router);

    constructor() {
        const user = JSON.parse(localStorage.getItem('curUser') || 'null');
        this.curUserSubject = new BehaviorSubject<User | null>(user)
        this.curUser = this.curUserSubject.asObservable();
    }

    public getcurUser(): User | null {
        return this.curUserSubject.value;
    }

    login(username: string, password: string) {
        return this.userService.getUserByUsername(username).pipe(map(user => {
            if (user && user.password === password) {
                localStorage.setItem('curUser', JSON.stringify(user));
                this.curUserSubject.next(user);
                return user;
            } else {
                throw new Error('Invalid Credentials');
            }
        })
        );
    }
    logout(){
        localStorage.removeItem('curUser');
        this.curUserSubject.next(null);
        this.router.navigate(['/login'])
    }
    
}



// getUsers(): Observable<User[]> {
    //     return this.http.get<User[]>(this.url);
    // }
    // getUserByUsername(username: string): Observable<User> {
    //     return this.http.get<User[]>(`${this.url}?username=${username}`)
    //         .pipe(map(users => users[0]));
    // }
    // addUser(user: User): Observable<User> {
    //     return this.http.post<User>(this.url, user)
    // }
    // updateUser(username: string, updateUser: User) {
    //     return this.http.put<User>(`${this.url}?username=${username}`, updateUser);
    // }
    // deleteUser(username: string) {
    //     return this.http.delete(`${this.url}?username=${username}`);
    // }