import * as functions from "firebase-functions";

export const purchaseCompleted = functions.analytics.event('add_payment_info').onLog((e:any) => {
  console.log(e)
})

export const googleLogin = functions.analytics.event('login').onLog((e:any)=> {
  console.log(e)
})
