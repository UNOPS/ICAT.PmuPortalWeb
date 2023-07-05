import { invalid } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppControllerServiceProxy, ResetPassword, AuthControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { AuthenticationService } from '../login-layout/authentication.service';
import { LoginLayoutService } from '../login-layout/login-layout.service'
import { } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  // styleUrls: ['./set-password.component.scss']
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

  constructor(public loginLayoutService: LoginLayoutService,
    private appServiceProxy: AuthControllerServiceProxy,
    private router: Router,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private route: ActivatedRoute) {

    this.authenticationService.authenticate(false, true);
    let regEx = new RegExp("^(?=.*[a-z])(?=.*[A-Z])((?=.*[0-9])|(?=.*[!@#$%^&*]))(?=.{6,})");

    this.form1 = this.fb.group({
      // password: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern(regEx)]],
      confirmPassword: ['', Validators.required],
    });

    // this.form1 = this.fb.group({
    //   password: [
    //     null,
    //     [
    //       Validators.required,
    //       Validators.pattern(
    //         /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
    //       ),
    //       Validators.minLength(8),
    //     ],
    //   ],
    // })

  }


  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      const token = localStorage.getItem('access_token')!;

      const tokenPayload = decode<any>(token);

      console.log('testload---------', tokenPayload);

      //   this.restToken = tokenPayload;
      this.email = tokenPayload.usr;
      if (this.email) {
        this.showEmail = true
      }
      //   console.log("restToken", this.restToken);
    });


  }

  // showLogin() {
  //   this.showLoginForm = true;
  //   this.showForgotPassword = false;
  //   this.showSetPassword = false;
  //   this.loginLayoutService.toggleLoginForm(this.showLoginForm, this.showForgotPassword, this.showSetPassword); // call login layout service
  // }

  clickResetPassword() {
    console.log(" this.form1", this.form1.valid)
    if (this.form.valid && this.passwordConfirm == this.resetPasswordDto.password) {
      this.resetPasswordDto.token = "";
      this.resetPasswordDto.email = this.email;
      this.appServiceProxy.resetPassword(this.resetPasswordDto).subscribe(isSuccess => {
        if (isSuccess) {
          this.islSuccessPopup = true;
        } else {
          this.isErrorPopup = true;
        }
      },
        err => {
          this.isErrorPopup = true;
          console.log(err);

        });
    }
  }


  onPasswordChange(event: any) {
    console.log("++++++++++", event);
    let x = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.pattern('/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)[A-Za-z\d!$%@#£€*?&]{8,}$')
      ]]
    }
    )
    console.log("XXXXXXXXXXXXX", x.valid)
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
