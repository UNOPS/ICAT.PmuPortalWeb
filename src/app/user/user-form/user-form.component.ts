import { Component, OnInit } from '@angular/core';
import {
  Country,
  Institution,
  ServiceProxy,
  User,
  UsersControllerServiceProxy,
  UserType,
} from 'shared/service-proxies/service-proxies';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Message } from 'primeng//api';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { flatten } from '@angular/compiler';
import decode from 'jwt-decode';
import { environment } from 'environments/environment';
import axios from 'axios';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class UserFormComponent implements OnInit {
  temp1: string;
  temp2: string;
  temp3: string;

  user: User = new User();

  userTypes: UserType[] = [];

  institutions: Institution[] = [];

  countryList: Country[];

  emptyObj: Institution;

  userTitles: { id: number; name: string }[] = [
    { id: 1, name: 'Mr.' },
    { id: 2, name: 'Mrs.' },
    { id: 3, name: 'Ms.' },
    { id: 4, name: 'Dr.' },
    { id: 5, name: 'Professor' },
  ];
  selecteduserTitle: { id: number; name: string };

  isNewUser: boolean = true;
  editUserId: number;
  isEmailUsed: boolean = false;
  usedEmail: string = '';

  alertHeader: string = 'User';
  alertBody: string;
  showAlert: boolean = false;

  coreatingUser: boolean = false;
  uid: any;

  filter: string[] = [];
  filter2: string[] = [];
  countryUserList:any[]=[];
  instituteUserList:any[]=[];
  message:string;
  isDisableCuzCountry:boolean = false;


  constructor(
    private serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private userProxy: UsersControllerServiceProxy
  ) { }

  utypeid(event: any) {

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    let institutionId = tokenPayload.institutionId;

    this.uid = event;
    console.log("uid------", this.uid)

    this.filter = [];

    if (this.uid.id === 5) {
      this.filter.push('id||$eq||' + 6);
      console.log("ICAT User is selected")
    }
    else {

      if (institutionId) {
        this.filter.push('id||$eq||' + institutionId);

      }
      else {
        this.filter.push('id||$ne||' + 6);


      }

    }


    this.serviceProxy
      .getManyBaseInstitutionControllerInstitution(
        undefined,
        undefined,
        this.filter,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        1,
        0
      )
      .subscribe((res) => {
        console.log('institutions res ============', res);
        this.institutions = res.data;
        console.log('this user============', this.user);

        if (this.user?.institution) {
          this.institutions.forEach((ins) => {
            if (ins.id == this.user.institution.id) {
              if (["PMU Admin"].includes(tokenPayload.roles[0])){
                this.institutions = [ins]
              }
              this.user.institution = ins;
              console.log('ins set =======================');
            }
          });
        }
        console.log('institutions============', this.institutions);
      });

  }



  ngOnInit(): void {
    this.user.userType = undefined!;
    this.user.mobile = '';
    this.user.telephone = '';


    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    console.log('tokenPayload=========', tokenPayload);
    let institutionId = tokenPayload.institutionId;

    if (tokenPayload.roles[0] == 'PMU Admin' ) {
      console.log("pmu admin here")

      this.filter2.push('id||$ne||' + 4) & this.filter2.push('id||$ne||' + 5) & this.filter2.push('id||$ne||' + 1)

    } else if (tokenPayload.roles[0] == 'PMU User'){
      this.filter2.push('id||$ne||' + 4) & this.filter2.push('id||$ne||' + 5) & this.filter2.push('id||$ne||' + 1)
      & this.filter2.push('id||$ne||' + 3)
    } else {
      this.filter2.push('id||$ne||' + 4)
    }

    // this.serviceProxy
    // .getManyBaseUsersControllerUser(
    //   undefined,
    //   undefined,
    //   undefined,
    //   undefined,
    //   undefined,
    //   undefined,
    //   1000,
    //   0,
    //   0,
    //   0
    // )
    // .subscribe((res) => {
    //   let us=[] = res.data;
    //   this.user =us.filter((a: any)=>{if(a.id==this.editUserId){
    //     return a;
    //   }})[0];
    //   console.log("filteredUser-----",  this.user )

    // });

    this.route.queryParams.subscribe((params) => {
      this.editUserId = params['id'];
      if (this.editUserId && this.editUserId > 0) {
        this.isNewUser = false;
        this.serviceProxy
          .getOneBaseUsersControllerUser(
            this.editUserId,
            undefined,
            undefined,
            0
          )
          .subscribe((res: any) => {
            console.log('Userrrrrrrxxx====', res);
            this.user = res;
            console.log('Userrrrrrrxxx====', this.user);

            this.institutions.forEach((ins) => {
              if (ins.id == this.user.institution.id) {
                this.user.institution = ins;
                console.log('ins set =======================');
              }
            });

          });
      }
    });

    this.serviceProxy
      .getManyBaseUserTypeControllerUserType(
        undefined,
        undefined,
        this.filter2,// ['id||$ne||4'],
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        console.log('userTypes res ============', res);
        this.userTypes = res.data;
        console.log('userTypes============', this.userTypes);
      });

    console.log("FFFFF", this.filter)

    this.serviceProxy
      .getManyBaseInstitutionControllerInstitution(
        undefined,
        undefined,
        undefined,// ['id||$ne||6'],
        undefined,
        undefined,//['name,ASC']
        undefined,
        1000,
        0,
        1,
        0
      )
      .subscribe((res) => {
        console.log('institutions res ============', res);
        this.institutions = res.data;
        if (this.user?.institution) {
          this.institutions.forEach((ins) => {
            if (ins.id == this.user.institution.id) {
              this.user.institution = ins;
              console.log('ins set =======================');
            }
          });
        }
        console.log('institutions============', this.institutions);
      });


    let countryFilter: string[] = [];
    countryFilter.push('Country.IsSystemUse||$eq||' + 1);
    countryFilter.push('Country.IsCA||$isnull');
    if (institutionId != undefined) {
      countryFilter.push('institution.id||$eq||' + institutionId);
    }


    this.serviceProxy
      .getManyBaseCountryControllerCountry(
        undefined,
        undefined,
        countryFilter,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        1,
        0
      )
      .subscribe((res) => {
        console.log("countryList=====", res);

        this.countryList = res.data
        this.countryList.push(this.user.country)
      });
  }



  onChangeUser(event: any) {
    //console.log(event);
  }

  onChangeCountry(event:any)
  {
    console.log("hi..",event);
    let countryAndUserFilter : string[]= [];
    countryAndUserFilter.push('country.id||$eq||' + event.id)&
    countryAndUserFilter.push('userType.id||$eq||' + this.uid.id);
    this.serviceProxy.
    getManyBaseUsersControllerUser(
     undefined,
     undefined,
     countryAndUserFilter,
     undefined,
     undefined,
     undefined,
     1000,
     0,
     0,
     0
    ).subscribe((res: any) => {
     this.countryUserList = res.data;
     if(this.countryUserList.length>0)
     {
       this.message = "Already have, You can not add more than one Country Admin for "+this.countryUserList[0]?.country?.name
       this.isDisableCuzCountry = true;
       this.messageService.add({
        severity: 'info',
        summary: 'Info.',
        detail: this.message,
        //sticky: true,
      });
     }
     else
     {
       this.isDisableCuzCountry = false;
     }


    console.log("projectStatusList....",res.data)
   });

  }


  onChangeInstitutioon(event:any)
  {
    console.log("hi..",this.uid.id);
    let instituteAndUserFilter : string[]= [];
    instituteAndUserFilter.push('institution.id||$eq||' + event.id)&
    instituteAndUserFilter.push('userType.id||$eq||' + this.uid.id);
    this.serviceProxy.
    getManyBaseUsersControllerUser(
     undefined,
     undefined,
     instituteAndUserFilter,
     undefined,
     undefined,
     undefined,
     1000,
     0,
     0,
     0
    ).subscribe((res: any) => {
     this.instituteUserList = res.data;
     if(this.instituteUserList.length>0)
     {
       this.message = "Already have, You can not add more than one PMU Admin for "+this.instituteUserList[0]?.institution?.name
       this.isDisableCuzCountry = true;
       this.messageService.add({
        severity: 'info',
        summary: 'Info.',
        detail: this.message,
        //sticky: true,
      });
     }
     else
     {
       this.isDisableCuzCountry = false;
     }


   
   });

  }



  async saveUser(userForm: NgForm) {
    console.log('userForm================', userForm);
    // this.messageService.add({
    //   severity: 'success',
    //   summary: 'Service Message',
    //   detail: 'Via MessageService',
    // });

    if (userForm.valid) {
      if (this.isNewUser) {
        this.isEmailUsed = false;
        this.usedEmail = '';

        let tempUsers = await this.serviceProxy
          .getManyBaseUsersControllerUser(
            undefined,
            undefined,
            ['email||$eq||' + this.user.email],
            undefined,
            ['firstName,ASC'],
            ['institution'],
            1,
            0,
            0,
            0
          )
          .subscribe((res) => {
            if (res.data.length > 0) {
              this.isEmailUsed = true;
              this.usedEmail = res.data[0].email;
              // alert("Email address is already in use, please select a diffrent email address to create a new user.")
              this.confirmationService.confirm({
                message:
                  'Email address is already in use, please select a diffrent email address to create a new user.!',
                header: 'Error!',
                //acceptIcon: 'icon-not-visible',
                rejectIcon: 'icon-not-visible',
                rejectVisible: false,
                acceptLabel: 'Ok',
                accept: () => {
                  //this.onBackClick();
                },

                reject: () => { },
              });
            } else {
              // create user
              this.user.username = this.user.email;

              console.log("emaillll=======", this.user.email)


              this.user.status = 0;

              // if (this.user.institution.id === 6) {
              //   console.log("check6")
              //   this.user.institution.id = 6;

              // }

              console.log("innn=======", this.user.institution)


              let userType = new UserType();
              userType.id = this.user.userType.id;
              this.user.userType = userType;

              console.log('desi======', this.user)
              // let insTemp = this.user.institution
              // this.user.institution = new Institution();
              // this.user.institution.id = insTemp.id;

              this.coreatingUser = true;
              let url = environment.baseSyncAPI + '/user';
              this.serviceProxy
                .createOneBaseUsersControllerUser(this.user)
                .subscribe(
                  async (res) => {
                    //window.alert("hiii")
                    console.log("createdUser====", res)

                    this.messageService.add({
                      severity: 'success',
                      summary: 'Success.',
                      detail: 'User is created successfully..',
                      //sticky: true,
                    });
                    setTimeout(() => {
                      this.router.navigate(['/user-list']);
                    }, 2000);
                    
                    // this.confirmationService.confirm({
                    //   message: 'User is created successfully!',
                    //   header: 'Confirmation',
                    //   //acceptIcon: 'icon-not-visible',
                    //   rejectIcon: 'icon-not-visible',
                    //   rejectVisible: false,
                    //   acceptLabel: 'Ok',
                    //   accept: () => {
                      
                    //     this.onBackClick();
                    //   },

                    //   reject: () => { },
                    // });
                    if (this.user.userType.id === 2) {
                      console.log("createdUser++++", this.user.userType.id)
                      await axios.get(url)
                    }
                     

                  },
                  (error) => {
                    this.coreatingUser = false;
                    // alert('An error occurred, please try again.');
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Error.',
                      detail: 'An error occurred, please try again.',
                      //sticky: true,
                    });
                    console.log('Error', error);
                  },
                  () => {
                    this.coreatingUser = false;
                  }
                );
            }
          });


      } else {

        this.serviceProxy
          .updateOneBaseUsersControllerUser(this.user.id, this.user)
          .subscribe(
            (res) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success.',
                detail: 'User is updated successfully..',
                //sticky: true,
              });
              setTimeout(() => {
                this.router.navigate(['/user-list']);
              }, 2000);
              // this.confirmationService.confirm({
              //   message: 'User is updated successfully!',
              //   header: 'Confirmation',
              //   //acceptIcon: 'icon-not-visible',
              //   rejectIcon: 'icon-not-visible',
              //   rejectVisible: false,
              //   acceptLabel: 'Ok',
              //   accept: () => {
              //     this.messageService.add({
              //       severity: 'success',
              //       summary: 'Success.',
              //       detail: 'User is Updated successfully',
              //       sticky: true,
              //     });
              //     this.onBackClick();
              //   },

              //   reject: () => { },
              // });
            },
            (error) => {
              // alert('An error occurred, please try again.');
              this.messageService.add({
                severity: 'error',
                summary: 'Error.',
                detail: 'An error occurred, please try again.',
                //sticky: true,
              });
              // this.DisplayAlert('An error occurred, please try again.', AlertType.Error);

              console.log('Error', error);
            }
          );
      }
    }
  }

  onBackClick() {
    this.router.navigate(['/user-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: this.user.status == 0 ? 'Are you sure you want to deactivate the user?' :
        'Are you sure you want to activate the user?',
      header: 'Activation Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.deactivateUser();
      },
      reject: () => { },
    });
    // this.router.navigate(['/user-list']);
  }

  deleteUser() {
    this.serviceProxy
      .deleteOneBaseUsersControllerUser(this.user.id)
      .subscribe((res) => {
        //this.DisplayAlert('Deleted successfully.', AlertType.Message);
        this.confirmationService.confirm({
          message: 'User is deleted successfully!',
          header: 'Delete Confirmation',
          //acceptIcon: 'icon-not-visible',
          rejectIcon: 'icon-not-visible',
          rejectVisible: false,
          acceptLabel: 'Ok',
          accept: () => {
            this.onBackClick();
          },

          reject: () => { },
        });
      });
  }



  async deactivateUser() {
    let url = environment.baseSyncAPI + '/user';
    this.userProxy.changeStatus(this.user.id, this.user.status == 0 ? 1 : 0).subscribe(res => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully ${this.user.status == 0 ? 'deactivated' : 'activated'}` });
      this.user = res;


    });


    await axios.get(url)

  }
}
