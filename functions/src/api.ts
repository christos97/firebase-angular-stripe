import * as cors from 'cors'
import * as express from 'express'
import * as functions from "firebase-functions";
import Stripe from 'stripe'
import { STRIPE_SECRET, auth } from "./firebase";
import { createStripeCheckout } from "./checkout";
import { createPaymentIntent } from "./payments";
import { handleStripeWebhook } from "./webhooks";
import { createSetupIntent, listPaymentMethods } from './customers';
import { User } from "./user.model";
const app = express()
export const api = functions.https.onRequest(app)

export const stripe = new Stripe(STRIPE_SECRET, { apiVersion: '2020-08-27' })
app.use(cors({ origin: true }))
app.use(express.urlencoded({ extended: true }))

// Parse request body to raw for stripe webhook endpoint
app.use(express.json({
    verify: (req: any, res: any, buffer: any) =>
        req['rawBody'] = (req.path === 'hooks') ? buffer : undefined
}))


let user: User
async function decodeJWT(req: any, res: any ,next: express.NextFunction) {
    if (req.headers?.authorization?.startsWith('Bearer ')){
        const idToken = req.headers.authorization.split('Bearer ')[1]
        try {
            const decodedToken = await auth.verifyIdToken(idToken)
            req.headers['currentUser']= decodedToken
            user = req.headers['currentUser']


        } catch (error) {
            res.status(401).json({'Authorization Middleware': 401})
        }
    }
    next()
}
/*
function validateUser(req: any){
    const user = req['currentUser'];
    if (!user){
        throw new Error ('You must be logged in, Bearer Auth failed')
    }
    return user;
}
*/
app.use(decodeJWT)

// HealthCheck
app.get('/', async (req, res) => {
    res.status(200).json({ response: 'OK'})})

function runAsync (callback: Function) {
    return (req: express.Request, res: express.Response ,next?: express.NextFunction) => {
        callback(req, res, next).catch(next)
    }
}

// Returns Stripe.Checkout.Session
app.post('/checkouts',
    runAsync( async({ body }: express.Request, res: express.Response) => {
        res.send(
            await createStripeCheckout(body)
        )
    })
)

// Creates and returns Stripe.PaymentIntent
app.post('/payments',
    runAsync( async( {body} : express.Request, res: express.Response) => {
        res.send(
            await createPaymentIntent(body.amount, body.description, body.customer, body.receipt_email)
        )
    })
)

app.post('/wallet',
    runAsync( async (req: any, res: express.Response) => {
        res.send(
            await createSetupIntent(user)
        )
    })
)


app.get('/wallet',
    runAsync( async (req: express.Request, res: express.Response) => {
        res.send(
            await listPaymentMethods(user)
        )
    })
)


app.post('/hooks', express.raw({type: 'application/json'}),
        runAsync( handleStripeWebhook )
)
