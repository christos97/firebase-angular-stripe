import { Component, AfterViewInit, ViewChild, OnInit, Inject, EventEmitter } from '@angular/core';
import { PaymentService } from "../services/payment.service";
import * as stripe from '@stripe/stripe-js';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { analytics } from 'firebase/app';
import { Course } from '../interfaces/course.interface';
import { AuthService } from '../services/auth.service';
import { DocumentData } from '@angular/fire/firestore';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewInit {

  private stripe: stripe.Stripe;
  private paymentIntent: stripe.PaymentIntent
  private setupIntent: stripe.SetupIntent
  public onClose = new EventEmitter<any>()
  private userDoc: DocumentData
  size: object = {
    width: '200px', height: '200px', space: 4
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Course,
    private auth: AuthService,
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


    imageObject: Array<object> = [{
        image: `assets/images/${this.data.course_id}/${this.data.title}-1.png`,
        thumbImage: `assets/images/${this.data.course_id}/${this.data.title}-1-200x200.png`,
        alt: 'alt of image',
        title: 'title of image',

    }, {
        image: '.../iOe/xHHf4nf8AE75h3j1x64ZmZ//Z==', // Support base64 image
        thumbImage: '.../iOe/xHHf4nf8AE75h3j1x64ZmZ//Z==', // Support base64 image
        title: 'Image title', //Optional: You can use this key if want to show image with title
        alt: 'Image alt' //Optional: You can use this key if want to show image with alt
    }
];
    @ViewChild('card-payment') card : stripe.StripeCardElement
  async ngOnInit(){

    analytics().logEvent('select_item', {
      item_list_id: this.data.course_id,
      item_list_name: this.data.title,
      price: this.data.price

    })

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
    this.userDoc = await this.auth.getUserDoc()

    let body =
      {
        description: this.data.title,
        amount: this.data.price*100,
        customer: this.userDoc.cus_id,
        receipt_email : this.userDoc.email,
      }

    this.setupIntent = await this.pmt.createSetupIntent()
    this.paymentIntent = await this.pmt.createPaymentIntent(body)

    }

  @ViewChild('sections') photos : MatExpansionPanel
  @ViewChild('info') info : MatExpansionPanel
  @ViewChild('pay') pay : MatExpansionPanel
  ngAfterViewInit() {
    this.info.close()
    this.pay.close()
    this.photos.open()
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
                        receipt_email: this.userDoc.email ,
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
        await this.pmt.confirmSetupIntent(this.setupIntent.id, pi.payment_method)

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
