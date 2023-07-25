import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import decode from 'jwt-decode';
@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(
    public router: Router
  ) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    let grant = false;
    let roles: any[] = [];

    const expectedRoles1 = route.data['expectedRoles'];
    const token = localStorage.getItem('access_token')!;
    if (token) {
      const tokenPayload = decode<any>(token);

      roles = tokenPayload['roles'];

      expectedRoles1.forEach((role: any) => {
        if (roles.indexOf(role) > -1) {
          grant = true;
        }
      });
    }

    if (!grant) {
      this.router.navigate(['login']);

      return false;
    }
    return true;
  }

  getDefaultRoles() {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);

    const roles: any[] = tokenPayload['roles'];
    if (roles.length > 0) {
      return roles[0];
    }
    return '';
  }

  getAllRoles() {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);

    const roles: any[] = tokenPayload['roles'];
    return roles;
  }
  checkRoles(expectedRoles: string[]): boolean {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);

    const roles: any[] = tokenPayload['roles'];

    let grant = false;

    expectedRoles.forEach((role) => {
      if (roles.indexOf(role) > -1) {
        grant = true;
      }
    });

    return grant;
  }
}
