import { Component, AfterViewInit, ViewChild, OnInit, Inject, EventEmitter } from '@angular/core';
import { PaymentService } from "../services/payment.service";
import * as stripe from '@stripe/stripe-js';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { analytics } from 'firebase/app';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewInit {

  private stripe: stripe.Stripe;
  private paymentIntent: stripe.PaymentIntent
  public onClose = new EventEmitter<any>()
  user: firebase.User


  @ViewChild('card-payment') card : stripe.StripeCardElement

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private afAuth: AngularFireAuth,
    private pmt: PaymentService,
    ){}

    btnOpts: MatProgressButtonOptions = {
      active: false,
      text: `Απόκτησε το για ${this.data.price}€`,
      buttonColor: 'primary',
      barColor: 'primary',
      raised: false,
      stroked: true,
      flat: false,
      mode: 'indeterminate',
      value: 0,
      disabled: true,
      customClass: 'pay-btn',
      buttonIcon: {
        fontSet: 'fa',
        fontIcon: 'fa-credit-card',
        inline: true
      }
    };


  async ngOnInit(){

    await this.pmt.setupRequest()
    this.user = await this.afAuth.currentUser
    this.stripe = await stripe.loadStripe(environment.STRIPE_KEY)
    const style = {
      base: {
        color: '#32325d',
        fontFamily: '"Nunito", Nunito, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: (window.innerWidth <= 500) ? '12px' : '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    const elements = this.stripe.elements()
    const card: stripe.StripeCardElement = elements.create('card', {
      hidePostalCode: true,
      style: style
    })
    this.card = card

    const userDoc = (await this.pmt.getStripeCustomer(this.user?.uid))?.data()

    let body =
      {
        description: this.data.title,
        amount: this.data.price*100,
        customer: userDoc.cus_id,
        receipt_email : this.user.email
      }


    //Create Payment Intent
    this.paymentIntent = await this.pmt.createPaymentIntent(body)
    }

  ngAfterViewInit() {
    setTimeout(() => {
      this.card.mount('#card-payment')
      this.card.focus()
      this.card.on('change', e => this.btnOpts.disabled = e.complete ? false : true)
    })
  }

  public done: boolean

  async handlePayment(e: Event) {
    e.preventDefault()
    this.btnOpts.active = true;

    try {
      const { paymentIntent: pi, error } =
          await this.stripe
                    .confirmCardPayment(
                      this.paymentIntent.client_secret,
                      {
                        payment_method: { card: this.card },
                        receipt_email: this.user.email ,
                        //setup_future_usage: 'on_session'
                        // mallon gia subscriptions se saved cards?
                      })

      if (error){
        console.error(error)
        this.onClose.emit(null)
        }
      else {
        this.btnOpts.active = false;
        this.done = true
        setTimeout(() => this.onClose.emit(this.data), 1200)
        analytics().logEvent('add_payment_info')
      }
    } catch (e){
      console.error(e)
      this.onClose.emit(null)
    }

  }

}
