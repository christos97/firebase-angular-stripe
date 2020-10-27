import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { Observable, of } from "rxjs";
import { map, catchError } from 'rxjs/operators';

import { ajax } from "rxjs/ajax";
import { User } from '../interfaces/user.interface';
import { AngularFireAuth } from '@angular/fire/auth';
import * as stripe from '@stripe/stripe-js';

import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private api: string = environment.API || ''
  private stripe: stripe.Stripe;
  private paymentIntent: stripe.PaymentIntent
  private setupIntent: stripe.SetupIntent
  private _headers: HttpHeaders
  private user: firebase.User
  private userDoc: DocumentData
  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private http: HttpClient,

    ) {
     }

  getStripeCustomer(userId: string) {
    return this.db.collection('users').doc<User>(userId).get().toPromise()
  }

  async setupRequest() {
    [this.user, this.stripe] = await Promise.all([
      this.afAuth.currentUser,
      stripe.loadStripe(environment.STRIPE_KEY)
    ])

    this.userDoc = (await  this.db.collection('users').doc<User>(this.user.uid).get().toPromise())?.data()

    const token = this.user && (await this.user.getIdToken())
    this._headers = new HttpHeaders({
      'Content-Type':'application/json',
      Authorization: `Bearer ${token}`,
    })
  }



  async createSetupIntent() {
    await this.setupRequest()

    return await
            this.http
                .post(`${this.api}/wallet`, {} ,{ headers: this._headers })
                .toPromise() as stripe.SetupIntent


  }

  async createPaymentIntent(body){
    await this.setupRequest()
    return await this.http
            .post(`${this.api}/payments`,
              JSON.stringify(body),
              { headers: this._headers })
            .toPromise() as stripe.PaymentIntent
  }
}
