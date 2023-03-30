import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Country,
  Sector,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-country',
  templateUrl: './edit-country.component.html',
  styleUrls: ['./edit-country.component.css'],
})
export class EditCountryComponent implements OnInit {
  country: Country = new Country();
  sector: Sector = new Sector();
  sectors: Sector[];
  sectorUpdated: any;
  countryId: number;
  isSaving = false;
  sectorList: Sector[];
  value: any;
  confirm = false;
  confirmSector = false;

  constructor(
    private route: Router,
    private serviceProxy: ServiceProxy,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.serviceProxy
      .getOneBaseCountryControllerCountry(1, undefined, undefined, 0)
      .subscribe((res: any) => {
        this.country = res;
        this.countryId = this.country.id;
      });

    const countryFilter: string[] = [];

    countryFilter.push('country.id||$eq||' + 1);

    this.serviceProxy
      .getManyBaseSectorControllerSector(
        undefined,
        undefined,
        countryFilter,
        undefined,
        undefined,
        ['country'],
        1000,
        0,
        0,
        0,
      )
      .subscribe((res) => {
        this.sectors = res.data;
      });
  }

  saveCountry(country: Country) {
    this.serviceProxy
      .updateOneBaseCountryControllerCountry(1, country)
      .subscribe((res) => {
        this.country = res;
        this.confirm = true;
      });
  }

  saveSector(sector: Sector[]) {
    for (const sector of this.sectors) {
      this.serviceProxy
        .updateOneBaseSectorControllerSector(sector.id, sector)
        .subscribe((res) => {
          this.confirmSector = true;
        });
    }
  }

  back() {
    this.route.navigate(['/view-country']);
  }
}
