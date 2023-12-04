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
import { ThrowStmt } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-country',
  templateUrl: './add-country.component.html',
  styleUrls: ['./add-country.component.css'],
})
export class AddCountryComponent implements OnInit, AfterViewInit {
  countryList: Country[] = [];
  sectorList: Sector[] = [];

  accessmodules: any[] = [
    { id: 1, name: 'Climate Action' },
    { id: 2, name: 'GHG Impact' },
    { id: 3, name: 'MAC' },
    { id: 4, name: 'Data Collection' },
    { id: 5, name: 'Data Collection - GHG' },
  ];

  selectedModules: any[] = [];
  modules: any[] = [];

  selectedSectors: Sector[] = [];
  mapData1: CountriesData = {};
  mapData2: CountriesData = {};
  flagPath: string;
  editCountryId: any;
  isNewCountry = true;
  arr: any[] = [];
  url = environment.baseSyncAPI + '/countryone';
  selectCountry = 'Select a Country';
  selectedCountryCode: string;
  selectedMapCountry: any;
  displayPosition = false;
  position = 'top-right';
  cou: Country = new Country();

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
    private http: HttpClient,
  ) { }

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

            this.onStatusChange(this.cou);
            if (this.cou.countryStatus == CountryStatus.Active) {
              this.cstaus = 1;
            } else {
              this.cstaus = 0;
            }
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

            this.modules = this.selectedModules.filter((m) => {
              return m.name;
            });

            this.selectedModules = this.selectedModules.filter((m) => {
              return m;
            });

            if (this.editCountryId) {
              this.selectCountry = this.cou.name;
            } else {
              this.selectCountry = 'Select Country';
            }

            const mapData2: CountriesData = {};
            mapData2[this.cou.code] = { value: 1 };
            this.mapData1 = mapData2;
          });
      }
    });
  }

  onStatusChange(event: any) {
    if (this.editCountryId == undefined) {
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
        this.cou = new Country();
      }
    } else {
      const mapData2: CountriesData = {};

      this.mapData1 = mapData2;
      this.cou.flagPath = event.flagPath;
      this.cou.description = event.description;
      this.cou.region = event.region;
    }
  }

  selectmod(event: any) { }

  async saveCountry(userForm: NgForm) {
    {
      if (this.isNewCountry) {
        this.cou.id = this.cou.id;
        this.cou.description = this.cou.description;
        this.cou.isSystemUse = true;
        this.cou.countryStatus = CountryStatus.Active;
        this.cou.registeredDate = moment(new Date());

        for (let x = 0; x < this.selectedModules.length; x++) {
          const selectModId = this.selectedModules[x].id;

          this.arr.push(selectModId);
        }

        if (this.arr.includes(1)) {
          this.cou.climateActionModule = true;
        } else if (!this.arr.includes(1)) {
          this.cou.climateActionModule = false;
        }
        if (this.arr.includes(2)) {
          this.cou.ghgModule = true;
        } else if (!this.arr.includes(2)) {
          this.cou.ghgModule = false;
        }
        if (this.arr.includes(3)) {
          this.cou.macModule = true;
        } else if (!this.arr.includes(3)) {
          this.cou.macModule = false;
        }
        if (this.arr.includes(4)) {
          this.cou.dataCollectionModule = true;
        } else if (!this.arr.includes(4)) {
          this.cou.dataCollectionModule = false;
        }
        if (this.arr.includes(5)) {
          this.cou.dataCollectionGhgModule = true;
        } else if (!this.arr.includes(5)) {
          this.cou.dataCollectionGhgModule = false;
        }

        const countrysectr: CountrySector[] = [];
        for (let x = 0; x < this.selectedSectors.length; x++) {
          const cst = new CountrySector();
          cst.sector.id = this.selectedSectors[x].id;
          cst.country.id = this.cou.id;
          countrysectr.push(cst);
        }
        this.cou.countrysector = countrysectr;

        this.serviceProxy
          .createOneBaseCountryControllerCountry(this.cou)
          .subscribe(async (res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success.',
              detail: 'Successfully created the country',

            });
            setTimeout(async () => {
              await this.http.post<any[]>(this.url, res).subscribe();
              this.router.navigate(['/country-registry']);
            }, 1000);
          },
            (error) => {
              alert('An error occurred, please try again.');
            }
          );
        this.onBackClick();
      } else {
        for (let x = 0; x < this.selectedModules.length; x++) {
          const selectModId = this.selectedModules[x].id;

          this.arr.push(selectModId);
        }

        if (this.arr.includes(1)) {
          this.cou.climateActionModule = true;
        } else if (!this.arr.includes(1)) {
          this.cou.climateActionModule = false;
        }
        if (this.arr.includes(2)) {
          this.cou.ghgModule = true;
        } else if (!this.arr.includes(2)) {
          this.cou.ghgModule = false;
        }
        if (this.arr.includes(3)) {
          this.cou.macModule = true;
        } else if (!this.arr.includes(3)) {
          this.cou.macModule = false;
        }
        if (this.arr.includes(4)) {
          this.cou.dataCollectionModule = true;
        } else if (!this.arr.includes(4)) {
          this.cou.dataCollectionModule = false;
        }
        if (this.arr.includes(5)) {
          this.cou.dataCollectionGhgModule = true;
        } else if (!this.arr.includes(5)) {
          this.cou.dataCollectionGhgModule = false;
        }

        const countrysectr: CountrySector[] = [];
        for (let x = 0; x < this.selectedSectors.length; x++) {
          const cst = new CountrySector();
          const sector = new Sector();
          const country = new Country();

          sector.id = this.selectedSectors[x].id;
          country.id = this.cou.id;
          cst.sector = sector;
          cst.country = country;
          const selectoedCountrySector = this.cou.countrysector.find(
            (a) => a.sectorId == this.selectedSectors[x].id,
          );
          if (selectoedCountrySector) {
            cst.id = selectoedCountrySector.id;
          }
          countrysectr.push(cst);
        }
        this.cou.countrysector = countrysectr;

        this.serviceProxy
          .updateOneBaseCountryControllerCountry(this.cou.id, this.cou)
          .subscribe(
            async (res) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success.',
                detail: 'Successfully updated the country',
              });
              setTimeout(async () => {
                await this.http.post<any[]>(this.url, res).subscribe();
                this.onBackClick();
              }, 1000);
            },
            (error) => {
              alert('An error occurred, please try again.');
            },
          );
      }
    }
  }

  async activateCountry(cou: Country) {
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
                ? 'Are you sure you want to activate ' + res.name + '?'
                : 'Are you sure you want to deactivate ' + res.name + '?',
            header: 'Confirmation',
            rejectIcon: 'icon-not-visible',
            rejectVisible: true,
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            accept: () => {
              this.onBackClick();
            },

            reject: () => { },
          });
          await this.http.post<any[]>(this.url, res).subscribe();
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
    await axios.get(this.url);
  }

  onBackClick() {
    this.router.navigate(['/country-registry']);
  }
}
