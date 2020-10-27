import Stripe from "stripe";
import { stripe } from "./api";
import { db } from "./firebase";
import { User } from "./user.model";

export async function getOrCreateCustomer(userId: string, source?: any) {

    console.log('userid?', userId)
    const userSnapshot = await db.doc(`users/${userId}`).get()
    const user = userSnapshot.data()
    console.log(user)
    // StripeCustomer ! exists
    if(!(user?.cus_id)){
        const customer = await stripe.customers.create({
            name: user?.displayName,
            email: user?.email,
            metadata: {
                firebaseUID: userId
            },

        })

        await userSnapshot.ref.update({ cus_id: customer.id})
        console.log('Customer created');

        return customer

    }else {
      console.log('Customer exists');

        return await stripe.customers.retrieve(user?.cus_id) as Stripe.Customer
    }
}

export async function createSetupIntent(user: User) {
    const customer = await getOrCreateCustomer(user.uid)


    return stripe.setupIntents.create({
        customer: customer.id,
        usage: 'on_session'
    })
}


export async function listPaymentMethods(user: User) {
    const { id } = await getOrCreateCustomer(user.uid)
    const { data } = await stripe.paymentMethods.list({
        customer: id,
        type: 'card',
    })
    return data
}
