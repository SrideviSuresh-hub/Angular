import { Component, inject } from '@angular/core';
import { CourseService } from '../Services/course.service';
import { Course } from '../Models/course';

@Component({
  selector: 'app-courses',
  standalone: false,
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
  coursesService = inject(CourseService);
  AllCourses: Course[] = this.coursesService.courses;
}
