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


import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

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



@Component({
  selector: 'app-add-country',
  templateUrl: './add-country.component.html',
  styleUrls: ['./add-country.component.css']
})
export class AddCountryComponent implements OnInit, AfterViewInit {

  countryList: Country[] = [];
  sectorList: Sector[] = [];

  accessmodules: any[] = [
    { id: 1, name: "Climate Action" },
    { id: 2, name: "GHG Impact" },
    { id: 3, name: "MAC" },
    { id: 4, name: "Data Collection" },
    { id: 5, name: "Data Collection - GHG"  }
  ]

  selectedModules: any[] = [];
  modules: any[] = [];

  selectedSectors: Sector[] = [];
  //selectedCountry:Country = new Country();
  mapData1: CountriesData = {};
  mapData2: CountriesData = {};
  flagPath: string;
  //description:string;
  // region:string;
  editCountryId: any;
  isNewCountry: boolean = true;
  arr: any[] = []
  url = environment.baseSyncAPI + '/country';
  selectCountry: string = "Select a Country";


   selectedCountryCode :string;
   selectedMapCountry:any;
   displayPosition: boolean = false;
position:string = 'top-right';
  cou: Country = new Country();


  @ViewChild('op') overlay: any;
  cstaus: number = 0;

  constructor(

    private router: Router,
    private route: ActivatedRoute,


    private serviceProxy: ServiceProxy,
    private projectProxy: ProjectControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private countryProxy: CountryControllerServiceProxy,


  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }



  ngOnInit(): void {

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    console.log('user-tokenPayload=========', tokenPayload);
    let institutionId = tokenPayload.institutionId;


    let countryFilter: string[] = [];
    countryFilter.push('Country.IsSystemUse||$eq||' + 0);
    if(institutionId != undefined){
      countryFilter.push('institution.id||$eq||' +institutionId);
     }

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
        //  console.log("country listb is...",this.countryList);


      });



    this.serviceProxy
      .getManyBaseSectorControllerSector(
        undefined,
        undefined,
        undefined,
        undefined,
        ["editedOn,DESC"],
        undefined,
        1000,
        0,
        0,
        0
      ).subscribe((res: any) => {
        this.sectorList = res.data;
        console.log("sector listb is...", this.sectorList);


      });


    this.cou = new Country();
    
    this.route.queryParams.subscribe((params) => {
      this.editCountryId = params['id'];
      if (this.editCountryId && this.editCountryId > 0) {
        this.isNewCountry = false;

        this.countryProxy.getCountry(this.editCountryId)
          .subscribe((res: any) => {
            console.log('editCountry-------', res);
            this.cou = res;

            for(let x=0 ; x < this.cou.countrysector.length;x++){
              this.selectedSectors.push(this.cou.countrysector[x].sector);
            }
            console.log("selectedSectors-----",this.selectedSectors)
            this.onStatusChange(this.cou)
            if (this.cou.countryStatus == CountryStatus.Active) {
              this.cstaus = 1;

            }
            else {

              this.cstaus = 0;
            }
            if (this.cou.climateActionModule) {
              this.selectedModules.push({ id: 1, name: "Climate Action" })

            }
            if (this.cou.macModule) {
              this.selectedModules.push({ id: 3, name: "MAC" })

            }
            if (this.cou.ghgModule) {
              this.selectedModules.push({ id: 2, name: "GHG Impact" })

            }
            if (this.cou.dataCollectionModule) {
              this.selectedModules.push({ id: 4, name: "Data Collection" })

            }
            if (this.cou.dataCollectionGhgModule) {
              this.selectedModules.push({ id: 5, name: "Data Collection - GHG" })

            }

            this.modules = this.selectedModules.filter(m =>{ return m.name});
            console.log(this.modules)

            this.selectedModules = this.selectedModules.filter(m => { return m })

            console.log("selectedModulesxxxxxxxxxxxx====", this.selectedModules)



            if (this.editCountryId) {

              console.log("yyyyyyy",this.editCountryId)
              this.selectCountry = this.cou.name;
            }
            else {
              // console.log("yyyyyyy")

              this.selectCountry = "Select Country"
            }


            let mapData2: CountriesData = {};
            console.log()
            mapData2[this.cou.code] = { value: 1};
            this.mapData1 = mapData2;
          //  console

          });
      }
    });



    //nnnnnn

    // this.route.queryParams.subscribe((params) => {
    //   this.editCountryId = params['id'];
    //   if (this.editCountryId && this.editCountryId > 0) {
    //     this.isNewCountry = false;
    //     this.countryProxy
    //       .getCountry(
    //         this.editCountryId,

  //         });
  //       }
  //     });
      console.log("country", this.cou)

   }

  onStatusChange(event: any) {
    console.log(this.editCountryId ,'===================')
    if (this.editCountryId == undefined) {
      // console.log("cname111===", event.description)

      if (event != null || event != undefined) {

        let mapData2: CountriesData = {};
        //console.log(event);
        mapData2[event.code] = { value: 1000 };
        // console.log(mapData2);
        this.mapData1 = mapData2;
        this.cou.flagPath = event.flagPath;
        this.cou.description = event.description;
        this.cou.region = event.region;

      }
      else {
        this.mapData1 = {};
        this.flagPath = '';
        // this.region='';
        // this.description='';
        this.cou = new Country()
      }
    }
    else {
      console.log(event,'event===================')
    let mapData2: CountriesData = {};
    //console.log(event);
    
    // console.log(mapData2);
    this.mapData1 = mapData2;
    this.cou.flagPath = event.flagPath;
    this.cou.description = event.description;
    this.cou.region = event.region;
    console.log(this.cou)
    }

  }


  selectmod(event: any) {
    console.log("selectmod=====", event)
  }




  async saveCountry(userForm: NgForm) {
    {
      console.log('userForm================', userForm);


      if (this.isNewCountry) {
        console.log("new country")

        // console.log("clicked");
        // let cou = new Country();

        this.cou.id = this.cou.id;
        this.cou.description = this.cou.description
        this.cou.isSystemUse = true;
        this.cou.countryStatus = CountryStatus.Active;
        this.cou.registeredDate = moment(new Date());

        console.log("aaaaaaaaaaaaaaa", this.selectedModules)

        for (let x = 0; x < this.selectedModules.length; x++) {
          let selectModId = this.selectedModules[x].id;

          this.arr.push(selectModId);
        }
        console.log("selectedModArry===", this.arr)


        if (this.arr.includes(1)) {

          this.cou.climateActionModule = true;
        }
        else if (!this.arr.includes(1)) {

          this.cou.climateActionModule = false;

        }
        if (this.arr.includes(2)) {
          this.cou.ghgModule = true;

        }
        else if (!this.arr.includes(2)) {
          this.cou.ghgModule = false;
        }
        if (this.arr.includes(3)) {
          this.cou.macModule = true;

        }
        else if (!this.arr.includes(3)) {
          this.cou.macModule = false;

        } if (this.arr.includes(4)) {
          this.cou.dataCollectionModule = true;
        }
        else if (!this.arr.includes(4)) {
          this.cou.dataCollectionModule = false;
        }
        if (this.arr.includes(5)) {
          this.cou.dataCollectionGhgModule = true;
        }
        else if (!this.arr.includes(5)) {
          this.cou.dataCollectionGhgModule = false;
        }

        /////////////////////////

        let countrysectr: CountrySector[] = [];
        for (let x = 0; x < this.selectedSectors.length; x++) {
          console.log("yyyyyy")
          let cst = new CountrySector();
          cst.sector.id = this.selectedSectors[x].id;
          cst.country.id = this.cou.id;
          countrysectr.push(cst);
        }
        //////////////////////////// 
        this.cou.countrysector = countrysectr;
        console.log("countrysector====", this.cou.countrysector)

        console.log("pass-cou-----", this.cou);

        setTimeout(() => {
          this.serviceProxy
            .createOneBaseCountryControllerCountry(this.cou)
            .subscribe(async (res: any) => {

              console.log("savecountryRes===", res)
              this.messageService.add({
                severity: 'success',
                summary: 'Success.',
                detail: 'Successfully created the country',
        
              });

              // await axios.get(this.url)
              // this.router.navigate(['/country-registry']);
            });
        }, 1000);
        this.onBackClick();
      } else {

        console.log("edit countryyyyyyyyy")
        for (let x = 0; x < this.selectedModules.length; x++) {
          let selectModId = this.selectedModules[x].id;

          this.arr.push(selectModId);

        }

        console.log("selectedModArry===", this.arr)
        if (this.arr.includes(1)) {

          this.cou.climateActionModule = true;
        }
        else if (!this.arr.includes(1)) {

          this.cou.climateActionModule = false;

        }
        if (this.arr.includes(2)) {
          this.cou.ghgModule = true;

        }
        else if (!this.arr.includes(2)) {
          this.cou.ghgModule = false;
        }
        if (this.arr.includes(3)) {
          this.cou.macModule = true;

        }
        else if (!this.arr.includes(3)) {
          this.cou.macModule = false;

        } if (this.arr.includes(4)) {
          this.cou.dataCollectionModule = true;
        }
        else if (!this.arr.includes(4)) {
          this.cou.dataCollectionModule = false;

        }
        if (this.arr.includes(5)) {
          this.cou.dataCollectionGhgModule = true;
        }
        else if (!this.arr.includes(5)) {
          this.cou.dataCollectionGhgModule = false;

        }

        let countrysectr: CountrySector[] = [];
        for (let x = 0; x < this.selectedSectors.length; x++) {
          console.log("yyyyyy")
          let cst = new CountrySector();
          let sector =new Sector();
          let country = new Country();

          sector.id = this.selectedSectors[x].id;
          country.id =this.cou.id;
          cst.sector= sector;
          cst.country= country;
          let selectoedCountrySector =this.cou.countrysector.find((a)=> a.sectorId==this.selectedSectors[x].id);
          if(selectoedCountrySector){
            cst.id =selectoedCountrySector.id;
          }
          countrysectr.push(cst);
        }
        //////////////////////////// 
        this.cou.countrysector = countrysectr;

        this.serviceProxy.updateOneBaseCountryControllerCountry(this.cou.id, this.cou)
          .subscribe(

            async (res) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success.',
                detail: 'Successfully updated the country',
        
              });
              // await axios.get(this.url)
              setTimeout(async () => {
                await axios.get(this.url);
                this.onBackClick();
              },1000)
            },
            (error) => {
              alert('An error occurred, please try again.');
              // this.DisplayAlert('An error occurred, please try again.', AlertType.Error);

              console.log('Error', error);
            }
          );


      }



    }


  }



  async activateCountry(cou: Country) {

    if (this.cou.countryStatus == CountryStatus.Active) {
      console.log("accstatus", this.cou.countryStatus)


      this.cou.countryStatus = CountryStatus.Deactivated;
      console.log("accstatus", this.cou.countryStatus)

    } else if (this.cou.countryStatus == CountryStatus.Deactivated) {
      this.cou.countryStatus = CountryStatus.Active;


    }
    this.serviceProxy.updateOneBaseCountryControllerCountry(this.cou.id, this.cou)
      .subscribe(async (res) => {
        console.log('done............', res),
          // this.messageService.add({

          //   severity: 'Deactivated',
          //   summary: 'Country',
          //   detail:

          //     this.cou.countryStatus === CountryStatus.Active ?  ' is Activated' :  ' is Deactivated'
          //   ,
          //   closable: true
          // });


          this.confirmationService.confirm({
            message: this.cou.countryStatus === CountryStatus.Active ? 'Are you sure you want to activate '+ res.name + '?' : 'Are you sure you want to deactivate '+ res.name + '?',
            header: 'Confirmation',
            //acceptIcon: 'icon-not-visible',
            rejectIcon: 'icon-not-visible',
            rejectVisible: true,
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            accept: () => {
              this.onBackClick();
            },

            reject: () => { },
          });
          await axios.get(this.url)
      },
        (err) => {
          console.log('error............'),
            this.messageService.add({
              severity: 'error',
              summary: 'Error.',
              detail: 'Failed Deactiavted, please try again.',
              sticky: true,
            });
        }
      );
      await axios.get(this.url)
  }

  onBackClick() {
    console.log("kkkkkkkkkkkkkkkkkkkk")
    this.router.navigate(['/country-registry']);
  }
}