import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Ndc, ServiceProxy, SubNdc } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-edit-ndc',
  templateUrl: './edit-ndc.component.html',
  styleUrls: ['./edit-ndc.component.css']
})
export class EditNdcComponent implements OnInit {

  ndcname: any;
  ndceditname: boolean = false;
  ndcid: any;
  data: SubNdc[] = new Array();
  visibility2: boolean = false;
  visibility3: boolean = false;
  visibility5: boolean = false;

  subndcname: any;
  subndc: any;
  subndcs: string[];
  subndcs1: SubNdc[];
  Deactivate: string = "Delete";
  visibility1: boolean = false;
  constructor(private router: Router, private activateroute: ActivatedRoute, private serviceproxy: ServiceProxy) { }

  ngOnInit(): void {
    this.activateroute.queryParams.subscribe(params => {
      this.ndcname = params['ndcname'];
      this.ndcid = params['ndcid'];
    });

    let filter: string[] = new Array();
    filter.push('ndc.id||$eq||' + this.ndcid);

    this.serviceproxy.getManyBaseSubNdcControllerSubNdc(
      undefined,
      undefined,
      undefined,
      filter,
      undefined,
      undefined,
      1000,
      0,
      0,
      0
    ).subscribe((res => {
      this.data = res.data;
    }));

    this.serviceproxy.getOneBaseNdcControllerNdc(this.ndcid, undefined, undefined, undefined).subscribe((res => {
      if (res.status == 1) {
        this.Deactivate = "Deactivate";
        this.ndceditname = true;
      }
    }))
  }

  save() {
    let ndc = new Ndc();
    ndc.name = this.ndcname;
    ndc.subNdc = this.data;
    this.serviceproxy.updateOneBaseNdcControllerNdc(this.ndcid, ndc).subscribe((res => {
    }))


    for (let sub of this.data) {
      sub.ndc.id = this.ndcid;
      if (sub.id != undefined) {
        this.serviceproxy.updateOneBaseSubNdcControllerSubNdc(sub.id, sub).subscribe((res => {
        }))
      } else {
        this.serviceproxy.createOneBaseSubNdcControllerSubNdc(sub).subscribe((res => {
        }))
      }
    }
    this.visibility3 = true;
  }

  Back() {
    this.serviceproxy.getOneBaseNdcControllerNdc(this.ndcid, undefined, undefined, undefined).subscribe((res => {

      this.router.navigate(['/ndc'],
        { queryParams: { selectedtypeId: res.set.id } });
    }))

  }
  addsub() {
    let ndc = new SubNdc();
    this.data.push(ndc);
  }

  deletendc() {
    let ndc = new Ndc();
    this.serviceproxy.getOneBaseNdcControllerNdc(this.ndcid, undefined, undefined, undefined).subscribe((res => {
      if (res.status != 1) {
        ndc = res;
        if (res.subNdc.length != 0) {
          for (let d of this.data) {
            this.serviceproxy.deleteOneBaseSubNdcControllerSubNdc(d.id).subscribe((res => {
              this.serviceproxy.deleteOneBaseNdcControllerNdc(this.ndcid).subscribe((res => {
              }))
            }))
          }
        } else {
          this.serviceproxy.deleteOneBaseNdcControllerNdc(this.ndcid).subscribe((res => {
            'example';
          }))
        } this.visibility2 = true;
      } else {
        this.Deactivate = "Deactivate";
        this.serviceproxy.getOneBaseNdcControllerNdc(this.ndcid, undefined, undefined, undefined).subscribe((res => {
          res.status = 0;
          this.serviceproxy.updateOneBaseNdcControllerNdc(this.ndcid, res).subscribe((res => {
            this.serviceproxy.getManyBaseSubNdcControllerSubNdc(
              undefined,
              undefined,
              ['ndc.id||$eq||' + this.ndcid],
              undefined,
              undefined,
              undefined,
              1000,
              0,
              0,
              0
            ).subscribe((res => {
              for (let sub of res.data) {
                sub.status = 0;
                this.serviceproxy.updateOneBaseSubNdcControllerSubNdc(sub.id, sub).subscribe((res => {
                }))
              }
            }))
          }))
        }))
        this.visibility5 = true;
      }
    }))
  }

  deletesub() {
    this.serviceproxy.deleteOneBaseSubNdcControllerSubNdc(this.data[this.data.length - 1].id).subscribe((res => {
    }));

    this.data.splice(-1);
    this.visibility1 = true;
  }

  test() {
    this.router.navigate(['/ndc']).then(() => {
      window.location.reload();
    });
  }
}
