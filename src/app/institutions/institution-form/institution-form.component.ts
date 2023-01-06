import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Country, Institution, InstitutionControllerServiceProxy, InstitutionType, ServiceProxy } from 'shared/service-proxies/service-proxies';
import decode from 'jwt-decode';

@Component({
  selector: 'app-institution-form',
  templateUrl: './institution-form.component.html',
  styleUrls: ['./institution-form.component.css']
})
export class InstitutionFormComponent implements OnInit {

  //selectedTypeList: string[] = [];
  selectedTypeList: Institution[] = [];
  
  

  institution: Institution = new Institution();

  country: Country = new Country();

  countryList: Country[];

  listc: Country[] = [];//not assigned list

  editInstitutionId: number = 0;

  isNewInstitution: boolean = true;


  getSelectedApproach() {

  }

  @ViewChild('op') overlay: any;



  constructor(private serviceProxy: ServiceProxy, private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private institutionProxy: InstitutionControllerServiceProxy,
    private router: Router,
    private messageService: MessageService) { }

  ngOnInit(): void {

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    console.log('tokenPayload=========', tokenPayload);
    let institutionId = tokenPayload.institutionId;

    this.serviceProxy
      .getManyBaseInstitutionTypeControllerInstitutionType(
        undefined,
        undefined,
        ['id||$eq||1'],
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0
      ).subscribe((res: any) => {
        //this.selectedTypeList[0] = res.data[1];
        this.selectedTypeList = res.data;

        console.log('institutionTypes======', res.data[0]);

      });

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

        console.log("countryList======", this.countryList)

        for (let i in this.countryList) {
          if (this.countryList[i].institution?.id == null) {

            this.listc.push(this.countryList[i]);
          }
        }


      });


    //edit institute
    this.route.queryParams.subscribe((params) => {
      this.editInstitutionId = params['id'];

      if (this.editInstitutionId > 0) {
        this.isNewInstitution = false;

        this.serviceProxy
          .getOneBaseInstitutionControllerInstitution(
            this.editInstitutionId,
            undefined,
            undefined,
            0
          ).subscribe((res) => {
            this.institution = res;
            console.log('rrrr', res);
            this.listc = res.countries
          });

      }
    })



  }

  saveForm(formData: NgForm) {

    if (formData.valid) {
      if (this.isNewInstitution) {
        console.log("KKK", this.institution)
        this.serviceProxy
          .createOneBaseInstitutionControllerInstitution(this.institution)
          .subscribe(
            (res) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail:
                  this.institution.name +
                  ' has saved successfully ',
                closable: true,
              });

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


        console.log("PPPP", formData);


      } else {

        this.serviceProxy
          .updateOneBaseInstitutionControllerInstitution(this.institution.id, this.institution)
          .subscribe(
            (res) => {
              console.log("PPPP111", );
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail:
                  this.institution.name +
                  ' is updated successfully ',
                closable: true,

              });

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
    }

  }

  onBackClick() {
    this.router.navigate(['/instituion']);
  }


  activateInstitution(instituion: Institution) {

    console.log('sta', this.institution.status)

    if (this.institution.status == 1) {

      let statusUpdate = 0;
      this.institution.status = statusUpdate;
    }
    else if (this.institution.status == 0) {
      let statusUpdate = 1;
      this.institution.status = statusUpdate;

    }

    console.log("ACC", this.institution.status)

    this.serviceProxy
      .updateOneBaseInstitutionControllerInstitution(this.institution.id, this.institution)
      .subscribe((res) => {
        console.log("PPPP111222");
        this.confirmationService.confirm({
          message: this.institution.status === 0 ? this.institution.name + ' is Activated' : this.institution.name + ' is Deactivated',
          header: 'Confirmation',
          //acceptIcon: 'icon-not-visible',
          rejectIcon: 'icon-not-visible',
          rejectVisible: false,
          acceptLabel: 'Ok',
          accept: () => {
            this.onBackClick();
          },

          reject: () => { },
        });
          // this.messageService.add({
          //   severity: 'success',
          //   summary: 'Success',
          //   detail:

          //     this.institution.status === 0 ? this.institution.name + ' is Activated' : this.institution.name + ' is Deactivated'
          //   ,
          //   closable: true,
          // });
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

  }


}
