import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  ngOnInit() {
    this.activeRoute.fragment.subscribe((data)=>{
      // console.log(data);
      this.jumpToSection(data);

    })
  }
  jumpToSection(section){
    document.getElementById(section).scrollIntoView({behavior:'smooth'})
  }
}
