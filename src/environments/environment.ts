// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase : {
    apiKey: "AIzaSyAITFmPKJjapNOD9XSad9P220nnLSuDOwY",
    authDomain: "med-school-journey-c7425.firebaseapp.com",
    databaseURL: "https://med-school-journey-c7425.firebaseio.com",
    projectId: "med-school-journey-c7425",
    storageBucket: "med-school-journey-c7425.appspot.com",
    messagingSenderId: "73692469492",
    appId: "1:73692469492:web:5c25dfedc2caa4250466a1",
    measurementId: "G-6GH4C79M3L"
  },
  STRIPE_KEY : "pk_test_51Hf3sqJuSjlTtqXXFAqrVrV757DHDDQ7SMElMwkx3TNondi2PAaThHJCLs4LTU587AtGbtabyxOKACI6AjIQdKVd00ppuE1L5e",
  API: "http://localhost:5001/med-school-journey-c7425/us-central1/api"

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
