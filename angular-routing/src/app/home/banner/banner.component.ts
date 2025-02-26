import { Component, inject, input } from '@angular/core';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-banner',
  standalone: false,
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {
 
  router:Router=inject(Router);

  onSearchClicked(val: string) {
    // console.log(val);
    this.router.navigate(['/Course'],{queryParams:{search:val}})

  }
}
