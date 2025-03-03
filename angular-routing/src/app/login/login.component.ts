import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
 
  @ViewChild('uname')uname:ElementRef;
  @ViewChild('psw')psw:ElementRef;
  authService:AuthService=inject(AuthService);
  router:Router=inject(Router);
  activeRoute:ActivatedRoute=inject(ActivatedRoute);

ngOnInit(){
  this.activeRoute.queryParamMap.subscribe((queries)=>{
    const logout=Boolean(queries.get('logout'))
    if(logout){
      this.authService.logout()
      alert('you are now logged out'+ this.authService.isLogged);
    }
  })
}


  verifyLogin(){
    let uname=this.uname.nativeElement.value;
    let psw=this.psw.nativeElement.value;
    const user=this.authService.login(uname,psw)
    console.log(uname,psw);
    if(user === undefined){
      alert('login details entered are in correct');
    }
    else{
      alert('Welcome '+user.name+' you have logged in');
      this.router.navigate(['\Course']);
    }
  }



}


// authService:AuthService=inject(AuthService);
//   verifyLogin(uname:string,psw:string){
//     if(!uname || !psw){
//       alert('please enter both')
//       return;
//     }
//     const user= this.authService.login(uname,psw);
//     console.log(uname,psw);
//        if(user===undefined){
//         alert('login details enyered are not correct')
//        }
//        else{
//         alert('Welcome'+user.name+', you are logged in')
//        }
//   }