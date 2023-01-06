import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { LazyLoadEvent } from 'primeng/api';
import decode from 'jwt-decode';
import {
  Audit,
  AuditControllerServiceProxy,
  ServiceProxy,
  User,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css'],
})
export class AuditComponent implements OnInit {
  loading: boolean;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;
  Date =new Date();
  searchText: string;
  status: string[] = [];
  activityList: string[] = [];
  userTypeList: string[] = [];
  searchBy: any = {
    text: null,
    usertype: null,
    activity: null,
    editedOn: null,
  };

  first = 0;
  activities: Audit[];
  dateList: Date[] = [];
  loggedusers: User[];
  institutionId: number;

  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private auditproxy: AuditControllerServiceProxy,
    private cdr: ChangeDetectorRef
  ) { }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    const username = tokenPayload.usr;
    console.log('username=========', tokenPayload.usr);

    let filters: string[] = [];
    filters.push('username||$eq||' + username);





    // this.serviceProxy
    //   .getManyBaseAuditControllerAudit(
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     ['editedOn,DESC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    //   .subscribe((res) => {
    //    this.activities = res.data;

    //     console.log("activiiessss----",this.activities)
    //     // this.totalRecords = res.totalRecords;
    //     // if (res.totalRecords !== null) {
    //     //   this.last = res.count;
    //     // } else {
    //     //   this.last = 0;
    //     // }
    //     for (let d of res.data) {
    //       this.activityList.push(d.action);
    //       this.dateList.push(d.editedOn.toDate());
    //       this.userTypeList.push(d.userType);
    //       console.log(this.dateList);
    //     }
    //     console.log('activities', this.activityList);
    //   });


    this.serviceProxy
      .getManyBaseUsersControllerUser(
        undefined,
        undefined,
        filters,
        undefined,
        ['editedOn,DESC'],
        undefined,
        1000,
        0,
        0,
        0

      )
      .subscribe((res) => {
        this.loggedusers = res.data;
        console.log("loggeduser-----", this.loggedusers)
        this.institutionId = this.loggedusers[0].institution.id;
        console.log("institutionId-----", this.institutionId)
      });



  }

  onactivityChange(event: any) {
    this.onSearch();
  }
  ondateChange(event: any) {
    this.onSearch();
  }
  onUTChange(event: any) {
    this.onSearch();
  }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }


  loadgridData = (event: LazyLoadEvent) => {
    console.log('event Date', event);
    this.loading = true;
    this.totalRecords = 0;


    let usertype = this.searchBy.usertype ? this.searchBy.usertype : '';
    let action = this.searchBy.activity ? this.searchBy.activity : '';
    let filtertext = this.searchBy.text ? this.searchBy.text : '';
    console.log("iiiiiiiii", this.institutionId)



    console.log(
      moment(this.searchBy.editedOn).format('YYYY-MM-DD'),
      'jjjjjjjjjjjjjjjj'
    );
    let editedOn = this.searchBy.editedOn
      ? moment(this.searchBy.editedOn).format('YYYY-MM-DD')
      : '';

    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    setTimeout(() => {
      this.auditproxy
        .getAuditDetails(
          pageNumber,
          this.rows,
          usertype,
          action,
          editedOn,
          filtertext,
          this.institutionId
        )

        .subscribe((a) => {
          this.activities = a.items;

          console.log("aaaaasssss--", this.activities)

          console.log(a, 'kk');
          this.totalRecords = a.meta.totalItems;
          this.loading = false;

          for (let d of a.items) {
            if (!this.status.includes(d.actionStatus)) {
              this.status.push(d.actionStatus);
            }

            if (!this.userTypeList.includes(d.userType)) {
              this.userTypeList.push(d.userType);
            }

            console.log(this.dateList);
          }
        });
    }, 1000);
  };
}
