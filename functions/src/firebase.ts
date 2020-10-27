import * as admin from 'firebase-admin'
import * as functions from "firebase-functions";
import * as dotenv from 'dotenv'

let STRIPE_SECRET: string
let SG_API_KEY: string
let WELCOME_EMAIL: string
let WEBAPP_URL: string
let STRIPE_WEBHOOK_SECRET: string
//let API: string
dotenv.config()
const cf = functions.config()
console.log(cf)
const __ENV = process.env
if (__ENV.NODE_ENV !== 'production'){
    console.log('DEV CONFIG')
    STRIPE_SECRET = __ENV.STRIPE_SECRET_DEV || ''
    SG_API_KEY = __ENV.SG_API_KEY || ''
    WELCOME_EMAIL = __ENV.WELCOME_EMAIL || ''
    WEBAPP_URL = __ENV.WEBAPP_URL_DEV || ''
    STRIPE_WEBHOOK_SECRET = __ENV.STRIPE_WEBHOOK_SECRET_DEV || ''

}
else {
    console.log('PROD CONFIG')
    STRIPE_SECRET = cf.stripe.sk_test
    SG_API_KEY = cf.sendgrid.key
    WELCOME_EMAIL = cf.sendgrid.template
    WEBAPP_URL = cf.app.url
    STRIPE_WEBHOOK_SECRET = cf.stripe.wh_secret
}

export {
    STRIPE_SECRET,
    SG_API_KEY,
    WELCOME_EMAIL,
    WEBAPP_URL,
    STRIPE_WEBHOOK_SECRET
}
export const db = admin.firestore()
export const auth = admin.auth()
