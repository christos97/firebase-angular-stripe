import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase/app";
import "firebase/firestore"
import "firebase/auth"
import "firebase/analytics"
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'med-school-journey';

  async ngOnInit() {
    try {
      await Promise.all([
        firebase.firestore().enablePersistence(),// set {synchronizeTabs:true} for resource sharing across tabs
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL),
      ])
      firebase.analytics()
      console.warn('Persistence enabled')
    } catch (error) {
      console.error('Persistense Failed')
    }

  }

}
