import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from '../Models/course';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone:false
})
export class CheckoutComponent implements OnInit {
 activeRoute:ActivatedRoute=inject(ActivatedRoute);
 router:Router=inject(Router);
  course;
 ngOnInit(){
  // this.activeRoute.data.subscribe((val)=>{
  //  this.course=val;
  // })
   this.course=history.state;
 }
}