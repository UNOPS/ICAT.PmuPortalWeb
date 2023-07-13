import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { CountriesData } from 'countries-map';
import decode from 'jwt-decode';

import { LazyLoadEvent } from 'primeng/api';

import {
  Country,
  Project,
  ProjectApprovalStatus,
  ProjectControllerServiceProxy,
  ProjectOwner,
  ProjectStatus,
  Sector,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-country-registry',
  templateUrl: './country-registry.component.html',
  styleUrls: ['./country-registry.component.css'],
})
export class CountryRegistryComponent implements OnInit, AfterViewInit {
  countryList: Country[] = [];
  pcountryList: Country[] = [];

  totalRecords = 0;
  rows = 10;
  first = 0;

  mapData1: CountriesData = {};
  mapData2: CountriesData = {};

  displayPosition = false;
  position = 'top-right';
  selectedCountryCode: string;
  selectedMapCountry: any;
  countryFilter: string[] = [];
  loading: boolean;

  @ViewChild('op') overlay: any;

  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private projectProxy: ProjectControllerServiceProxy,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);

    const institutionId = tokenPayload.institutionId;

    this.countryFilter.push('Country.isSystemUse||$eq||' + 1);
    if (institutionId != undefined) {
      this.countryFilter.push('institution.id||$eq||' + institutionId);
    }
  }

  loadCustomers(event: LazyLoadEvent) {
    this.loading = true;

    this.serviceProxy
      .getManyBaseCountryControllerCountry(
        undefined,
        undefined,
        this.countryFilter,
        undefined,
        ['editedOn,DESC'],
        undefined,
        event.rows,
        event.first,
        0,
        0,
      )
      .subscribe((res: any) => {
        this.pcountryList = res.data;

        this.totalRecords = res.total;
        this.loading = false;

        for (const c of this.countryList) {
          this.mapData2[c.code] = { value: 100 };
        }

        this.mapData1 = this.mapData2;
      });
  }

  toAddCountry() {
    this.router.navigate(['add-country']);
  }

  selectedCountry(event: any) {
    this.selectedCountryCode = event.country;
    this.selectedMapCountry = this.countryList.find(
      (obj) => obj.code == this.selectedCountryCode,
    );
    this.position = 'right';
    this.displayPosition = true;
  }

  editCountry(con: Country) {
    this.router.navigate(['/add-country'], { queryParams: { id: con.id } });
  }

  viewCountry(con: Country) {
    this.router.navigate(['/view-country'], { queryParams: { id: con.id } });
  }
}
