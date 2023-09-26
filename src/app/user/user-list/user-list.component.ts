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
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  rows = 10;

  loading: boolean;

  customers: User[];
  users: User[];

  totalRecords: number =0;

  searchText = '';
  searchEmailText: string;
  searchLastText: string;

  instuitutionList: Institution[];
  countrylists: Country[];
  selctedInstuitution: Institution;
  selectedCountry: Country;

  userTypes: UserType[] = [];
  selctedUserType: UserType;
  userrole: string;
  username: string;
  userInsId: number;
  userCountries: number[] = [];
  institutionId: number;
  filter2: string[] | undefined;
  pmuFilter: string[] = [];
  last: number;

  constructor(
    private serviceProxy: ServiceProxy,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  @ViewChild('dt') table: Table;

  async ngOnInit(): Promise<void> {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userrole = tokenPayload.roles[0];
    this.username = tokenPayload.usr;
    this.userInsId = tokenPayload.institutionId;

    this.filter2 = [];

    if (this.userrole == 'PMU Admin' || this.userrole === 'PMU User') {
      this.pmuFilter.push(
        ...[
          'userType.id||$ne||' + 5,
          'userType.id||$ne||' + 4,
          'userType.id||$ne||' + 1,
        ],
      );
    }

    this.serviceProxy
      .getManyBaseUsersControllerUser(
        undefined,
        undefined,
        ['username||$eq||' + this.username],
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res) => {
        this.users = res.data;

        this.institutionId = this.users[0].institution.id;
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
        0,
      )
      .subscribe((res) => {
        this.instuitutionList = res.data;
      });

    if (this.userrole == 'PMU Admin' || this.userrole == 'PMU User') {
      this.filter2 = [];
      this.serviceProxy
        .getManyBaseInstitutionControllerInstitution(
          undefined,
          undefined,
          ['Institution.id||$eq||' + this.userInsId],
          undefined,
          ['name,ASC'],
          undefined,
          1000,
          0,
          0,
          0,
        )
        .subscribe((res) => {
          res.data[0].countries.forEach((c) => {
            this.userCountries.push(c.id);
          });
        });
    }

    this.serviceProxy
      .getManyBaseUserTypeControllerUserType(
        undefined,
        undefined,
        [...this.pmuFilter],
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        1,
        0,
      )
      .subscribe((res) => {
        this.userTypes = res.data;
      });

      let countryFilter: string[] = [];
      countryFilter.push('Country.IsSystemUse||$eq||' + 1);
      if (this.userrole == 'PMU Admin' || this.userrole == 'PMU User' ) {
        countryFilter.push('institution.id||$eq||' + tokenPayload.institutionId);
      }

   await  this.serviceProxy
      .getManyBaseCountryControllerCountry(
        undefined,
        undefined,
        countryFilter,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        1,
        0,
      )
      .subscribe(async (res) => {
        this.countrylists = res.data;
      });
      const a: any = {};
      this.loadCustomers(a);
  }

  getFilterand() {
    const filters: string[] = [];

    if (this.userrole == 'PMU Admin' || this.userrole == 'PMU User') {
      if (this.selectedCountry) {
        filters.push(...this.pmuFilter);
      } else {
        filters.push(...this.pmuFilter) 
        if(this.selctedUserType?.id != 2){
          filters.push('institution.id||$eq||' + this.userInsId);
        }
        else{
          filters.push('country.id||$in||' + this.userCountries);
        }
        // & f
      }
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
      filters.push('UserType.id||$cont||' + this.selctedUserType.id);
    }

    if (this.selctedInstuitution) {
      const filter = 'institution.id||$eq||' + this.selctedInstuitution.id;
      filters.push(filter);
    }
    if (this.selectedCountry) {
      const filter = 'country.id||$eq||' + this.selectedCountry.id;
      filters.push(filter);
    }

    return filters;
  }

  onKeydown(event: any) {
    this.searchGain();
  }

  searchGain() {
    const a: any = {};
    a.rows = this.rows;
    a.first = 0;

    this.loadCustomers(a);
  }

  loadCustomers(event: LazyLoadEvent) {
    this.loading = true;
    this.totalRecords = 0;
    const orFilter: string[] = [];
    const andFilter: string[] = this.getFilterand();

    if (
      (this.userrole === 'PMU Admin' || this.userrole === 'PMU User') &&
      this.userCountries.length > 0 &&
      andFilter.length === 4
    ) {
      orFilter.push(
        ...this.pmuFilter,
        'country.id||$in||' + this.userCountries,
      );
    }
    const pageNumber = event.first === 0 || event.first == undefined ? 1 : event.first / (event.rows == undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    this.serviceProxy
      .getManyBaseUsersControllerUser(
        undefined,
        undefined,
        andFilter,
        orFilter,
        ['firstName,ASC'],
        ['institution'],
        event.rows,
        0,
        pageNumber,
        0,
      )
      .subscribe((res) => {
        this.totalRecords = res.total;
        this.customers = res.data;
        this.loading = false; 
      });
  }

  async editUser(user: User) {
    await this.router.navigate(['/user'], { queryParams: { id: user.id } }).then(()=>{
      // window.location.reload();
    }); 
    // window.location.reload();
  }

  new() {
    this.router.navigate(['/user-new']);
  }
}