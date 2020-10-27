import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from 'rxjs';
import { switchMap } from "rxjs/operators";
import { Course } from "../interfaces/course.interface";
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  getAllCourses(): Observable<Course[]> {
    return this.afAuth.authState.pipe(
      switchMap((user: firebase.User) => {
        return user ? this.db.collection<Course>('courses', ref =>
                          ref
                            .orderBy('title'))
                            .valueChanges()
                    : []
                  }))
  }

  updateOwnedCourses(userId: string, courseId: string){
    return this.db
      .collection<Course>('courses')
      .doc(courseId)
      .update({
        owned_by: firebase.firestore.FieldValue.arrayUnion(userId)
      })
  }
}