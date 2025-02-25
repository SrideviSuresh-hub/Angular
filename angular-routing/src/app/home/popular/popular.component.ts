import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-popular',
  standalone: false,
  templateUrl: './popular.component.html',
  styleUrl: './popular.component.css'
})
export class PopularComponent {

  router:Router=inject(Router);
  activeRoute:ActivatedRoute=inject(ActivatedRoute);
  navigateToCourses(){
    this.router.navigate(['Course']);
    // this.router.navigate(['Course'],{relativeTo:this.activeRoute});
    // this.router.navigateByUrl('Course');
  }
}
