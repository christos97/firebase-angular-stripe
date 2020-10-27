import {stripe} from './api'
import {Stripe} from 'stripe'
import * as sgMail from "@sendgrid/mail";
import { STRIPE_WEBHOOK_SECRET, SG_API_KEY } from "./firebase";

const webHookHandlers: Map<String, Function> = new Map([

    [
        'payment_intent.succeeded',
        async (data: Stripe.PaymentIntent) => {
            console.log('PAYMENT_INTENT.succeeded', data)

        }
    ],
    [
        'payment_intent.failed',
        async (data: Stripe.PaymentIntent) => {
            console.log('PAYMENT_INTENT.failed', data)
        }
    ],
    [
        'payment_intent.created',
        async(data: Stripe.PaymentIntent) => {
            console.log("PAYMENT_INTENT.CREATED",data)


        }
    ],
    [
        'charge.succeeded',
        async(data: any) => {
            sgMail.setApiKey(SG_API_KEY)
            console.log("CHARGE.SUCCEEDED",data)


        }
    ],
    [
        'checkout.session',
        async(data: Stripe.PaymentIntent) => {
            console.log("CHECKOUT.SESSION",data)

        }
    ],
    [
        'setup_intent.created',
        async(data: any) => {
            console.log("SETUP_INTENT.CREATED",data)

        }
    ],
    [
        'customer.created',
        async(data: any) => {
            console.log("CUSTOMER.CREATED",data)

        }
    ],
])


export const handleStripeWebhook = async(req: any, res: any) => {
    console.log('WEBHOOK RUNNING');

    const sig: string = req.headers['stripe-signature'] || ''
    const rawBody: Buffer = req['rawBody'] || ''
    console.log('sig:',sig,'rawBody:',rawBody,'wh_sec:',STRIPE_WEBHOOK_SECRET);

    const {type, data}: Stripe.Event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET)
    try {
        const handler = webHookHandlers.get(type)

        if (handler !== undefined){
            await handler(data.object)
            res.status(200).send('Webhook endpoint activated')
        }else{
            res.status(404).send('Webhook hander is undefined')
        }
    } catch (error) {
        console.error(error)
        res.status(400).json({ 'Webhook Error' : error })
    }
}
