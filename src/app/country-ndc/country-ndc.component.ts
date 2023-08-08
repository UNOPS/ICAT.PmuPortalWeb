import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import * as moment from 'moment';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Calendar } from 'primeng/calendar';
import {
  Country,
  EmissionReductioDraftDataEntity,
  Ndc,
  NdcSet,
  Sector,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-country-ndc',
  templateUrl: './country-ndc.component.html',
  styleUrls: ['./country-ndc.component.css'],
  providers: [MessageService],
})
export class CountryNdcComponent implements OnInit {
  xy: boolean = true;
  flights: any;
  value7: any;
  cities: any;
  data1: Ndc = new Ndc();
  data: Ndc[];
  defoultNDC: boolean = false;
  addNDC: boolean = false;
  ndcsector: boolean = false;
  name: any;
  des: any;
  id: any;
  dec: any;
  newndc: any;
  span: HTMLElement;
  editndc: boolean = false;
  tbdata: any;
  test: any;
  setno: any;
  display: boolean = false;
  check: any;
  selectedValues: string[] = [];
  activendcdialog: boolean = false;
  active: boolean = true;
  confirm1: boolean = false;
  confirm2: boolean = false;
  countryId: any = 1;
  sectorId: any = 1;
  set: any;
  ndcsetDto: NdcSet = new NdcSet();
  country: Country;
  selectedtype: NdcSet = new NdcSet();
  value: any;
  latestset: NdcSet = new NdcSet();
  sector: Sector;
  selectedndc: boolean = true;
  count: any;
  isChangeAssignData: boolean = true;
  selectedndcIdsArry: any = new Array();
  checkboxdis: boolean = false;
  submitdate: any;
  confirm3: boolean = false;
  confirm4: boolean = false;
  display1: boolean = false;
  display2: boolean = false;
  year = '';
  baEmission = 0;
  unCEmission = 0;
  CEmission = 0;
  targetYear = '';
  targetYearEmission = 0;
  display3: boolean = false;
  display4: boolean = false;
  constructor(private messageService: MessageService, private serviceproxy: ServiceProxy, private confirmationService: ConfirmationService, private router: Router, private activerouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.serviceproxy
      .getOneBaseSectorControllerSector(
        this.sectorId,
        undefined,
        undefined,
        undefined
      )
      .subscribe((res) => {
        this.sector = res;
      });

    if (!this.ndcsector) {
      this.defoultNDC = true;
    }
    let filter: string[] = new Array();
    filter.push('country.id||$eq||' + this.countryId);
    filter.push('sector.id||$eq||' + this.sectorId);
    let ndcFilter: string[] = new Array();
    ndcFilter.push('country.id||$eq||' + this.countryId);
    ndcFilter.push('set.name||$eq||' + this.selectedtype.name);

    let countryFilter: string[] = new Array();
    countryFilter.push('country.id||$eq||' + this.countryId);
    this.serviceproxy
      .getManyBaseNdcSetControllerNdcSet(
        undefined,
        undefined,
        countryFilter,
        undefined,
        ['id,DESC'],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res) => {
        this.selectedtype = res.data[0];
        let ndcFilter: string[] = new Array();
        ndcFilter.push('country.id||$eq||' + this.countryId);
        ndcFilter.push('set.id||$eq||' + this.selectedtype.id);
        ndcFilter.push('sector.id||$eq||' + this.sectorId);
        this.serviceproxy
          .getManyBaseNdcControllerNdc(
            undefined,
            undefined,
            ndcFilter,
            undefined,
            undefined,
            undefined,
            1000,
            0,
            0,
            0
          )
          .subscribe((res: any) => {
            this.id = res.data[0]?.id;
            this.dec = res.data[0]?.dec;
            this.name = res.data[0]?.name;
            this.test = 'Transport';
            this.data = res.data;
          });
      });
    this.serviceproxy
      .getOneBaseCountryControllerCountry(
        this.countryId,
        undefined,
        undefined,
        undefined
      )
      .subscribe((res) => {
        this.country = res;
      });

    this.serviceproxy
      .getManyBaseNdcSetControllerNdcSet(
        undefined,
        undefined,
        countryFilter,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.setno = res.data;
      });
    this.newndc = [{ one: ' ' }, { one: ' ' }];
    this.value = this.selectedtype;
  }

  addNewNDC() {
    this.defoultNDC = false;
    this.ndcsector = true;
    this.router.navigate(['/addndc'], {
      queryParams: {
        countryId: this.countryId,
        sectorId: this.sectorId,
        ndcsetid: this.selectedtype.id,
      },
    });
  }

  addNew() {
    var el = document.createElement(
      '<input type="text" class="p-inputtext" pInputText placeholder="NDC name" style = "width:100%"/>'
    );
    this.newndc.push(el);
  }
  selectset(r: any) { }

  selectSector(sector: any) {
    this.addNDC = true;
  }

  addsub() {
    let row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <br>
      <label style="color: blue">Name of the Sub NDC</label><br>
      <input type="text" class="p-inputtext" pInputText  placeholder="Sub nDC Name" style = "width:100%"/><br><br>`;
    window.document.querySelector('.showInputField')!.appendChild(row);
  }
  checkbox(ndcid: any, isselect: any) {
    if (isselect == 'check') {
      this.selectedndcIdsArry.push(ndcid);
    } else {
      this.selectedndcIdsArry.pop(ndcid);
    }

    if (this.selectedndcIdsArry.length != 0) this.selectedndc = false;
    else this.selectedndc = true;
  }

  editSubNDC(ndcid: any, ndcname: any) {
    this.router.navigate(['/editndc'], {
      queryParams: { ndcname: ndcname, ndcid: ndcid },
    });
  }

  Back() {
    this.defoultNDC = true;
    this.ndcsector = false;
    this.addNDC = false;
    this.editndc = false;
  }

  showDialog() {
    this.display = true;
  }

  activate() {
    this.confirmationService.confirm({
      message:
        'Please confirm you want to Activate selected NDC. you can’t modify NDC names after Activation',
      accept: () => {
        this.active = true;
        this.confirm1 = true;
        this.selectedndc = true;
        for (let ndcid of this.selectedndcIdsArry) {
          this.serviceproxy
            .getOneBaseNdcControllerNdc(ndcid, undefined, undefined, undefined)
            .subscribe((res) => {
              res.status = 1;
              this.serviceproxy
                .updateOneBaseNdcControllerNdc(ndcid, res)
                .subscribe((res) => {
                  this.serviceproxy
                    .getManyBaseSubNdcControllerSubNdc(
                      undefined,
                      undefined,
                      ['ndc.id||$eq||' + ndcid],
                      undefined,
                      undefined,
                      undefined,
                      1000,
                      0,
                      0,
                      0
                    )
                    .subscribe((res) => {
                      for (let sub of res.data) {
                        sub.status = 1;
                        this.serviceproxy
                          .updateOneBaseSubNdcControllerSubNdc(sub.id, sub)
                          .subscribe((res) => { });
                      }
                    });
                });
            });
        }
      },
    });
  }

  onRowEditInit(rowData: any) { }
  onRowEditCancel(rowData: any) { }

  ActivateNDCs() {
    this.activendcdialog = true;
  }

  saveNDCs() {
    this.defoultNDC = false;
    this.ndcsector = true;
  }
  saveSetofNDcs() {
    this.ndcsetDto.country = this.country;
    this.ndcsetDto.name = this.set;
    var dateObj = new Date(this.submitdate);
    var momentObj = moment(dateObj);
    this.ndcsetDto.submissionDate = momentObj;
    this.confirm2 = true;

    if (this.ndcsetDto.name != null || this.submitdate != null) {
      this.confirm3 = true;
      this.serviceproxy
        .createOneBaseNdcSetControllerNdcSet(this.ndcsetDto)
        .subscribe((res) => {
          this.set = ' ';
        });
    } else {
      this.confirm4 = true;
    }

  }

  saveTargets() {
    this.display2 = true;
    let emissionDraftData = new EmissionReductioDraftDataEntity();
    emissionDraftData.sector = this.sector;
    emissionDraftData.country = this.country;
    emissionDraftData.baseYear = this.year;
    emissionDraftData.baseYearEmission = this.baEmission;
    emissionDraftData.targetYear = this.targetYear;
    emissionDraftData.targetYearEmission = this.targetYearEmission;
    emissionDraftData.unconditionaltco2 = this.unCEmission;
    emissionDraftData.conditionaltco2 = this.CEmission;

    if (!this.year || this.year.length == 0 || this.year == ' ' || !(/^-?\d+$/.test(this.year))
      || !this.baEmission
      || !this.targetYear || this.targetYear.length == 0
      || this.targetYear == ' ' || !(/^-?\d+$/.test(this.targetYear))) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error in Saving!!',

      });
    } else if (this.year.length != 4 || this.targetYear.length != 4) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error in Saving!!',
        detail: 'year sould have 4 digits'

      });
    }
    else {
      this.serviceproxy.createOneBaseEmissionReductionDraftdataControllerEmissionReductioDraftDataEntity(emissionDraftData).
        subscribe((res => {
          if (res == null) {
            this.display3 = true;
          }
          if (res != undefined && res != null) {
            this.messageService.add({
              severity: 'success',
              summary: 'Succesfully Saved!!',
            });
          } else {
            this.messageService.add({
              severity: 'Error',
              summary: 'Error in Saving!!',
            });
          }
        }))
    }
  }

  onSetChange(event: any) {
    let ndcFilter: string[] = new Array();
    ndcFilter.push('country.id||$eq||' + this.countryId);
    ndcFilter.push('set.id||$eq||' + this.selectedtype.id);
    ndcFilter.push('sector.id||$eq||' + this.sectorId);
    this.serviceproxy
      .getManyBaseNdcControllerNdc(
        undefined,
        undefined,
        ndcFilter,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.id = res.data[0]?.id;
        this.dec = res.data[0]?.dec;
        this.name = res.data[0]?.name;
        this.test = 'Transport';
        this.data = res.data;
      });
  }
  addndc() { }
  close() {
    window.location.reload();
  }

  close1() { }

  targets() {
    this.display1 = true;
  }
  closeDialog() { }

}
