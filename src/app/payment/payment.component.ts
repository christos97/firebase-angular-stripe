import { Component, AfterViewInit, ViewChild, OnInit, Inject, EventEmitter } from '@angular/core';
import { PaymentService } from "../services/payment.service";
import * as stripe from '@stripe/stripe-js';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { analytics } from 'firebase/app';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Course } from '../interfaces/course.interface';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewInit {

  private stripe: stripe.Stripe;
  private paymentIntent: stripe.PaymentIntent
  private setupIntent: stripe.SetupIntent
  private invoice: any
  public onClose = new EventEmitter<any>()
  user: firebase.User


  @ViewChild('card-payment') card : stripe.StripeCardElement

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Course,
    private afAuth: AngularFireAuth,
    private pmt: PaymentService,
    private functions: AngularFireFunctions
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
    analytics().logEvent('select_item', {
      item_list_id: this.data.course_id,
      item_list_name: this.data.title,
      price: this.data.price

    })

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
        receipt_email : this.user.email,
      }

  let invoiceItem = {
    customer: userDoc.cus_id,
    price: this.data.prod_id
  }

    this.setupIntent = await this.pmt.createSetupIntent()
    console.log('SETUP INTENT:',this.setupIntent);


    //this.invoice = await this.pmt.createInvoice(invoiceItem)
    //console.log(this.invoice)
    //Create Payment Intent
    this.paymentIntent = await this.pmt.createPaymentIntent(body)

    console.log('PAYMENT INTENT:',this.paymentIntent);
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
                        setup_future_usage: 'on_session'
                        // mallon gia subscriptions se saved cards?
                      })

      if (error){
        console.error(error)
        this.onClose.emit(null)
        }
      else {
        console.log(pi)
        this.btnOpts.active = false;
        this.done = true
        setTimeout(() => this.onClose.emit(this.data), 1200)
        console.log(pi.payment_method)
        const confirmed = await this.pmt.confirmSetupIntent(this.setupIntent.id, pi.payment_method)
        console.log(confirmed);
        //const response = await this.pmt.payInvoice(this.invoice.id)
        //console.log('Invoice paid res', response)
        if (!environment.production){
          console.log('firing purchase event');
          let item: firebase.analytics.Item =
          {
            item_id: this.data.course_id,
            item_name: this.data.title,
            price: this.data.price,
            item_category: 'e-book',
            quantity: 1,
          }
          analytics().logEvent('purchase', {
            transaction_id: this.data.title,
            currency: 'EUR',
            value: this.data.price,
            date: new Date()
          })
        }
      }
    } catch (e){
      console.error(e)
      this.onClose.emit(null)
    }

  }

}
