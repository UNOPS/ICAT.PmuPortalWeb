import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { CountriesData } from 'countries-map';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import decode from 'jwt-decode';

import {
  LazyLoadEvent,
  ConfirmationService,
  MessageService,
} from 'primeng/api';

import {
  Country,
  CountryControllerServiceProxy,
  CountrySector,
  CountryStatus,
  Project,
  ProjectApprovalStatus,
  ProjectControllerServiceProxy,
  ProjectOwner,
  ProjectStatus,
  Sector,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-view-country',
  templateUrl: './view-country.component.html',
  styleUrls: ['./view-country.component.css'],
})
export class ViewCountryComponent implements OnInit, AfterViewInit {
  countryList: Country[] = [];
  sectorList: Sector[] = [];

  accessmodules: any[] = [
    { id: 1, name: 'Climate Action Module' },
    { id: 2, name: 'GHG Module' },
    { id: 3, name: 'MAC Module' },
    { id: 4, name: 'Data Collection Module' },
  ];

  selectedModules: any[] = [];

  selectedSectors: Sector[] = [];
  mapData1: CountriesData = {};
  mapData2: CountriesData = {};
  flagPath: string;
  editCountryId: any;
  isNewCountry = true;
  arr: any[] = [];
  url = environment.baseSyncAPI + '/country';
  selectCountry = 'Select a Country';

  cou: Country = new Country();
  secNames = '';
  modNames = '';
  @ViewChild('op') overlay: any;
  cstaus = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,

    private serviceProxy: ServiceProxy,
    private projectProxy: ProjectControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private countryProxy: CountryControllerServiceProxy,
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);

    const institutionId = tokenPayload.institutionId;

    const countryFilter: string[] = [];
    countryFilter.push('Country.IsSystemUse||$eq||' + 0);
    if (institutionId != undefined) {
      countryFilter.push('institution.id||$eq||' + institutionId);
    }

    this.serviceProxy
      .getManyBaseCountryControllerCountry(
        undefined,
        undefined,
        countryFilter,
        undefined,
        ['editedOn,DESC'],
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res: any) => {
        this.countryList = res.data;
      });

    this.serviceProxy
      .getManyBaseSectorControllerSector(
        undefined,
        undefined,
        undefined,
        undefined,
        ['editedOn,DESC'],
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res: any) => {
        this.sectorList = res.data;
      });

    this.cou = new Country();
    this.route.queryParams.subscribe((params) => {
      this.editCountryId = params['id'];
      if (this.editCountryId && this.editCountryId > 0) {
        this.isNewCountry = false;

        this.countryProxy
          .getCountry(this.editCountryId)
          .subscribe((res: any) => {
            this.cou = res;

            for (let x = 0; x < this.cou.countrysector.length; x++) {
              this.selectedSectors.push(this.cou.countrysector[x].sector);
            }

            for (let x = 0; x < this.selectedSectors.length; x++) {
              const tempSecName = this.selectedSectors[x].name;
              this.secNames = this.secNames + ' ' + tempSecName;
            }

            this.cou.description = res.description;
            this.onStatusChange(this.cou);

            if (this.cou.climateActionModule) {
              this.selectedModules.push({ id: 1, name: 'Climate Action' });
            }
            if (this.cou.macModule) {
              this.selectedModules.push({ id: 3, name: 'MAC' });
            }
            if (this.cou.ghgModule) {
              this.selectedModules.push({ id: 2, name: 'GHG Impact' });
            }
            if (this.cou.dataCollectionModule) {
              this.selectedModules.push({ id: 4, name: 'Data Collection' });
            }
            if (this.cou.dataCollectionGhgModule) {
              this.selectedModules.push({
                id: 5,
                name: 'Data Collection - GHG',
              });
            }

            for (let x = 0; x < this.selectedModules.length; x++) {
              const tempModName = this.selectedModules[x].name;
              this.modNames = this.modNames + '  ' + tempModName;
            }

            if (this.editCountryId) {
              this.selectCountry = this.cou.name;
            } else {
              this.selectCountry = 'Select Country';
            }
          });
      }
    });
  }

  onStatusChange(event: any) {
    if (this.editCountryId != undefined) {
      if (event != null || event != undefined) {
        const mapData2: CountriesData = {};
        mapData2[event.code] = { value: 1000 };
        this.mapData1 = mapData2;
        this.cou.flagPath = event.flagPath;
        this.cou.description = event.description;
        this.cou.region = event.region;
      } else {
        this.mapData1 = {};
        this.flagPath = '';
      }
    }
  }

  selectmod(event: any) {}

  activateCountry(cou: Country) {
    if (this.cou.countryStatus == CountryStatus.Active) {
      this.cou.countryStatus = CountryStatus.Deactivated;
    } else if (this.cou.countryStatus == CountryStatus.Deactivated) {
      this.cou.countryStatus = CountryStatus.Active;
    }
    this.serviceProxy
      .updateOneBaseCountryControllerCountry(this.cou.id, this.cou)
      .subscribe(
        async (res) => {
          this.confirmationService.confirm({
            message:
              this.cou.countryStatus === CountryStatus.Active
                ? 'Country is Activated'
                : 'Country is Deactivated',
            header: 'Confirmation',
            rejectIcon: 'icon-not-visible',
            rejectVisible: false,
            acceptLabel: 'Ok',
            accept: () => {
              this.onBackClick();
            },

            reject: () => {},
          });
          await axios.get(this.url);
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error.',
            detail: 'Failed Deactiavted, please try again.',
            sticky: true,
          });
        },
      );
  }

  onBackClick() {
    this.router.navigate(['/country-registry']);
  }
}
