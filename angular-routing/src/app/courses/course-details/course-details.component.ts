import { Component, inject, OnInit } from '@angular/core';
import { Course } from '../../Models/course';
import { CourseService } from '../../Services/course.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-details',
  standalone: false,
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent implements OnInit{
  selectedCourse:Course;
  courseId:number;

  courseService:CourseService=inject(CourseService);
  activeRoute:ActivatedRoute=inject(ActivatedRoute);
  ngOnInit(){
        // this.courseId=this.activeRoute.snapshot.params['id'];
        this.courseId=+this.activeRoute.snapshot.paramMap.get('id');
       console.log( this.courseId);
    this.selectedCourse=this.courseService.courses.find((cur)=>{
        return cur.id===this.courseId
      })
   console.log(this.selectedCourse)
  }
}
