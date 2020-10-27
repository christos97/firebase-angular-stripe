import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailableCoursesComponent } from './available-courses/available-courses.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { CourseListComponent } from './course-list/course-list.component';
import { SharedModule } from '../shared/shared.module';
import { PaymentComponent } from '../payment/payment.component';
import { CoursesRoutingModule } from "../courses/courses-routing.module";


@NgModule({
  declarations: [AvailableCoursesComponent, MyCoursesComponent, CourseListComponent, PaymentComponent],
  imports: [
    CommonModule,
    SharedModule,
    CoursesRoutingModule
  ]
})
export class CoursesModule { }
