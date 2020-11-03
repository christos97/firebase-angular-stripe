import { Component, OnInit, Input} from '@angular/core';
import { Course } from '../../interfaces/course.interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';



@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss'],

})
export class MyCoursesComponent implements OnInit {

  @Input() courses: Course[]

  constructor(private afStorage: AngularFireStorage, private db: AngularFirestore) { }

  ngOnInit(): void {
    console.log(this.courses)
  }

  viewFile = async (gsUrl: string) =>
    window.open(await (this.afStorage.storage.refFromURL(gsUrl)).getDownloadURL())

}
