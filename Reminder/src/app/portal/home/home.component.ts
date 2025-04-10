import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  router:Router=inject(Router);
 navigate(){
  console.log("dfghjkl");
  
    this.router.navigate(['/portal/users']);
 }
}
