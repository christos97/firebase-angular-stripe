import { Component, OnInit, OnDestroy,} from '@angular/core';
import { Course } from "../../interfaces/course.interface";
import { Subscription } from 'rxjs';
import { CourseService } from "../../services/course.service";
import { difference, includes } from "lodash";
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AngularFireAuth } from '@angular/fire/auth';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  animations: [
    trigger('switchTab', [
      state('owned',
      style({
        width: '100%',
        height: '100%',

      })),
      state('available', style({
        width: '100%',
        height: '100%'
      })),
      transition('owned<=>available',[
          animate('2000ms ease-in-out',
            keyframes([
              style({ opacity: 0 }),
              style({ opacity: 0.5 }),
              style({ opacity: 1 })
            ]))
        ]),
    ]),

  ]
})
export class CourseListComponent implements OnInit,OnDestroy {


  constructor(
    public courseService: CourseService,
    private afAuth: AngularFireAuth,
    private paymentService: PaymentService
    ) { }

  public courses: Course[]
  public availableCourses: Course[]
  coursesSub: Subscription
  selectedIndex: number = 0;
  tabs: number = 2;
  async ngOnInit() {
    const { uid } = await this.afAuth.currentUser

    this.coursesSub = this.courseService.getAllCourses().subscribe(
      (allCourses: Course[]) => {
        this.courses = allCourses.filter((course: any) => includes(course.owned_by, uid))
        this.availableCourses = difference(allCourses, this.courses)
        })

  }


  public tab: string = 'owned'
  onTabClick(e: MatTabChangeEvent){
    this.tab = e.index ? 'available' : 'owned'
  }

  ngOnDestroy(): void {
   // this.coursesSub.unsubscribe()
  }

}
