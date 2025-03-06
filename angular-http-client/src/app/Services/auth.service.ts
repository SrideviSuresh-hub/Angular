import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AuthResponse } from "../Models/authResponse";
import { BehaviorSubject, catchError, Subject, tap, throwError } from "rxjs";
import { User } from "../Models/user";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    http: HttpClient = inject(HttpClient);
    user=new BehaviorSubject<User>(null)
    signup(eemail, ppassword) {
        const data = {
            email: eemail,
            password: ppassword,
            returnSecureToken: true
        }
        return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDKLjlRJW1wIEgAuyRPTedfUTUBDRK03SE'
            , data).pipe(catchError((err) => {
                return this.handleError(err)
            }),tap((resp)=>{
                this.handleCreateUser(resp);
                }))
    }

    login(eemail, ppassword) {
        const data = {
            email: eemail,
            password: ppassword,
            returnSecureToken: true
        }
        return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDKLjlRJW1wIEgAuyRPTedfUTUBDRK03SE'
        , data).pipe(catchError(this.handleError),
    tap((resp)=>{this.handleCreateUser(resp);}))

    }
    private handleCreateUser(resp){
        const expireInTs=new Date().getTime()+ +resp.expiresIn*1000;
        const expireIn=new Date(expireInTs);
      const user=  new User(resp.email,resp.localId,resp.idToken,expireIn);
    this.user.next(user);
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