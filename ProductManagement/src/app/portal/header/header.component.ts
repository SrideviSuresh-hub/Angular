import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  
  authService:AuthService=inject(AuthService);
  router:Router=inject(Router)
  curUser=JSON.parse(localStorage.getItem('user'))
  imgURL=this.curUser.imageUrl;
 
  ngOnInit(){
    console.log(this.imgURL)
  }
   
  onLogout(){
    this.authService.logout();
    this.router.navigate(['/login'])
  }
}



// @Output() sidebarToggle = new EventEmitter<void>();

  // toggleSidebar() {
  //   this.sidebarToggle.emit();
  // }