import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import {
  Country,
  IInstitution,
  Institution,
  InstitutionControllerServiceProxy,
  ServiceProxy,
  User,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-institutions',
  templateUrl: './institutions.component.html',
  styleUrls: ['./institutions.component.css'],
})
export class InstitutionsComponent implements OnInit, AfterViewInit {
  name: string;

  institutions: Institution[];

  countryList: Country[];
  insCountryList: Country[];

  loading: boolean;
  totalRecords = 0;
  rows = 10;
  last: number;
  event: any;

  searchBy: any = {
    text: null,
    country: null,
  };

  first = 0;

  constructor(
    private serviceProxy: ServiceProxy,
    private institutionProxy: InstitutionControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  @ViewChild('dt') table: Table;

  ngOnInit(): void {
    this.serviceProxy
      .getManyBaseCountryControllerCountry(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res: any) => {
        this.countryList = res.data;
        this.countryList = this.countryList.filter(
          (a) => a.institution && a.institution.id,
        );
      });
  }

  onCountryChange(event: any) {
    this.onSearch();
  }

  onSearch() {
    const event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  loadgridData = (event: LazyLoadEvent) => {
    this.loading = true;
    this.totalRecords = 0;

    const filtertext = this.searchBy.text ? this.searchBy.text : '';
    const countryId = this.searchBy.country ? this.searchBy.country.id : 0;

    const pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;

    setTimeout(() => {
      this.institutionProxy
        .getInstiDetails(pageNumber, this.rows, filtertext, countryId)
        .subscribe((a) => {
          this.institutions = a.items;
          this.totalRecords = a.meta.totalItems;

          this.loading = false;
        });
    }, 1);
  };

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }
  getCountries(insId: number) {
    this.insCountryList = [];
    this.serviceProxy
      .getOneBaseInstitutionControllerInstitution(
        insId,
        undefined,
        undefined,
        undefined,
      )
      .subscribe((res: any) => {
        this.insCountryList = res.countries;
      });
  }

  new() {
    this.router.navigate(['/instituion-new']);
  }

  editInstitution(institution: Institution) {
    this.router.navigate(['/instituion-new'], {
      queryParams: { id: institution.id },
    });
  }

  testfun() {}
}
