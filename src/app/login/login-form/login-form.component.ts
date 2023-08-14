import { Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RoleGuardService } from 'app/auth/role-guard.service';
import { AppService } from 'shared/AppService';
import {
  AuthControllerServiceProxy,
  UsersControllerServiceProxy,
} from 'shared/service-proxies/service-proxies';
import { SharedDataService } from 'shared/shared-data-services';
import { AuthenticationService } from '../../login/login-layout/authentication.service';
import { LoginLayoutService } from '../login-layout/login-layout.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  @ViewChild('fLogin') fLogin: NgForm;

  showLoginForm = true;
  showForgotPassword = false;
  showSetPassword = false;
  display: boolean = false;

  isLoggedIn = false;
  hideSideBar = true;

  isSubmitLogin: boolean;
  isInvalidCredential: boolean;
  userRoles: any[] = [];
  userRole: any = { name: 'Guest', role: '-1' };

  constructor(
    public logiLayoutService: LoginLayoutService,
    private _loginApiService: UsersControllerServiceProxy,
    private appControllServiceProxy: AuthControllerServiceProxy,
    private router: Router,
    private authenticationService: AuthenticationService,
    private WMServiceService: AppService,
    private roleGuardService: RoleGuardService,
    private sharedDataService: SharedDataService,
  ) {}

  ngOnInit(): void {
    this.authenticationService.authenticate(false, true);
  }

  showPasswordResetForm() {
    this.showLoginForm = false;
    this.showForgotPassword = true;
    this.showSetPassword = false;
    this.logiLayoutService.toggleLoginForm(
      this.showLoginForm,
      this.showForgotPassword,
      this.showSetPassword,
    );
  }

  resetError() {
    this.isInvalidCredential = false;
  }

  login() {
    this.isSubmitLogin = true;
    if (!this.fLogin.valid) {
      return;
    }
    this.appControllServiceProxy
      .login(this.logiLayoutService.authCredentialDot)
      .subscribe(
        (token) => {
          if (token && token.access_token) {
            this.isInvalidCredential = false;

            this.isLoggedIn = true;
            this.hideSideBar = false;
            this.WMServiceService.steToken(token.access_token);
            console.log(token)
            localStorage.setItem('access_token', token.access_token);
            localStorage.setItem(
              'user_name',
              this.logiLayoutService.authCredentialDot.username,
            );
            this.WMServiceService.userProfile = {
              username: this.logiLayoutService.authCredentialDot.username,
            };

            if (this.roleGuardService.checkRoles(['ICAT Admin'])) {
              this.userRole = this.userRoles[0];
              this.router.navigate(['/dashboard']);
            } else if (this.roleGuardService.checkRoles(['ICAT User'])) {
              this.userRole = this.userRoles[1];
              this.router.navigate(['/dashboard']);
            } else if (this.roleGuardService.checkRoles(['PMU Admin'])) {
              this.userRole = this.userRoles[2];
              this.router.navigate(['/dashboard']);
            } else if (this.roleGuardService.checkRoles(['PMU User'])) {
              this.userRole = this.userRoles[3];
              this.router.navigate(['/dashboard']);
            }
            this.sharedDataService.changeMessage('login_success');
          } else {
            this.isInvalidCredential = true;
          }
        },
        (error) => {
          this.isInvalidCredential = true;
        },
      );
  }
}
