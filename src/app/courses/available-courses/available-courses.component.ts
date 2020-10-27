import { Component, OnInit, Input } from '@angular/core';
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
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { PaymentService } from 'src/app/services/payment.service';
@Component({
  selector: 'app-available-courses',
  templateUrl: './available-courses.component.html',
  styleUrls: ['./available-courses.component.scss']
})
export class AvailableCoursesComponent implements OnInit {

  @Input() availableCourses: Course[]
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';


  constructor(
    private dialog: MatDialog,
    private courseService: CourseService,
    private afAuth: AngularFireAuth,
    private _snackBar: MatSnackBar,

    ) { }

 ngOnInit() {}


  async openDialog({ price, title, courseId, image_ref }){

    const { uid } = await this.afAuth.currentUser

    const dialogRef = this.dialog.open(PaymentComponent, {
      width: '450px',
      height: '400px',
      data: {
        "price": price,
        "title": title,
        "courseId": courseId,
        "image_ref": image_ref ?? ''
      }
    })

    dialogRef.componentInstance.onClose.subscribe( data =>{
      console.log(data)
      dialogRef.close()
      if (data){
        this.courseService.updateOwnedCourses(uid, data.courseId)
        this._snackBar.open(`Προστέθηκε στα μαθήματα μου: ${data.title}`, '',{
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          panelClass: ['snack-styling'],
        })
        }else {
          this._snackBar.open('Kάτι πήγε λάθος... Μην ανησυχείς, δεν χρεώθηκες τίποτα!', '',{
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            panelClass: ['snack-styling'],
          })
        }
    })
  }
}
