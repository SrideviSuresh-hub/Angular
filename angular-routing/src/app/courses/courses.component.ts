import { Component, inject, OnInit } from '@angular/core';
import { CourseService } from '../Services/course.service';
import { Course } from '../Models/course';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-courses',
  standalone: false,
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit{
  coursesService = inject(CourseService);
  // AllCourses: Course[] = this.coursesService.courses;
  AllCourses: Course[];
  searchString:string;
  activeRoute:ActivatedRoute=inject(ActivatedRoute);
  ngOnInit(){
    // this.searchString=this.activeRoute.snapshot.queryParams['search'];
    // this.searchString=this.activeRoute.snapshot.queryParamMap.get('search');
    // this.activeRoute.queryParams.subscribe((val)=>{
    //   this.searchString=val['search'];
    this.activeRoute.queryParamMap.subscribe((data)=>{
      this.searchString=data.get('search');
   
    // console.log(this.searchString);
    if(this.searchString=== undefined || this.searchString==='' || this.searchString===null){
      this.AllCourses=this.coursesService.courses;
    }
    else{
      this.AllCourses=this.coursesService.courses
      .filter((val)=>val.title.toLowerCase()
      .includes(this.searchString.toLowerCase()));
    }
  })
  }
}
