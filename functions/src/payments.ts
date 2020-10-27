import Stripe from 'stripe'
import {stripe} from './api'

export async function createPaymentIntent(amount: number ,description: string, customer: string, receipt_email:string) {
    const pi: Stripe.PaymentIntent = await stripe.paymentIntents.create({
        amount,
        description,
        currency: 'eur',
        customer,
        receipt_email
    })

    return pi
}
