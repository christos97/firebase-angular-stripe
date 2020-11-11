import { Component } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import "firebase/app";
import "firebase/firestore"
import "firebase/auth"
import "firebase/functions"
import "firebase/storage"
import "firebase/messaging"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'med-school-journey';
  constructor(public platform: Platform)
  {
      if (!this.platform.isBrowser && 'serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs: any) =>{
          for (let reg of regs) reg.unregister()
        })
      }
      console.log(this.platform)
  }


}
