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

import {
  LazyLoadEvent,
} from 'primeng/api';

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
  styleUrls: ['./country-registry.component.css']
})
export class CountryRegistryComponent implements OnInit,AfterViewInit {

countryList: Country[] = [];
pcountryList: Country[] = [];

totalRecords: number = 0;
rows: number = 10;  // change this when you want to show more details in a page
//last: number = 5;
first = 0;


//public mapData: CountriesData = {};

mapData1: CountriesData={};
mapData2:  CountriesData={};

displayPosition: boolean = false;
position:string = 'top-right';
selectedCountryCode :string;
selectedMapCountry:any;
countryFilter: string[] = [];
loading: boolean;



  @ViewChild('op') overlay: any;


  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private projectProxy: ProjectControllerServiceProxy,
    private cdr: ChangeDetectorRef,

  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    console.log('user-tokenPayload=========', tokenPayload);
    let institutionId = tokenPayload.institutionId;

    
          
   this.countryFilter.push('Country.isSystemUse||$eq||' +1);
   if(institutionId != undefined){
    this.countryFilter.push('institution.id||$eq||' +institutionId);

   }


    // this.serviceProxy
    // .getManyBaseCountryControllerCountry(
    //   undefined,
    //   undefined,
    //   countryFilter,
    //   undefined,
    //   ["editedOn,DESC"],
    //   undefined,
    //   1000,
    //   0,
    //   0,
    //   0
    // ).subscribe((res: any) => {
    //   this.countryList = res.data;
    //  console.log("country listb is...",this.countryList);

    //   this.totalRecords = this.countryList.length;
    //   this.loading = false;

    //   console.log("totalRecords",this.totalRecords)
    //   for(let x = this.first; x< (this.first+this.rows); x++)
    //   {
    //     this.pcountryList.push(this.countryList[x]);
    //   }
    //   for(let c of this.countryList)
    //   {
    //     this.mapData2[c.code] = {value : 100};
    //   }
    //   console.log("mapdata==",this.mapData2)
    //   this.mapData1 = this.mapData2;

    // });


  
  
  }

  loadCustomers(event: LazyLoadEvent) {

    this.loading = true;


    this.serviceProxy
    .getManyBaseCountryControllerCountry(
      undefined,
      undefined,
      this.countryFilter,
      undefined,
      ["editedOn,DESC"],
      undefined,
      event.rows,
      event.first,
      0,
      0
    ).subscribe((res: any) => {
      this.pcountryList = res.data;
     console.log("country listb is...",this.countryList);

      this.totalRecords = this.pcountryList.length;
      this.loading = false;

      console.log("totalRecords",this.totalRecords)
      // for(let x = this.first; x< (this.first+this.rows); x++)
      // {
      //   this.pcountryList.push(this.countryList[x]);
      // }
      for(let c of this.countryList)
      {
        this.mapData2[c.code] = {value : 100};
      }
      console.log("mapdata==",this.mapData2)
      this.mapData1 = this.mapData2;

    });
  }





  toAddCountry()
  {
    this.router.navigate(['add-country']); 
  }

  // paginate(event:any) {
  //   //console.log(event);
  //   //event.first = Index of the first record
  //   //event.rows = Number of rows to display in new page
  //   this.first = event.first; //= Index of the first record
  //   this.rows = event.rows;    //= Number of rows to display in new page
  //   //this.page = event.page = Index of the new page
  //      //event.pageCount = Total number of pages
  //      this.pcountryList = [];
  //    for(let x = this.first; x< (this.first+this.rows); x++)
  //    {
  //      this.pcountryList.push(this.countryList[x]);
  //    }

  // }

  selectedCountry(event:any)
  {
   this.selectedCountryCode = event.country;
   this.selectedMapCountry = this.countryList.find((obj)=>obj.code == this.selectedCountryCode);
   // console.log("my selcted country",this.selectedMapCountry);
   // this.displayBasic = true;
    this.position = 'right';
    this.displayPosition = true;
    
  }

  editCountry(con: Country) {
    console.log('edit country', con);

    this.router.navigate(['/add-country'], { queryParams: { id: con.id } });
  }

  viewCountry(con: Country) {
    console.log('view country', con);

    this.router.navigate(['/view-country'], { queryParams: { id: con.id } });
  }
  

}
