import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Country, IInstitution, Institution, InstitutionControllerServiceProxy, ServiceProxy, User } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-institutions',
  templateUrl: './institutions.component.html',
  styleUrls: ['./institutions.component.css']
})
export class InstitutionsComponent implements OnInit, AfterViewInit {


 // getSkillNames = (user: any): string =>  user.map(({firstName}:{firstName:string}) => firstName).join(', ');
  
  
  name:string;

 
  institutions: Institution[];

  
  countryList: Country[];
  insCountryList: Country[];

  loading: boolean;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;

  searchBy: any = {
    text: null,
    country: null

  };

  first = 0;

  constructor(private serviceProxy: ServiceProxy,
    private institutionProxy: InstitutionControllerServiceProxy, private cdr: ChangeDetectorRef,  private router: Router) { }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  @ViewChild("dt") table: Table;

  ngOnInit(): void {
    

    
    // this.serviceProxy
    //   .getManyBaseInstitutionControllerInstitution(
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   ).subscribe((res: any) => {
    //      this.institutions = res.data;
    //     console.log("ccccc",res.data)

    //     console.log("UUUU", this.institutions[0].countries)

    //     this.totalRecords = res.totalRecords;

    //     console.log('institutions=====', this.institutions)

    //     if (res.totalRecords !== null) {
    //       this.last = res.count;
    //     } else {
    //       this.last = 0;
    //     }
    //   });

    this.serviceProxy
      .getManyBaseCountryControllerCountry(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0

      ).subscribe((res: any) => {

        this.countryList = res.data;
        this.countryList = this.countryList.filter(a=>a.institution&&a.institution.id)
        console.log("this.countryList",this.countryList)
      });

  }

  onCountryChange(event: any) {
    this.onSearch();
  }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;


    this.loadgridData(event);
  }

  loadgridData = (event: LazyLoadEvent) => {

    this.loading = true;
    this.totalRecords = 0;

    let filtertext = this.searchBy.text ? this.searchBy.text : '';
    let countryId = this.searchBy.country ? this.searchBy.country.id : 0;



    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;

    setTimeout(() => {
      this.institutionProxy
        .getInstiDetails(
          pageNumber,
          this.rows,
          filtertext,
          countryId,

        ).subscribe((a) => {
          console.log('VVVV',a)
          this.institutions = a.items;
          // console.log('VVVV',this.institutions)
          this.totalRecords = a.meta.totalItems;
          console.log('totalrecords==',this.totalRecords)
          this.loading = false;
        });
    }, 1);
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }
  getCountries(insId:number) {

    this.insCountryList=[]
     this.serviceProxy
      .getOneBaseInstitutionControllerInstitution(
        insId,
        undefined,
        undefined,
        undefined,
       
        
      ).subscribe((res: any) => {
        this.insCountryList=res.countries;
        console.log('work',res)
      })

  }

  // isLastPage(): boolean {
  //   return this.institutions
  //     ? this.first === this.institutions.length - this.rows
  //     : true;
  // }

  // isFirstPage(): boolean {
  //   return this.institutions ? this.first === 0 : true;
  // }

  new() {
    this.router.navigate(['/instituion-new']);
  }

  editInstitution(institution: Institution) {
    console.log('edit institution', institution);
   // let isedit:boolean = true;

    // this.router.navigate(['/instituion'], { queryParams: { id: institution.id , isEdit:isedit} });
    this.router.navigate(['/instituion-new'], { queryParams: { id: institution.id} });
  }

  testfun(){
    console.log('ekjkkjk');

  }

}
