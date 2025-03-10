import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AuthResponse } from "../Models/authResponse";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { User } from "../Models/user";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    http: HttpClient = inject(HttpClient);
    user = new BehaviorSubject<User>(null);
    router: Router = inject(Router);
    private tokenExpireTimer:any;

    signup(eemail:string, ppassword:string) {
        const data = {
            email: eemail,
            password: ppassword,
            returnSecureToken: true
        }
        return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDKLjlRJW1wIEgAuyRPTedfUTUBDRK03SE'
            , data).pipe(catchError((err) => {
                return this.handleError(err)
            }), tap((resp) => {
                this.handleCreateUser(resp);
            }))
    }

    login(eemail:string, ppassword:string) {
        const data = {
            email: eemail,
            password: ppassword,
            returnSecureToken: true
        }
        return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDKLjlRJW1wIEgAuyRPTedfUTUBDRK03SE'
            , data).pipe(catchError(this.handleError),
                tap((resp) => { 
                    this.handleCreateUser(resp); 
                    this.router.navigate(['/dashboard']);
                }))
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/login'])
        localStorage.removeItem('user');
        if (this.tokenExpireTimer) {
            clearTimeout(this.tokenExpireTimer);
        }
        this.tokenExpireTimer = null;
    }

    autoLogout(expireTime: number) {
        console.log(expireTime)
       this.tokenExpireTimer= setTimeout(() => {
            this.logout();
        }, expireTime);
    }


    autoLogin() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            console.log('no user found')
            return;
        }
        const loggedUser = new User(user.email, user.id, user._token, new Date(user._expiresIn));
        if (loggedUser.token) {
            this.user.next(loggedUser);
        const timerValue = user._expiresIn.getTime() - new Date().getTime();
        console.log(timerValue)
        this.autoLogout(timerValue);
        }
    }
//getTime-millisec
//from db -sec

    private handleCreateUser(resp) {
        console.log(+resp.expiresIn);//3600 o/p
        // Ensure expiresIn is a valid number
    const expiresInSeconds = Number(resp.expiresIn);
    if (isNaN(expiresInSeconds)) {
        console.error('Invalid expiresIn value:', resp.expiresIn);
        return;
    }
        const expireInTs = new Date().getTime() + +resp.expiresInSeconds * 1000;//miliisec*1000=sec
        const expireIn = new Date(expireInTs);
        console.log(expireIn)//stand time
        const user = new User(resp.email, resp.localId, resp.idToken, expireIn);
        this.user.next(user);
        console.log(expiresInSeconds * 1000);//3600000
        this.autoLogout(expiresInSeconds * 1000);//milli
        localStorage.setItem('user', JSON.stringify(user))
    }

    private handleError(err) {
        let unknownError = 'An Unknown error has occured'
        console.log(err);
        if (!err.error || err.error.error) {
            throwError(() => unknownError)
        }
        switch (err.error.error.message) {
            case 'EMAIL_EXISTS':
                unknownError = 'this email already exits'
                break;
            case 'OPERATION_NOT_ALLOWED':
                unknownError = "this operation is not allowed"
                break;
            case 'INVALID_LOGIN_CREDENTIALS':
                unknownError = "invalid login credentials"
                break;

        }
        return throwError(() => unknownError)



    }
}