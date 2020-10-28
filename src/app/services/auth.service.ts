import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface'
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import * as firebase from 'firebase/app';
import 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user)
          return this.db.doc<User>(`/users/${user.uid}`).valueChanges()
        else
          return of(null)
      })
    )
  }

  async googleSignin() {
    const credential = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    return this.updateUserData(credential.user)
  }


  async signOut() {
    await this.afAuth.signOut()
    this.router.navigate(['/login'])

  }

  private updateUserData({ uid, email, displayName, photoURL}: User) {
    const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${uid}`)
    const userData = { uid, email, displayName, photoURL }
    this.router.navigate(['/courses'])
    return userRef.set(userData, { merge: true })
  }
}
