import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartErrorEvent } from 'countries-map';
import { } from "googlemaps";
import { CountriesData } from 'countries-map';
import { Country, ServiceProxy, UserType } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { catchError, reduce, tap } from 'rxjs/operators';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  basicData: any;
  horizontalOptions: any//{ indexAxis: string; plugins: { legend: { labels: { color: string; }; }; }; scales: { x: { ticks: { color: string; }; grid: { color: string; }; }; y: { ticks: { color: string; }; grid: { color: string; }; }; }; };
  options: any;
  displayPosition: boolean = false;

  overlays: any[];
  mapData1: CountriesData = {};
  mapData2: CountriesData = {};
  src: string = "";
  coun: Country;
  src1: string = "";

  isusemeth:boolean=true;
  isuse:boolean=true;

  position: string = 'top-right';
  selectedCountryCode: string;
  selectedMapCountry: any;

  @ViewChild('op') overlay: any;

  countryList: any;
  count: number;
  userName: any;

  userChartData: any;
  methologyChartData: any;
  methologychartOptions:any;
  countries: Country[];
  selectedCountryForMethology: Country;
  slectedCountryForUsertype: Country;
  constructor(private serviceproxy: ServiceProxy,
    private http: HttpClient) { }

  ngOnInit(): void {

    this.options = {
      center: { lat: 7.119082288502541, lng: -73.120029012106 },
      zoom: 13
    };

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    let institutionId = tokenPayload.institutionId;

    console.log("institutionId==", institutionId)

    this.horizontalOptions = {
      indexAxis: 'y',
      plugins: {
          legend: {
              labels: {
                  color: '#495057'
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          },
          y: {
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          }
      }
  };


    // this.horizontalOptions = {
    //   indexAxis: 'x',
    //   plugins: {
    //     legend: {
    //       labels: {
    //         color: '#495057'
    //       }
    //     }
    //   },
    //   scales: {
    //     x: {
    //       ticks: {
    //         color: '#495057'
    //       },
    //       grid: {
    //         color: '#ebedef'
    //       }
    //     },
    //     y: {
    //       ticks: {
    //         color: '#495057'
    //       },
    //       grid: {
    //         color: '#ebedef'
    //       }
    //     }
    //   }
    // };

    this.getUserUsageChart(0);
    this.getMethologyUsageChart(0);



    let filter: string[] = new Array();
    filter.push('isSystemUse||$eq||' + 1);
    if (institutionId) {
      filter.push('institution.id||$eq||' + institutionId)
    }
    this.serviceproxy.getManyBaseCountryControllerCountry(
      undefined,
      undefined,
      filter,
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    ).subscribe((res => {
      this.countryList = res.data;
      console.log("country-list====", this.countryList)
      let count = 0;
      for (let c of res.data) {

        this.src1 = c.flagPath;
        //   this.mapData1 = {

        //       [c.code] : {value : 1, extra : {'sectorname': 'Transport', 'registeredDate' : String([c.createdOn])}}
        //   }

        this.mapData2[c.code] = { value: 1 };

        count++;
      }


      let countmem = 0;
      let filternew1: string[] = new Array();


      filternew1.push('isMember||$eq||' + 1);
      this.serviceproxy.getManyBaseCountryControllerCountry(
        undefined,
        undefined,
        filternew1,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      ).subscribe((res => {
        countmem = res.data.length;
        this.res(countmem);
        console.log('resss', countmem);
        this.basicData = {
          labels: [''],
          datasets: [


            {
              label: 'Total number of ICAT member countries',
              backgroundColor: '#42A5F5',
              data: [59],
            },
            {
              label: 'No of ICAT countries Using the tool',
              backgroundColor: '#1a069e',
              data: [count],
            },

          ]
        }
      }));



      let membercount = this.isMemberCount();
      this.mapData1 = this.mapData2;


    }))
    let filter1: string[] = new Array();
    filter1.push('isSystemUse||$eq||' + 1);
    this.serviceproxy.getManyBaseCountryControllerCountry(
      undefined,
      undefined,
      filter1,
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0)
      .subscribe(res => {
        console.log('res333333', res)
        this.countries = res.data;
      })



  }
 

  getUserUsageChart(countryId: number): void {
    let chart_url = environment.baseUrlCountryAPI + `/audit/userCount?countryId=${countryId}`;
    console.log('chart_url', chart_url)
    this.http.get<any[]>(chart_url).subscribe(res => {
      console.log('res=====', res)
      // this.userChartData = res;

      if(res.length>0){
        this.isuse=false
      }
     else{
        this.isuse=true
      }


      let labels: any[] = []
      let data: any[] = []
      res.map(a => {
        labels.push(a.au_userType)
        data.push(a.data)

      });

      this.userChartData = {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              "#96DED1",
              "#89CFF0",
              "#0000FF",
              '#0047AB',
              '#6495ED',
              '#00008B',
              '#6082B6',
              '#5D3FD3',
              '#CCCCFF',
              '#4169E1',
            ],

            hoverBackgroundColor: [
              "#F0FFFF",

            ]
          }
        ]
      };


    });


  }

  getMethologyUsageChart(countryId: number): void {
    let chart_url = environment.baseUrlCountryAPI + `/assesment/methologyCount?countryId=${countryId}`;
    console.log('countryId', countryId)
    this.http.get<any[]>(chart_url).subscribe(res => {
      console.log('res', res)
      let labels: any[] = []
      let data: any[] = []

      if(res.length>0){
        this.isusemeth=false
      }
     else{
        this.isusemeth=true
      }
      res.map(a => {
        // if(a.name.length >10){
        //   a.name = a.name.substring(0,20)+"..."
        // }
        labels.push(a.name)
        data.push(a.data)

      });

      this.methologyChartData = {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              "#96DED1",
              "#89CFF0",
              "#0000FF",
              '#0047AB',
              '#6495ED',
              '#00008B',
              '#6082B6',
              '#5D3FD3',
              '#CCCCFF',
              '#4169E1',
            ],

            hoverBackgroundColor: [
              "#F0FFFF",

            ]
          }
        ]
      };

      this.methologychartOptions={
 
        plugins: {
        
          legend: {
          
            // display:false,
            // align:'start',
              labels: {
                // color: 'rgb(255, 99, 132)',
                generateLabels:  function(chart: any){
                  console.log('work',chart)
                  var data = chart.data;
                  if (data.labels.length && data.datasets.length) {
                    return data.labels.map(function(label: any, i: string | number) {
                      var meta = chart.getDatasetMeta(0);
                      var style = meta.controller.getStyle(i);
                      return {
                        text: label.length >25?label.substring(0,25)+"...":label,
                        fillStyle: style.backgroundColor,
                        strokeStyle: style.borderColor,
                        lineWidth: style.borderWidth,
                        hidden: isNaN(data.datasets[0].data[i]) || meta.data[i].hidden,
                        // Extra data used for toggling the correct item
                        index: i
                      };
                    });
                  }
                  return [];
                },
              }
          },
      
      },
   
    
    
      }


    });


  }


  errorLoading = null;
  //   mapError(error: ChartErrorEvent): void {
  //     this.errorLoading = error;
  //   }
  mapReady(): void {
    console.log('Map ready');
  }
  onclick() {
    console.log('Mapppppp');
    this.src = this.src1;
  }

  selectedCountry(event: any) {
    this.selectedCountryCode = event.country;
    if (this.selectedCountryCode != null) {
      //  this.selectedMapCountry = this.countryList.find((obj: { code: any; })=>obj.code == this.selectedCountryCode);
      console.log("my selcted country", this.selectedCountryCode);
      let filter: string[] = new Array();
      filter.push('code||$eq||' + this.selectedCountryCode);
      this.serviceproxy.getManyBaseCountryControllerCountry(
        undefined,
        undefined,
        filter,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      ).subscribe((res => {
        this.selectedMapCountry = res.data.find((obj) => obj.code == this.selectedCountryCode);

      }))
    }

    console.log("my selcted country", event.country);
    // this.displayBasic = true;
    this.position = 'right';
    this.displayPosition = true;

  }


  isMemberCount(): number {
    let countmem = 0;
    let filternew1: string[] = new Array();
    filternew1.push('isMember||$eq||' + 1);
    this.serviceproxy.getManyBaseCountryControllerCountry(
      undefined,
      undefined,
      filternew1,
      undefined,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    ).subscribe((res => {
      countmem = res.data.length;
      this.res(countmem);

    }));

    return this.count;
  }

  res(count: number): number {
    this.count = count;
    return count;
  }
}

