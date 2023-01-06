import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { RoleGuardService } from './auth/role-guard.service';
import decode from 'jwt-decode';
import { SharedDataService } from 'shared/shared-data-services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService, DialogService],
})
export class AppComponent {
  title = 'icat-country-portal-web-app';
  togglemenu: boolean = true;
  innerWidth = 0;
  showLeftMenu: boolean = false;
  showTopMenu: boolean = false;
  userRoles: any[] = [];
  userRole: any = { name: 'Guest', role: '-1' };
  fname: any;
  urole: any;
  lname: any;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  /**
   *
   */
  constructor(
    private roleGuardService: RoleGuardService,
    private router: Router,
    private sharedDataService: SharedDataService

  ) {
    this.userRoles = [
      { name: 'ICAT Admin', role: '4' },
      { name: 'ICAT User', role: '5' },
      { name: 'PMU Admin', role: '1' },
      { name: 'PMU User', role: '3' },
      // { name: 'Technical Team(Technical Team User)', role: '5' },
      // { name: 'Data Collection Team', role: '6' },
      // { name: 'QC Team', role: '7' },
      // { name: 'Institution Admin', role: '8' },
      // { name: 'Data Entry Operator', role: '9' },
    ];

    this.router.events.subscribe((event: any) => {
      console.log('my....event', event.url);
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
    // rest of initialization code
    //alert("ok");

    this.sharedDataService.currentMessage.subscribe((message: string) => {
      if (message == 'login_success') {
        this.setLoginRole();
      }
    });

    this.innerWidth = window.innerWidth;
    this.setLoginRole();
  }



  setLoginRole() {
    console.log("loginsucesssss")
    const token = localStorage.getItem('access_token')!;
   
    const tokenPayload = decode<any>(token);

    console.log('testload---------', tokenPayload);

    this.fname = tokenPayload.fname;
    this.lname = tokenPayload.lname;
    this.urole = tokenPayload.roles[0];


   //  this.innerWidth = window.innerWidth;

    if (this.roleGuardService.checkRoles(['ICAT Admin'])) {
      this.userRole = this.userRoles[0];
     // this.router.navigate(['/dashboard']);
    } else if (this.roleGuardService.checkRoles(['ICAT User'])) {
      this.userRole = this.userRoles[1];
     // this.router.navigate(['/dashboard']);
    } else if (this.roleGuardService.checkRoles(['PMU Admin'])) {
      this.userRole = this.userRoles[2];
     // this.router.navigate(['/dashboard']);
    } else if (this.roleGuardService.checkRoles(['PMU User'])
    ) {
      this.userRole = this.userRoles[3];
      //this.router.navigate(['/dashboard']);
    } 
  }

    //logout
    logout() {
      console.log('logout-------');
      localStorage.setItem('access_token', '');
      localStorage.setItem('user_name', '');
      this.router.navigate(['/login']);
    }
}
