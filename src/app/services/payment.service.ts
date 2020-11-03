import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';

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
  private _headers: HttpHeaders
  private user: firebase.User
  constructor(private afAuth: AngularFireAuth, private http: HttpClient) {}


  async setupRequest() {
    [this.user, this.stripe] = await Promise.all(
      [this.afAuth.currentUser, stripe.loadStripe(environment.STRIPE_KEY)])

    const token = this.user && (await this.user.getIdToken())
    this._headers = new HttpHeaders({
      'Content-Type':'application/json',
      Authorization: `Bearer ${token}`,
    })
  }

  async confirmSetupIntent(si: string, pm: string) {
    await this.setupRequest()

    console.log('service:',si,pm)
    return await
    this.http
        .post(`${this.api}/wallet/confirm`, {
          si_id: si,
          payment_method: pm
        } ,{ headers: this._headers })
        .toPromise() as stripe.SetupIntent
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
