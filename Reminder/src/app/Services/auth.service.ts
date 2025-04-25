import { BehaviorSubject, map, Observable } from "rxjs";
import { User } from "../Models/Users";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "./user.service";
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private curUserSubject: BehaviorSubject<User | null>;
    public curUser: Observable<User | null>;
    userService: UserService = inject(UserService);
    http: HttpClient = inject(HttpClient);
    router: Router = inject(Router);
    private timeOut: any;
    private idleTimeOut: number = 10 * 60 * 1000;

    // Initializes user session
    constructor() {
        const user = JSON.parse(localStorage.getItem('curUser') || 'null');
        this.curUserSubject = new BehaviorSubject<User | null>(user)
        this.curUser = this.curUserSubject.asObservable();
        this.resetTimeOut();
        this.userActivity();
    }
    
    // Resets inactivity timer 
    resetTimeOut() {
        if (this.timeOut) {
            clearTimeout(this.timeOut);
        }
        this.timeOut = setTimeout(() => { this.logout() }, this.idleTimeOut);
    }

    // Tracks user activity
    userActivity() {
        document.addEventListener('click', () => this.resetTimeOut());
        document.addEventListener('mousemove', () => this.resetTimeOut());
        document.addEventListener('keydown', () => this.resetTimeOut());
    }

    // Retrieves current user
    public getcurUser(): User | null {
        const userString = localStorage.getItem('curUser');
        const user = userString ? JSON.parse(userString) : null;
        return user;
    }

    // Validates credentials
    login(username: string, password: string) {
        return this.userService.getUserByUsername(username).pipe(
            map(user => {
                if (user && user.password === password) {
                    localStorage.setItem('curUser', JSON.stringify(user));
                    return user;
                } else {
                    throw new Error('Invalid Credentials');
                }
            })
        );
    }

    // Checks if the current user is an admin.
    isAdmin(): boolean {
        const user = this.getcurUser();
        return user ? user.isAdmin : false
    }

    // Determines if a user is logged in,
    isLoggedIn(): boolean {
        return Boolean(localStorage.getItem('isLoggedIn'));
    }

    // Clears session data
    logout() {
        localStorage.removeItem('curUser');
        localStorage.removeItem('curPath');
        localStorage.removeItem('isLoggedIn');
        this.router.navigate(['/login'])
    }
}
