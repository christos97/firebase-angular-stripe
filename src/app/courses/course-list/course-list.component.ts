import { Component, OnInit, OnDestroy,HostListener, AfterViewInit, ViewChild  } from '@angular/core';
import { Course } from "../../interfaces/course.interface";
import { Subscription } from 'rxjs';
import { CourseService } from "../../services/course.service";
import { difference, includes } from "lodash";
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { AngularFireAuth } from '@angular/fire/auth';

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
export class CourseListComponent implements OnInit,AfterViewInit ,OnDestroy {


  constructor(public courseService: CourseService, private afAuth: AngularFireAuth ) { }

  courses: Course[]
  availableCourses: Course[]
  coursesSub: Subscription
  selectedIndex: number = 0;
  tabs: number = 2;
  async ngOnInit() {
    const { uid } = await this.afAuth.currentUser

    this.coursesSub = this.courseService.getAllCourses().subscribe(
      (allCourses: Course[]) => {
        this.courses = allCourses.filter((course: any) => includes(course.owned_by, uid))
        this.availableCourses = difference(allCourses, this.courses)
        console.log(this.courses, this.availableCourses)
      })
  }

  async ngAfterViewInit() {

  }



  public tab: string = 'owned'
  onTabClick(e: MatTabChangeEvent){
    this.tab = e.index ? 'available' : 'owned'
    console.log(this.tab);
  }

  ngOnDestroy(): void {
    this.coursesSub.unsubscribe()
  }

}
