import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Course } from '../../interfaces/course.interface';
import { MatDialog } from '@angular/material/dialog';
import { PaymentComponent } from "../../payment/payment.component";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { CourseService } from 'src/app/services/course.service';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-available-courses',
  templateUrl: './available-courses.component.html',
  styleUrls: ['./available-courses.component.scss']
})
export class AvailableCoursesComponent implements OnInit , AfterViewInit {

  @Input() availableCourses: Course[]
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';


  constructor(
    private dialog: MatDialog,
    private courseService: CourseService,
    private afAuth: AngularFireAuth,
    private _snackBar: MatSnackBar,

    ) { }

 ngOnInit() {

 }

 ngAfterViewInit() {

 }

 somethingWentWrong() {
  this._snackBar.open('Kάτι πήγε λάθος... Μην ανησυχείς, δεν χρεώθηκες τίποτα!', '',{
    duration: 5000,
    horizontalPosition: this.horizontalPosition,
    verticalPosition: this.verticalPosition,
    panelClass: ['snack-styling'],
  })
 }

  async openDialog({ price, title, course_id, image_ref, bio }: Course){

    const { uid } = await this.afAuth.currentUser

    const dialogRef = this.dialog.open(PaymentComponent, {
      width: '450px',
      height: '600px',
      data: {
        "price": price,
        "title": title,
        "course_id": course_id,
        "image_ref": image_ref ?? '',
        "bio": bio ?? ''
      },
      autoFocus: false
    })
    dialogRef.componentInstance.onClose.subscribe(async data =>{
      dialogRef.close()
      if (data){
        console.log('component instanse callback',data)
        try {
          await this.courseService.updateOwnedCourses(uid, data.course_id)
          this._snackBar.open(`Προστέθηκε στα μαθήματα μου: ${data.title}`, '',{
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            panelClass: ['snack-styling'],
          })
          this.courseService.updatePurchase(title, price)
        } catch (error) {
            this.somethingWentWrong() }
      } else {
          this.somethingWentWrong() }
    })
  }
}
