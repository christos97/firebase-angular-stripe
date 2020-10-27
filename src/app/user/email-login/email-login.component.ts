import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularFireAuth } from "@angular/fire/auth";
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss'],
  animations: [
    trigger('switchForm', [
      state('login',
      style({
        width: '100%',
        height: '100%',

      })),
      state('signup', style({
        width: '100%',
        height: '100%',
      })),
      transition('login<=>signup',[
          animate('750ms ease-in-out',
            keyframes([
              style({ opacity: 0 }),
              style({ opacity: 0.5 }),
              style({ opacity: 1 })
            ]))
        ]),
    ]),
  ]
})
export class EmailLoginComponent implements OnInit {

  form: FormGroup
  type: 'login' | 'signup' | 'reset' = 'login'
  public loading: boolean
  serverMessage: string = ''
  public hide: boolean = true
  constructor(private afAuth: AngularFireAuth, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.email, Validators.required] ],
      password: ['', [Validators.minLength(6), Validators.required]],
      passwordConfirm: ['', []]
    })
  }

  changeType(val: any) {
    this.type = val
  }

  // Getters

  get isLogin() {
    return this.type === 'login'
  }

  get isSignup() {
    return this.type === 'signup'
  }

  get isPasswordReset() {
    return this.type === 'reset'
  }

  get email(){
    return this.form.get('email')
  }

  get password() {
    return this.form.get('password')
  }

  get passwordConfirm() {
    return this.form.get('passwordConfirm')
  }

  get passwordDoesMatch() {
    if (this.type !== 'signup')
      return true
    else
      return this.password.value === this.passwordConfirm.value
  }

  async onSubmit() {
    this.loading = true

    const email = this.email.value
    const password = this.password.value

    try {
      if (this.isLogin)
        await this.afAuth.signInWithEmailAndPassword(email, password)

      if (this.isSignup)
        await this.afAuth.createUserWithEmailAndPassword(email, password)

      if (this.isPasswordReset){
        await this.afAuth.sendPasswordResetEmail(email)
        this.serverMessage = 'Check your email'
      }
    }
      catch (err) {
        this.serverMessage = err.toString()
    }

    this.loading = false
  }
}
