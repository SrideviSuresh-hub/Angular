import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { User } from '../../Models/Users';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
router:Router=inject(Router);
authService:AuthService=inject(AuthService);
curUser:User|null=this.authService.getcurUser();
navigateToHome(){
  if(this.curUser?.isAdmin){
    
    this.router.navigate(['portal/home'])
  }
  else{
    this.router.navigate(['portal/userhome'])

  }
}
changeTheme(){

}
onLogout(){
  this.authService.logout()
}
}
