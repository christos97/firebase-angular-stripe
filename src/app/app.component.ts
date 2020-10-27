import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase";
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
        firebase.firestore().enablePersistence(),
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      ])
      console.log('Persistence enabled')
    } catch (error) {
      console.error('Persistense Failed')
    }

  }

}
