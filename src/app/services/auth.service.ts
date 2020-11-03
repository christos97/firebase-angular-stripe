import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface'
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { map, switchMap, take } from "rxjs/operators";
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
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
    if (environment.production){
      firebase.analytics().logEvent('login',{method: credential.credential.signInMethod})
    }
    return this.updateUserData(credential.user)
  }

  async getUserDoc(){
    const { uid } = await this.afAuth.currentUser
    const ref  = await this.db.collection('users').doc<User>(uid).get().toPromise()
    return ref?.data()
  }


  async signOut() {
    await this.afAuth.signOut()
    this.router.navigate(['/login'])
    window.location.reload()
  }

   isAdmin(){
    return this.afAuth.idTokenResult
                .pipe(
                  take(1),
                  map(decoded =>
                    decoded?.claims?.role === 'admin' ? true : false ))

  }

  private updateUserData({ uid, email, displayName, photoURL}: User) {
    const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${uid}`)
    const userData = { uid, email, displayName, photoURL }
    this.router.navigate(['/courses'])
    return userRef.set(userData, { merge: true })
  }
}
