import { NgModule } from "@angular/core";

import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { CoursesComponent } from './courses/courses.component';
import {  RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { CourseDetailsComponent } from './courses/course-details/course-details.component';

//define routes
const routes:Routes=[
  {path:'',component:HomeComponent},
  // {path:'',redirectTo:'Home',pathMatch:'full'},
  {path:'Home',component:HomeComponent},
  {path:'About',component:AboutComponent},
  {path:'Contact',component:ContactComponent},
  {path:'Course',component:CoursesComponent},
  // {path:'Course/courseDetail/:id',component:CourseDetailsComponent},
  {path:'Course',children:[{path:'courseDetail/:id',component:CourseDetailsComponent}]},
    // {path:'popular', component:PopularComponent}
  {path:'**',component:NotFoundComponent}
]
@NgModule({
 imports:[
    RouterModule.forRoot(routes)
 ],
 exports:[RouterModule]  
})
export class RoutingModule{

    
}