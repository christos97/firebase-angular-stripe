import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from 'rxjs';
import { switchMap } from "rxjs/operators";
import { Course } from "../interfaces/course.interface";
import * as firebase from 'firebase/app'
import 'firebase/firestore'
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

  updateOwnedCourses(userId: string, course_id: string){
    return this.db
      .collection<Course>('courses')
      .doc(course_id)
      .update({
        owned_by: firebase.firestore.FieldValue.arrayUnion(userId),
        times_bought: firebase.firestore.FieldValue.increment(1)
      })
  }

async  updatePurchase(title: string, value: number){
  const { uid, email } = await this.afAuth.currentUser
  const data = {
    category: 'ebook',
    title,
    email,
    date: new Date(),
    value
  }
  const purchaseDoc= Math.random().toString(36).substr(2, 20);
  const purchaseDocRef = this.db.collection('purchases').doc(purchaseDoc)
  const userRef = this.db.collection('users').doc(uid)
  console.log(purchaseDoc)
try {
  await Promise.all([
    purchaseDocRef.set(data),
    userRef.update({ amount_spent: firebase.firestore.FieldValue.increment(value) })
  ])
} catch (error) {
  console.log(error)
}
}
}
