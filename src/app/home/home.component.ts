import { Component, OnInit } from '@angular/core';
import { SeoService } from "../services/seo.service";
import { MessagingService } from "../services/messaging.service";
import { Platform } from '@angular/cdk/platform';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private seo: SeoService, private msgService: MessagingService, public platform: Platform) { }

  ngOnInit(): void {
    this.seo.generateTags()
    const isApple = this.platform.SAFARI || this.platform.IOS
    if (!isApple){
      this.msgService.getPermission()
      this.msgService.currentMessage.subscribe((msg: any) => {
        console.log('Home component received:', msg)
      })
  }}

}
