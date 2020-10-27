import Stripe from 'stripe';
//import Stripe from 'stripe'
import {stripe} from './api'
import { WEBAPP_URL } from "./firebase";

export async function createStripeCheckout(body: any) {

    const url = WEBAPP_URL 
    const {customer_email, line_items} = body
    const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        success_url: `${url}`,
        cancel_url: `${url}`,
        
        customer_email

    })
    console.log(session)
    return session
}
