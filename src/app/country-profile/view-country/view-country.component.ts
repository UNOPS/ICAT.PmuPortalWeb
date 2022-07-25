import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Country, Sector, ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-view-country',
  templateUrl: './view-country.component.html',
  styleUrls: ['./view-country.component.css']
})
export class ViewCountryComponent implements OnInit {
  country: Country = new Country();
  sectors: Sector[];
  tabs:any;
  countryId: number;

  // tabs: any;
  // countryname: 'Sri Lanka'

  constructor(private router: Router,
    private activateroute: ActivatedRoute,
    private serviceProxy: ServiceProxy) { }

  ngOnInit(): void {

    
    this.activateroute.queryParams.subscribe(params=>{
      console.log("params",params)
      if(params!==null){
        this.countryId = 1;
      }
    })
      // console.log("view country", this.countryId);
      // this.router.navigate(['/parameter'], { queryParams: { id: parameter.id } });
    
  
  this.serviceProxy
  .getOneBaseCountryControllerCountry(
    this.countryId,                        // country ID is request
    undefined,
    undefined,
    0,
  ).subscribe((res: any) => {
    this.country = res;
    console.log(this.country);
    this.countryId = this.country.id;
    console.log('########333');
    console.log(this.countryId);
  });





  // this.tabs = [{"name":"abc", "NDC":"abcNDC","nameEmission":"abcEmission"},{"name":"abc11","NDC":"abc11NDC","nameEmission":"abc11Emission"},{"name":"abc22","NDC":"abc22NDC","nameEmission":"abc22Emission"}];
  // this.countryId = this.country.id;  


  let countryFilter: string[] = new Array();
  // countryFilter.push(this.countryId);

  countryFilter.push('country.id||$eq||' + this.countryId);      // country id is the request

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
    0
  ).subscribe((res) => {
    console.log("sec",res);
    this.sectors=res.data;
    // this.sectors = res.data;
    // console.log(this.sectors);
  });
  }
edit(){
  this.router.navigate(['edit-country']);
}

ndc(){
  this.router.navigate(['ndc'])
}


}
