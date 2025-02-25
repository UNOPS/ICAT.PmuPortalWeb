import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPassword, AuthControllerServiceProxy } from 'shared/service-proxies/service-proxies';
import { AuthenticationService } from '../login-layout/authentication.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
})
export class SetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  resetPasswordDto = new ResetPassword();
  token: string = '';
  
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  
  isLoading: boolean = false;
  isSuccessful: boolean = false;
  errorMessage: string = '';

  // Password pattern: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  private passwordPattern = '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private authControllerService: AuthControllerServiceProxy
  ) {
    this.authService.authenticate(false, true);
  }

  ngOnInit(): void {
    this.initForm();
    this.getTokenFromUrl();
  }

  get passwordControl(): any {
    return this.resetPasswordForm.get('password');
  }

  get emailControl(): any {
    return this.resetPasswordForm.get('email');
  }

  get confirmPasswordControl(): any {
    return this.resetPasswordForm.get('confirmPassword');
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  resetPassword(): void {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.resetPasswordDto.password = this.passwordControl.value;
    this.resetPasswordDto.token = this.token;
    this.resetPasswordDto.email = this.emailControl.value;

    this.authControllerService.resetPassword(this.resetPasswordDto)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(
        (isSuccess: boolean) => {
          this.isSuccessful = isSuccess;
          if (isSuccess) {
            setTimeout(() => this.router.navigate(['/login']), 3000);
          } else {
            this.errorMessage = 'Password reset failed. Please try again.';
          }
        },
        (error) => {
          this.errorMessage = 'An error occurred. Please try again later.';
          console.error('Reset password error:', error);
        }
      );
  }

  gotoLogin(): void {
    this.router.navigate(['/login']);
  }

  private initForm(): void {
    this.resetPasswordForm = this.fb.group({
      email: ['', [
      Validators.required,
      Validators.email
      ]],
      password: ['', [
      Validators.required,
      Validators.pattern(this.passwordPattern)
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private getTokenFromUrl(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.router.navigate(['/login']);
      }
    });
  }

  private passwordMatchValidator(control: any): ValidationErrors | null {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}