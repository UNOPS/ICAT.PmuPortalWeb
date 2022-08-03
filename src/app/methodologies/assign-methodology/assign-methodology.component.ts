import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from 'environments/environment';
import { TreeNode } from 'primeng/api';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  Country,
  CountryControllerServiceProxy,
  CountrySector,
  CountryStatus,
  Methodology,
  MethodologyData,
  Project,
  ProjectApprovalStatus,
  ProjectControllerServiceProxy,
  ProjectOwner,
  ProjectStatus,
  Sector,
  ServiceProxy,

} from 'shared/service-proxies/service-proxies';

interface City {
  name: string;
  code: string;
}
interface Countryy {
  name: string;
  code: string;
}
@Component({
  selector: 'app-assign-methodology',
  templateUrl: './assign-methodology.component.html',
  styleUrls: ['./assign-methodology.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class AssignMethodologyComponent implements OnInit, AfterViewInit {

  countryList: Country[] = [];
  selectedSectors: Sector[] = [];
  selectedMethodSelected: MethodologyData[];
  methodologyList: MethodologyData[] = [];
  countryMethList: Methodology[] = [];
  oldCountryMeth: Methodology[] = [];
  oldMethName = new Array();
  cou: Country = new Country();
  country: Country;
  sector: Sector;
  countryId: number;
  sectorId: number;

  constructor(
    private serviceProxy: ServiceProxy,
    private countryProxy: CountryControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private messageService: MessageService,
  ) {

  }
  // ngAfterViewInit(): void {
  //   throw new Error('Method not implemented.');
  // }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  select(event: any) {
    console.log("selectmod=====", event)
  }
  selectCoun(event: any) {

    this.countryId = event.id
    this.country = event;


    this.countryProxy.getCountry(event.id).subscribe((res: any) => {
      this.cou = res;
      this.selectedSectors = [];
      for (let x = 0; x < this.cou.countrysector.length; x++) {
        this.selectedSectors.push(this.cou.countrysector[x].sector);
      }
    });


  }


  async selectMeth(event: any) {
    this.sectorId = event.id
    let methFilter: string[] = [];
    this.methodologyList = [];
    let filter: string[] = new Array();
    filter.push('Methodology.countryId||$eq||' + this.countryId);

    methFilter.push('MethodologyData.sectorId||$eq||' + event.id);

    await this.serviceProxy.getManyBaseMethodologyDataControllerMethodologyData(
      undefined,
      undefined,
      undefined,
      methFilter,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    ).subscribe((res: any) => {
      this.methodologyList = res.data;
    });

    this.serviceProxy.getManyBaseMethodologyControllerMethodology(
      undefined,
      undefined,
      undefined,
      filter,
      undefined,
      undefined,
      1000,
      0,
      event.id,
      0
    ).subscribe((ress: any) => {
      this.selectedMethodSelected = [];
      this.oldCountryMeth = ress.data;
      this.oldCountryMeth.forEach(a => {
        if (!this.oldMethName.includes(a.name)) {
          this.oldMethName.push(a.name)
        }
        if (a.sector) {
          this.selectedSectors.forEach(b => {
            if (a.sector.id == b.id && a.isActive == 1) {
              this.countryMethList.push(a)
            }
          })
        }
      })

      this.countryMethList.forEach(p1 => {
        if (p1.method) {
          this.methodologyList.forEach(a => {
            if (a.id == p1.method.id) {
              this.selectedMethodSelected.push(a);
            }
          })
        }
      })

    });

    // await 
  }


  onBackClick() {
    this.router.navigate(['/dashboard']);
  }


  async saveClick() {
    let url = environment.baseSyncAPI + '/methodology';

    await this.oldCountryMeth.forEach(async old => {
      old.isActive = 2;
      this.serviceProxy.updateOneBaseMethodologyControllerMethodology(old.id, old).subscribe((res) => {
        console.log('done++++')
      });

    });

    setTimeout(async () => {
      await this.selectedMethodSelected.forEach(async a => {

        if (!this.oldMethName.includes(a.name)) {
          let newone = new Methodology()
          newone.editedBy = a.editedBy;
          newone.editedOn = a.editedOn;
          newone.status = a.status;
          newone.version = a.version;
          newone.name = a.name;
          newone.displayName = a.displayName;
          newone.developedBy = a.developedBy;
          newone.parentId = a.parentId;
          newone.applicableSector = a.applicableSector;
          newone.isActive = 1
          newone.easenessOfDataCollection = a.easenessOfDataCollection;
          newone.country = this.country;
          newone.sector = a.sector;
          newone.mitigationActionType = a.mitigationActionType;
          newone.applicability = a.applicability;
          newone.transportSubSector = a.transportSubSector;
          newone.upstream_downstream = a.upstream_downstream;
          newone.ghgIncluded = a.ghgIncluded;
          newone.documents = a.documents;

          newone.method = a;
          await this.serviceProxy.createOneBaseMethodologyControllerMethodology(newone).subscribe((res) => {
            console.log("done")

          });
          // await axios.get(url)
        }
        else {
          await this.oldCountryMeth.forEach(async old => {
            if (old.name == a.name && old.country.id == this.country.id) {
              old.isActive = 1;
              await this.serviceProxy.updateOneBaseMethodologyControllerMethodology(old.id, old).subscribe((res) => {
                console.log("done")
              })

            }
          })
        }

      });
      this.messageService.add({
        severity: 'success',
        summary: 'Success.',
        detail: 'Methodologies have been assigned successfully',

      });
      setTimeout(async () => {
        this.router.navigate(['/methodologies']);
        await axios.get(url)
      },750)


    }, 1000);



  }


  ngOnInit(): void {

    let countryFilter: string[] = [];
    countryFilter.push('Country.IsSystemUse||$eq||' + 1);

    this.serviceProxy
      .getManyBaseCountryControllerCountry(
        undefined,
        undefined,
        countryFilter,
        undefined,
        ["editedOn,DESC"],
        undefined,
        1000,
        0,
        0,
        0
      ).subscribe((res: any) => {
        this.countryList = res.data;
        // console.log("country", this.countryList);


      });


  }


  async saveMethod(assignMethodology: NgForm) {

  }
}
