import { Directive, HostListener } from '@angular/core';
import { AuthService } from "../services/auth.service";

@Directive({
  selector: '[appGoogleSignin]'
})
export class GoogleSigninDirective {

  constructor(private authService: AuthService) { }

  @HostListener('click')
  do(){
    this.authService.googleSignin()
  }
}
