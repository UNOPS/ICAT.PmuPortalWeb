import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, FilterService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { filter } from 'rxjs/operators';
import { Methodology, MethodologyControllerServiceProxy, ServiceProxy, Sector, } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';
// import { environment } from 'environments/environment.prod';
import axios from "axios";
import { environment } from 'environments/environment';
@Component({
  selector: 'app-methodologies',
  templateUrl: './methodologies.component.html',
  styleUrls: ['./methodologies.component.css']
})
export class MethodologiesComponent implements OnInit, AfterViewInit {

  sectors: Sector[];
  sectorName: string[] = [];
  //sector: Sector = new Sector();

  mlist: Methodology[] = [];
  developper: string[] = [];
  methodologies: Methodology[];
  sectorList: Sector[] = [];
  // developerList:Developer[]=[];
  searchText: string;
  countryId: any = 1;

  selectSector: Sector;


  loading: boolean;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;

  userrole: any;
  @ViewChild('op') overlay: any;
  @ViewChild('opDR') overlayDR: any;

  searchBy: any = {
    text: null,
    version: null,
    sector: null,
    developedBy: null,
    applicablesector: null,
    document: null,
  };

  first = 0;


  constructor(
    private serviceProxy: ServiceProxy,
    private methodologyProxy: MethodologyControllerServiceProxy,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  @ViewChild("dt") table: Table;

  ngOnInit(): void {

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);

    this.userrole = tokenPayload.roles[0];

    this.serviceProxy
      .getManyBaseMethodologyControllerMethodology(
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

      )
      .subscribe((res: any) => {
        this.mlist = res.data;
        console.log('mlist===', this.mlist);

        for (let x of this.mlist) {

          if (!this.developper.includes(x.developedBy)) {
            this.developper.push(x.developedBy)
          }
          console.log("developerlist====", this.developper)

        }
      })



    this.serviceProxy
      .getManyBaseSectorControllerSector(
        ['name'],
        undefined,
        undefined,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        // for(let x of res.data){
        //   console.log("sectornames"+x)
        // }
        this.sectorList = res.data;
        console.log('sectorList', this.sectorList);
      });


  }




  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  loadgridData = (event: LazyLoadEvent) => {
    console.log('ioio', event);
    this.loading = true;
    this.totalRecords = 0;

    let sectorId = this.searchBy.sector ? this.searchBy.sector.id : 0;
    console.log("ssecId----", sectorId)
    let developedBy = this.searchBy.developedBy ? this.searchBy.developedBy : 0;
    console.log("sdevID----", developedBy)
    let filtertext = this.searchBy.text ? this.searchBy.text : '';

    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    setTimeout(() => {
      this.methodologyProxy
        .getMethoDetails(

          pageNumber,
          this.rows,

          filtertext,
          sectorId,
          developedBy
        ).subscribe((a) => {
          this.methodologies = a.items;
          console.log("metho", this.methodologies)

          this.totalRecords = a.meta.totalItems;
          this.loading = false;
        });
    }, 1);
  };

  async updateMethodologyStatus(meth: Methodology, aprovalStatus: number) {


    let url = environment.baseSyncAPI + '/methodology';
    // let status = this.projectApprovalStatus.find((a) => a.id === aprovalStatus);
    // project.status =
    //   status === undefined ? (null as any) : status;
    if (aprovalStatus === 1) {
     
      console.log("xxxxxxxxxxx" + meth.id, aprovalStatus);
      await this.confirmationService.confirm({

        message:
          'Are you sure to activate' +
          ' ?',
        accept: async () => {
          meth.isActive = aprovalStatus;
          console.log(aprovalStatus + "ddddddddddddd")
          await this.updateStatus(meth, aprovalStatus);

        },
        reject: () => {}
      });


      await axios.get(url)
    }
    else if (aprovalStatus === 2) {
      await this.confirmationService.confirm({

        message:
          'Are you sure to deactivate' +
          ' ?',
        accept: async () => {
          meth.isActive = aprovalStatus;
          console.log(aprovalStatus + "ddddddddddddd")
          await this.updateStatus(meth, aprovalStatus);

        },
        reject: () => {}
      });;
      await axios.get(url)
      // this.overlay.hide();
    }
    await axios.get(url)
  }

  async updateStatus(meth: Methodology, aprovalStatus: number) {
    let url = environment.baseSyncAPI + '/methodology';
    console.log("sssssssss" + meth, aprovalStatus)
    await this.serviceProxy
      .updateOneBaseMethodologyControllerMethodology(meth.id, meth)
      .subscribe(
        async (res) => {
          console.log(res);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail:
              aprovalStatus === 1 || aprovalStatus === 2
                ? meth.name +
                ' is successfully ' +
                (aprovalStatus === 1 ? 'Activate.' : 'Deactivate')
                : 'Data request sent successfully.',
            closable: true,
          });
          await axios.get(url)
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error.',
            detail: 'Internal server error, please try again.',
            sticky: true,
          });
        }
      );


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

  isLastPage(): boolean {
    return this.methodologies
      ? this.first === this.methodologies.length - this.rows
      : true;
  }

  isFirstPage(): boolean {
    return this.methodologies ? this.first === 0 : true;
  }

  onRedirect(meth: Methodology) {
    let docPath = meth.documents
    console.log("docPath...", docPath)
    window.location.href = docPath;
    // this.object_array[0][8].document;

  }

}
