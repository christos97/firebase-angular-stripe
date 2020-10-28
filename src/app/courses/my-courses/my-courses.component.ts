import { Component, OnInit, Input, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { Course } from '../../interfaces/course.interface';
import { AngularFireStorage ,AngularFireStorageReference } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatCard } from '@angular/material/card';



@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss'],

})
export class MyCoursesComponent implements OnInit, AfterViewInit {

  @Input () courses: Course[]
  @ViewChild(MatCard) card: MatCard

  @HostListener('window:scroll', ['$event']) onScrollEvent($event){
    console.log($event);
    console.log("scrolling");
  }

  constructor(private afStorage: AngularFireStorage, private db: AngularFirestore) { }



  ngOnInit(): void {
  }

  ngAfterViewInit (){

  }

  async viewFile(ref: string) {

    /*const afStorageRef = this.afStorage.storage.refFromURL(ref)
    const url = await afStorageRef.getDownloadURL()
    */

    window.open(ref)
  }

  animationState: string;

  startAnimation(state) {
    if (!this.animationState) {
      this.animationState = state;
    }
  }

  resetAnimationState() {
    this.animationState = '';
  }



}
