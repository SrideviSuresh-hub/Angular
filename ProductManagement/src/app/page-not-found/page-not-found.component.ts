import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-page-not-found',
  standalone: false,
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {
router:Router=inject(Router);
authService:AuthService=inject(AuthService);

ngOnInit(){
  if(Boolean(localStorage.getItem('isLoggedIn'))){
    this.router.navigate([localStorage.getItem('curPath')])
  }
}
}
