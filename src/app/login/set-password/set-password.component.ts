import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPassword, AuthControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { AuthenticationService } from '../login-layout/authentication.service';
import { LoginLayoutService } from '../login-layout/login-layout.service'
import { } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
})
export class SetPasswordComponent implements OnInit {

  @ViewChild('fSetPassword') form: NgForm;
  showLoginForm = false;
  showForgotPassword = false;
  showSetPassword = true;
  restToken: string;
  email: string = "";
  resetPasswordDto = new ResetPassword;
  islSuccessPopup: boolean;
  isErrorPopup: boolean;
  setPasswordForm: FormGroup;
  isPasswordType: boolean = true;
  isConfirmPasswordType?: boolean = true;
  passwordConfirm: string = "";
  showEmail: boolean = false;
  public isSubmitted: boolean = false;
  form1: any;
  token: string = ''; 

  constructor(public loginLayoutService: LoginLayoutService,
    private appServiceProxy: AuthControllerServiceProxy,
    private router: Router,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private route: ActivatedRoute) {

    this.authenticationService.authenticate(false, true);
    let regEx = new RegExp("^(?=.*[a-z])(?=.*[A-Z])((?=.*[0-9])|(?=.*[!@#$%^&*]))(?=.{6,})");

    this.form1 = this.fb.group({
      password: ['', [Validators.required, Validators.pattern(regEx)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.token = params['token'];
      if (this.token) {
        this.showEmail = true;
      }
    });
  }

  clickResetPassword() {
    if (this.form.valid && this.passwordConfirm == this.resetPasswordDto.password) {
      this.resetPasswordDto.token = this.restToken;
      this.resetPasswordDto.email = this.email;
      this.appServiceProxy.resetPassword(this.resetPasswordDto).subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.islSuccessPopup = true;
        } else {
          this.isErrorPopup = true;
        }
      },
      (err: any) => {
        this.isErrorPopup = true;
      });
    }
  }
  

  onPasswordChange(event: any) {
    let x = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.pattern('/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)[A-Za-z\d!$%@#£€*?&]{8,}$')
      ]]
    }
    )
  }

  get password() {
    return this.setPasswordForm.get('password');
  }

  get confirmPassword() {
    return this.setPasswordForm.get('confirmPassword');
  }

  gotoLogin() {
    this.router.navigate(['/login']);
  }

  togglePasswordText() {
    this.isPasswordType = !this.isPasswordType;
  }

  toggleConfirmPasswordText() {
    this.isConfirmPasswordType = !this.isConfirmPasswordType;
  }

  toLanding() {
    this.router.navigate(['/landing-page'])
  }
}
