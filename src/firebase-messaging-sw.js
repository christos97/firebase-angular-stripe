importScripts('https://www.gstatic.com/firebasejs/7.21.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.21.0/firebase-messaging.js')
firebase.initializeApp(
  {
    apiKey: "AIzaSyAITFmPKJjapNOD9XSad9P220nnLSuDOwY",
    authDomain: "med-school-journey-c7425.firebaseapp.com",
    databaseURL: "https://med-school-journey-c7425.firebaseio.com",
    projectId: "med-school-journey-c7425",
    storageBucket: "med-school-journey-c7425.appspot.com",
    messagingSenderId: "73692469492",
    appId: "1:73692469492:web:5c25dfedc2caa4250466a1",
    measurementId: "G-6GH4C79M3L"
  }
)

const messaging = firebase.messaging()

messaging.onBackgroundMessage((msg) => {
  console.log(msg)
})
