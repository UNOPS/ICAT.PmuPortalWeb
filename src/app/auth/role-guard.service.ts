import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
//import { AuthService } from './auth.service';
import decode from 'jwt-decode';
@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(
    // public auth: AuthService,
    public router: Router
  ) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    let grant = false;
    let roles: any[] = [];

    const expectedRoles1 = route.data['expectedRoles'];
    const token = localStorage.getItem('access_token')!;
    if (token) {
      // decode the token to get its payload
      const tokenPayload = decode<any>(token);

      console.log('tokenPayload=========', tokenPayload);

      roles = tokenPayload['roles'];

      expectedRoles1.forEach((role: any) => {
        if (roles.indexOf(role) > -1) {
          grant = true;
        }
      });
    }

    if (!grant) {
      this.router.navigate(['login']);

      // if (roles.indexOf('ccs-admin') > -1) {
      //   this.router.navigate(['/home']);
      // } else if (roles.indexOf('ccs-deo') > -1) {
      //   this.router.navigate(['/institution-assigneddata']);
      // } else if (roles.indexOf('ins-admin') > -1) {
      //   this.router.navigate(['/institution-home']);
      // } else if (roles.indexOf('ins-deo') > -1) {
      //   this.router.navigate(['/institution-assigneddata']);
      // } else if (roles.indexOf('public-user') > -1) {
      //   this.router.navigate(['/data/parameters']);
      // }

      return false;
    }
    return true;
  }

  getDefaultRoles() {
    const token = localStorage.getItem('access_token')!;
    // decode the token to get its payload
    const tokenPayload = decode<any>(token);

    console.log('tokenPayload=========', tokenPayload);
    //debugger;
    let roles: any[] = tokenPayload['roles'];
    if (roles.length > 0) {
      return roles[0];
    }
    return '';
  }

  getAllRoles() {
    const token = localStorage.getItem('access_token')!;
    // decode the token to get its payload
    const tokenPayload = decode<any>(token);

    console.log('tokenPayload=========', tokenPayload);
    //debugger;
    let roles: any[] = tokenPayload['roles'];
    return roles;
  }
  checkRoles(expectedRoles: string[]): boolean {
    const token = localStorage.getItem('access_token')!;
    // decode the token to get its payload
    const tokenPayload = decode<any>(token);

    console.log('tokenPayload=========', tokenPayload);
   // debugger;
    let roles: any[] = tokenPayload['roles'];

    let grant = false;

    expectedRoles.forEach((role) => {
      if (roles.indexOf(role) > -1) {
        grant = true;
      }
    });

    return grant;
  }
}
