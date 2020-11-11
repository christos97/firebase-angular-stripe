import * as functions from 'firebase-functions'
import * as express from 'express'
import axios from 'axios'
const prerender = require('prerender-node');

const app = express();
app.use(prerender.set('prerenderToken', 'dnaMyzHWxfP2fkAIeNjp'));
console.log(prerender)
app.get('*', (req:any, res:any) => {
    return axios.get('https://medschool-journey.web.app/')
        .then((response: any) => {
          const text = (response.data).toString()
          console.log(text, req.path)
          res.status(200).send(text)
        })
})

export const pre = functions.https.onRequest(app)
