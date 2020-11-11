import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Platform } from "@angular/cdk/platform";
import { AngularFirestore} from '@angular/fire/firestore'
import { AngularFireAuth } from "@angular/fire/auth";
import { take } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import * as firebase from "firebase/app";

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  messaging = firebase.messaging()
  currentMessage = new BehaviorSubject(null)

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, public platform: Platform) {
    this.messaging.onMessage(msg => this.currentMessage.next(msg))
  }

  private async updateToken(token) {

    this.afAuth.authState
    .pipe(take(1))
    .subscribe(user => {
      if(!user) return
      this.db.collection('users').doc(user.uid).update({ fcm: token })
    })
  }

  async getPermission(){
    const vapidKey = "BDZxr5Az8VK_1krDDiCrskeSC5T95rncOhPjthgDZqkz0LdYnM6xjWFeEyHro4u9GvsM4EoIpj7W_cZrqnQc73I"
    const permission =  await Notification.requestPermission()
    if (permission){
      try {
        let token = await this.messaging.getToken({ vapidKey })
        console.warn('Permission granted')
        this.updateToken(token)
      } catch (error) {
        console.warn('Permission denied')
      }
  }}
}
