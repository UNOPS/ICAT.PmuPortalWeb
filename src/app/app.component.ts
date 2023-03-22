import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { RoleGuardService } from './auth/role-guard.service';
import decode from 'jwt-decode';
import { SharedDataService } from 'shared/shared-data-services';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService, DialogService],
})
export class AppComponent {
  title = 'icat-country-portal-web-app';
  togglemenu = true;
  innerWidth = 0;
  showLeftMenu = false;
  showTopMenu = false;
  userRoles: any[] = [];
  userRole: any = { name: 'Guest', role: '-1' };
  fname: any;
  urole: any;
  lname: any;
  environment = environment;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  constructor(
    private roleGuardService: RoleGuardService,
    private router: Router,
    private sharedDataService: SharedDataService,
  ) {
    this.userRoles = [
      { name: 'ICAT Admin', role: '4' },
      { name: 'ICAT User', role: '5' },
      { name: 'PMU Admin', role: '1' },
      { name: 'PMU User', role: '3' },
    ];

    this.router.events.subscribe((event: any) => {
      if (event && event.url) {
        this.showLeftMenu = true;
        this.showTopMenu = true;
        if (event.url == '/login') {
          this.showLeftMenu = false;
          this.showTopMenu = false;
          return;
        }
        if (event.url == '/') {
          this.showLeftMenu = false;
          this.showTopMenu = false;
          return;
        }

        if (event.url == '/landing-page') {
          this.showLeftMenu = false;
          return;
        }
        if (event.url == '/propose-project   ') {
          this.showLeftMenu = false;
          return;
        }
      }
    });
  }

  ngOnInit() {
    this.sharedDataService.currentMessage.subscribe((message: string) => {
      if (message == 'login_success') {
        this.setLoginRole();
      }
    });

    this.innerWidth = window.innerWidth;
    this.setLoginRole();
  }

  setLoginRole() {
    const token = localStorage.getItem('access_token')!;

    const tokenPayload = decode<any>(token);

    this.fname = tokenPayload.fname;
    this.lname = tokenPayload.lname;
    this.urole = tokenPayload.roles[0];

    if (this.roleGuardService.checkRoles(['ICAT Admin'])) {
      this.userRole = this.userRoles[0];
    } else if (this.roleGuardService.checkRoles(['ICAT User'])) {
      this.userRole = this.userRoles[1];
    } else if (this.roleGuardService.checkRoles(['PMU Admin'])) {
      this.userRole = this.userRoles[2];
    } else if (this.roleGuardService.checkRoles(['PMU User'])) {
      this.userRole = this.userRoles[3];
    }
  }

  logout() {
    localStorage.setItem('access_token', '');
    localStorage.setItem('user_name', '');
    this.router.navigate(['/login']);
  }
}
