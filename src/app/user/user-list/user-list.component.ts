import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  Country,
  Institution,
  ServiceProxy,
  User,
  UserType,
} from 'shared/service-proxies/service-proxies';
import { Table, TableModule } from 'primeng/table';
import { LazyLoadEvent, MessageService, SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import decode from 'jwt-decode';



@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  rows: number = 10;

  loading: boolean;

  customers: User[];
  users:User[];

  totalRecords: number;

  searchText: string = '';
  searchEmailText: string;
  searchLastText: string;

  instuitutionList: Institution[];
  countrylists: Country[]
  selctedInstuitution: Institution;
  selectedCountry:Country;

  userTypes: UserType[] = [];
  selctedUserType: UserType;
  userrole:string;
  username:string;
  institutionId:number;
  filter2: string[] | undefined;

  constructor(private serviceProxy: ServiceProxy, private router: Router, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  @ViewChild("dt") table: Table;

  ngOnInit(): void {

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userrole = tokenPayload.roles[0];
    this.username =tokenPayload.usr;
    console.log('user-tokenPayload=========', tokenPayload);
    console.log("urole====",this.userrole)

   this.filter2 =[];

   if(this.userrole == "PMU Admin"){
     this.filter2.push('mrvInstitution||$notnull||'+'')
   }


    this.serviceProxy
    .getManyBaseUsersControllerUser(
      undefined,
      undefined,
      ['username||$eq||'+ this.username],
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    )
    .subscribe((res) => {
      this.users = res.data;
      console.log("filteredUser-----",this.users)
      this.institutionId = this.users[0].institution.id;
      console.log("currentInstitutionID-----",this.institutionId)

    });

    this.serviceProxy
      .getManyBaseInstitutionControllerInstitution(
        undefined,
        undefined,
        undefined,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res) => {
        this.instuitutionList = res.data;
        console.log("institutionlists-----",this.instuitutionList)
      });


    this.serviceProxy
      .getManyBaseUserTypeControllerUserType(
        undefined,
        undefined,
        undefined,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        1,
        0
      )
      .subscribe((res) => {
        this.userTypes = res.data;
      });

      this.serviceProxy.getManyBaseCountryControllerCountry(
        undefined,
        undefined,
        ['isSystemUse||eq||1'],
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        1,
        0
      )
      .subscribe((res) => {
        this.countrylists = res.data;
        console.log("countrylists-----",this.countrylists)
      });
      
  }

  


  getFilterand() {
    let filters: string[] = [];
  
    if(this.userrole == 'PMU Admin'){
      filters.push('userType.id||$ne||'+ 5) & filters.push('userType.id||$ne||'+ 4) & filters.push('userType.id||$ne||'+ 1)
       &  filters.push('institution.id||eq||1');
       console.log("log as pmu")

    }

    if (this.searchText && this.searchText.length > 0) {
      filters.push('firstName||$cont||' + this.searchText);
    }

    if (this.searchLastText && this.searchLastText.length > 0) {
      filters.push('lastName||$cont||' + this.searchLastText);
    }

    if (this.searchEmailText && this.searchEmailText.length > 0) {
      filters.push('email||$cont||' + this.searchEmailText);
    }

    if (this.selctedUserType) {
      filters.push('userType.id||$cont||' + this.selctedUserType.id);
    }

    if (this.selctedInstuitution) {
      let filter = 'institution.id||$eq||' + this.selctedInstuitution.id;
      filters.push(filter);
    }
    if(this.selectedCountry){
      let filter = 'country.id||$eq||' + this.selectedCountry.id;
      //let filter = 'mrvInstitution||$ne||'+"ii";
      filters.push(filter) & filters.push('mrvInstitution||$ne||'+ "ii");

    }
   //  filters.push('institution.id||eq||'+1);

    console.log("Filter=====",filters);

    return filters;
  }

  // getFilterOr() {
  //   let filters: string[] = [];

  //   // if (this.searchText && this.searchText.length > 0) {
  //   //   filters.push('email||$cont||' + this.searchText);
  //   //   filters.push('lastName||$cont||' + this.searchText);
  //   //   filters.push('firstName||$cont||' + this.searchText);
  //   // }

  //   // console.log(filters);

  //   return filters;
  // }

 

  
  onKeydown(event: any) {
  // if (event.key === 'Enter') {
      console.log("ooooopssss===",event);
     // this.loadCustomers(event);
     
     this.searchGain();
 //  }
  }

  //  onSearch() {
  //   let event: any = {};
  //   event.rows = this.rows;
  //   event.first = 0;

  //   console.log("EEEE",event)

  //   this.loadCustomers(event);
  // }


  searchGain() {
    let a: any = {};
    a.rows = this.rows;
    a.first = 0;
    console.log("aa==",a)

    this.loadCustomers(a);
  }

  loadCustomers(event: LazyLoadEvent) {
    console.log('loadCustomers===', event);
    this.loading = true;

    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value
  console.log("filter2====",this.filter2)
    this.serviceProxy
      .getManyBaseUsersControllerUser(
        undefined,
        undefined,
        this.getFilterand(),
        this.filter2,
        ['firstName,ASC'],
        ['institution'],
        event.rows,
        event.first,
        0,
        0
      )
      .subscribe((res) => {
        console.log("users================",res);
        this.totalRecords = res.total;
        this.customers = res.data;
        this.loading = false;
        console.log("users================",this.customers);
      });
  }

  editUser(user: User) {
    console.log('edit user', user);

    this.router.navigate(['/user'], { queryParams: { id: user.id } });
  }

  new() {
    this.router.navigate(['/user-new']);
  }
}
