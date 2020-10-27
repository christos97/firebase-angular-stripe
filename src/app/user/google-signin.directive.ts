import { Directive, HostListener } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Directive({
  selector: '[appGoogleSignin]'
})
export class GoogleSigninDirective {

  constructor(private authService: AuthService,private router: Router) { }

  @HostListener('click')
  do(){
    this.authService.googleSignin()
  }
}
