import { NgModule } from "@angular/core";

import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { CoursesComponent } from './courses/courses.component';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { CourseDetailsComponent } from './courses/course-details/course-details.component';
import { LoginComponent } from "./login/login.component";
import { PopularComponent } from "./home/popular/popular.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { AuthGuardService } from "./Services/authguard.service";
import { canActivate, canActivateChild, resolve } from "./auth.guard";

//define routes
const routes: Routes = [
  { path: '', component: HomeComponent },
  // {path:'',redirectTo:'Home',pathMatch:'full'},
  { path: 'Home', component: HomeComponent },
  { path: 'About', component: AboutComponent },
  { path: 'Contact', component: ContactComponent, canDeactivate: [(comp: ContactComponent) => { comp.canExit() }] },
  { path: 'Course', component: CoursesComponent, resolve: { courses: resolve } },
  // {path:'Course/courseDetail/:id',component:CourseDetailsComponent},
  {
    path: 'Course', canActivateChild: [canActivateChild], children:
      [{ path: 'courseDetail/:id', component: CourseDetailsComponent },
      { path: 'popular', component: PopularComponent },
      { path: 'Checkout', component: CheckoutComponent, data:{title:'testCourse', price:399} }
      ]
  },
  // {path:'Course',component:CoursesComponent,resolve:{courses:AuthGuardService}},
  // {path:'Contact',component:ContactComponent,canDeactivate:[AuthGuardService]},
  // {path:'Course', canActivateChild:[AuthGuardService] ,children:
  // {path:'Checkout',component:CheckoutComponent,canActivate:[canActivate]}  
  // {path:'Checkout',component:CheckoutComponent,canActivate:[AuthGuardService]}

  { path: 'Login', component: LoginComponent },
  { path: '**', component: NotFoundComponent }
]
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: true })
  ],
  exports: [RouterModule]
})
export class RoutingModule {


}