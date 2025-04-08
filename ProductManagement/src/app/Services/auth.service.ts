

import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AuthResponse } from "../Models/authResponse";
import { catchError, last, map, Observable, Subject, switchMap, tap, throwError } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    router: Router = inject(Router);
    http: HttpClient = inject(HttpClient);
    private baseUrluser = 'https://assignment-a22f7-default-rtdb.firebaseio.com/user';
    private timeOut: any;
    private idleTimeOut: number = 10 * 60 * 1000;

    constructor() {
        this.resetTimeOut();
        this.userActivity();
    }
    resetTimeOut() {
        if (this.timeOut) {
            clearTimeout(this.timeOut);
        }
        this.timeOut = setTimeout(() => { this.logout() }, this.idleTimeOut);
    }

    userActivity() {
        document.addEventListener('click', () => this.resetTimeOut());
        document.addEventListener('mousemove', () => this.resetTimeOut());
        document.addEventListener('keydown', () => this.resetTimeOut());
    }

    signUp(user: any): Observable<any> {
        return this.http.post(`${this.baseUrluser}.json`, user);
    }


    getUserByUserName(username: string) {
        return this.http.get<{ [key: string]: any }>(`${this.baseUrluser}.json`).pipe(
            map(data => {
                if (!data) return null;
                const users = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                return users.find(u => u.userName == username) || null;
            }),
            catchError(() => throwError(() => "error fetching user")));
    }


    login(email: string, password: string): Observable<any> {
        return this.http.get<{ [key: string]: any }>(`${this.baseUrluser}.json`).pipe(
            map((data) => {
                if (data) {
                    const users = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                    const user = users.find(u => u.email === email && u.password === password);
                    return user || null;
                }
                return null;
            }),
            tap(user => {
                if (user) {
                    localStorage.setItem('user', JSON.stringify({
                        userName: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        id: user.id,
                        isAdmin: user.isAdmin,
                        address1: user.address1,
                        address2: user.address2,
                        country: user.country,
                        zipCode: user.zipCode,
                        image: user.image,
                        state: user.states
                    }));
                }

            })
        )
    }

    logout() {
        localStorage.removeItem('user');
        this.router.navigate(['/login']).then(() => {
            window.location.reload();
        });
    }
    getAllUsers() {
        return this.http.get(`${this.baseUrluser}.json`).pipe(
            map(users => {
                if (!users) return [];
                return Object.keys(users).map(key => ({ ...users[key], id: key }))
            }))
    }

    getCurrentUser(): any {
        return JSON.parse(localStorage.getItem('user') || null);
    }

    isAdmin(): boolean {
        const user = this.getCurrentUser();
        return user ? user.isAdmin : false;
    }

    isLoggedIn(): boolean {
        return !!this.getCurrentUser();
    }
    updatePassword(userId: string, newPassword: string) {
        return this.http.patch(`${this.baseUrluser}/${userId}.json`, {
            password: newPassword,
            isFirstLogin: false 
        });
      }

}



