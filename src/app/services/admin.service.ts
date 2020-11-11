import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Course } from '../interfaces/course.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) { }

  public  getAllCourses(){
    return this.db.collection<Course>('courses', ref =>
      ref.orderBy('times_bought', 'desc')).valueChanges()
  }
}
