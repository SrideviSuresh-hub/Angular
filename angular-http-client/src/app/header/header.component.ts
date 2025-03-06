import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../Models/user';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit,OnDestroy {
authService:AuthService=inject(AuthService);
isLoggedIn:boolean=false;
private userSubject:Subscription;
ngOnInit(){
this.userSubject=this.authService.user.subscribe((user:User)=>{
  console.log(user);
  this.isLoggedIn=user? true:false;
})
}
ngOnDestroy(){
this.userSubject.unsubscribe();
}
}
