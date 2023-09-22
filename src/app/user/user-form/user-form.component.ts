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

  isNewUser = true;
  editUserId: number;
  isEmailUsed = false;
  usedEmail = '';

  alertHeader = 'User';
  alertBody: string;
  showAlert = false;

  coreatingUser = false;
  uid: any;

  filter: string[] = [];
  filter2: string[] = [];
  countryUserList: any[] = [];
  instituteUserList: any[] = [];
  message: string;
  isDisableCuzCountry = false;

  constructor(
    private serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private userProxy: UsersControllerServiceProxy,
  ) { }

  utypeid(event: any) {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    const institutionId = tokenPayload.institutionId;

    this.uid = event;

    this.filter = [];

    if (this.uid?.id === 5) {
      this.filter.push('id||$eq||' + 6);
    } else {
      if (institutionId) {
        this.filter.push('id||$eq||' + institutionId);
      } else {
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
        0,
      )
      .subscribe((res) => {
        this.institutions = res.data;

        if (this.user?.institution) {
          this.institutions.forEach((ins) => {
            if (ins.id == this.user.institution.id) {
              if (['PMU Admin'].includes(tokenPayload.roles[0])) {
                this.institutions = [ins];
              }
              // this.user.institution = ins;
            }
          });
        }
      });
  }

  async ngOnInit(): Promise<void> {

   await this.serviceProxy
      .getManyBaseInstitutionControllerInstitution(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        1,
        0,
      )
      .subscribe((res) => {
        this.institutions = res.data;
        if (this.user?.institution) {
          this.institutions.forEach((ins) => {
            if (ins.id == this.user.institution.id) {
              this.user.institution = ins;
            }
          });
        }
      });

    this.user.userType = undefined!;
    this.user.mobile = '';
    this.user.telephone = '';

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);

    const institutionId = tokenPayload.institutionId;

    if (tokenPayload.roles[0] == 'PMU Admin') {
      this.filter2.push('id||$ne||' + 4) &
        this.filter2.push('id||$ne||' + 5) &
        this.filter2.push('id||$ne||' + 1);
    } else if (tokenPayload.roles[0] == 'PMU User') {
      this.filter2.push('id||$ne||' + 4) &
        this.filter2.push('id||$ne||' + 5) &
        this.filter2.push('id||$ne||' + 1) &
        this.filter2.push('id||$ne||' + 3);
    } else {
      this.filter2.push('id||$ne||' + 4);
    }

    await this.route.queryParams.subscribe((params) => {
      this.editUserId = params['id'];
      this.uid = this.editUserId;
      if (this.editUserId && this.editUserId > 0) {
        this.isNewUser = false;
         this.serviceProxy
          .getOneBaseUsersControllerUser(
            this.editUserId,
            undefined,
            undefined,
            0,
          )
          .subscribe((res: any) => {
            this.user = res;
            this.institutions.forEach((ins) => {
              
              if (ins.id == res.institution.id) {
                this.user.institution = ins;
              }
            });
          });
      }
    });

    this.serviceProxy
      .getManyBaseUserTypeControllerUserType(
        undefined,
        undefined,
        this.filter2,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res: any) => {
        this.userTypes = res.data;
      });

    

    const countryFilter: string[] = [];
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
        0,
      )
      .subscribe((res) => {
        this.countryList = res.data;
        this.countryList.push(this.user.country);
      });
  }

  onChangeUser(event: any) { }

  onChangeCountry(event: any) {
    const countryAndUserFilter: string[] = [];
    countryAndUserFilter.push('country.id||$eq||' + event.id) &
      countryAndUserFilter.push('userType.id||$eq||' + this.uid.id);
    this.serviceProxy
      .getManyBaseUsersControllerUser(
        undefined,
        undefined,
        countryAndUserFilter,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res: any) => {
        this.countryUserList = res.data;
        if (this.countryUserList.length > 0) {
          this.message =
            'Already have, You can not add more than one Country Admin for ' +
            this.countryUserList[0]?.country?.name;
          this.isDisableCuzCountry = true;
          this.messageService.add({
            severity: 'info',
            summary: 'Info.',
            detail: this.message,
          });
        } else {
          this.isDisableCuzCountry = false;
        }
      });
  }

  onChangeInstitutioon(event: any) {
    if (event) {
      const instituteAndUserFilter: string[] = [];
      instituteAndUserFilter.push('institution.id||$eq||' + event.id) &
        instituteAndUserFilter.push('userType.id||$eq||' + this.uid.id);
      this.serviceProxy
        .getManyBaseUsersControllerUser(
          undefined,
          undefined,
          instituteAndUserFilter,
          undefined,
          undefined,
          undefined,
          1000,
          0,
          0,
          0,
        )
        .subscribe((res: any) => {
          this.instituteUserList = res.data;
          if (this.instituteUserList.length > 0 && this.uid.id == 1) {
            this.message =
              'Already have, You can not add more than one PMU Admin for ' +
              this.instituteUserList[0]?.institution?.name;
            this.isDisableCuzCountry = true;
            this.messageService.add({
              severity: 'info',
              summary: 'Info.',
              detail: this.message,
            });
          } else {
            this.isDisableCuzCountry = false;
          }
        });
    }

  }

  async saveUser(userForm: NgForm) {
    if (userForm.valid) {
      if (this.isNewUser) {
        this.isEmailUsed = false;
        this.usedEmail = '';

        const tempUsers = await this.serviceProxy
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
            0,
          )
          .subscribe((res) => {
            if (res.data.length > 0) {
              this.isEmailUsed = true;
              this.usedEmail = res.data[0].email;
              this.confirmationService.confirm({
                message:
                  'Email address is already in use, please select a diffrent email address to create a new user.!',
                header: 'Error!',
                rejectIcon: 'icon-not-visible',
                rejectVisible: false,
                acceptLabel: 'Ok',
                accept: () => { },

                reject: () => { },
              });
            } else {
              this.user.username = this.user.email;

              this.user.status = 0;

              const userType = new UserType();
              userType.id = this.user.userType.id;
              this.user.userType = userType;

              this.coreatingUser = true;
              const url = environment.baseSyncAPI + '/user';
              this.serviceProxy
                .createOneBaseUsersControllerUser(this.user)
                .subscribe(
                  async (res) => {
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Success.',
                      detail: 'User is created successfully..',
                    });
                    setTimeout(() => {
                      this.router.navigate(['/user-list']);
                    }, 2000);

                    if (this.user.userType.id === 2) {
                      await axios.get(url);
                    }
                  },
                  (error) => {
                    this.coreatingUser = false;
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Error.',
                      detail: 'An error occurred, please try again.',
                    });
                  },
                  () => {
                    this.coreatingUser = false;
                  },
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
              });
              setTimeout(() => {
                this.router.navigate(['/user-list']);
              }, 2000);
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error.',
                detail: 'An error occurred, please try again.',
              });
            },
          );
      }
    }
  }

  onBackClick() {
    this.router.navigate(['/user-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message:
        this.user.status == 0
          ? 'Are you sure you want to deactivate the user?'
          : 'Are you sure you want to activate the user?',
      header: 'Activation Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.deactivateUser();
      },
      reject: () => { },
    });
  }

  deleteUser() {
    this.serviceProxy
      .deleteOneBaseUsersControllerUser(this.user.id)
      .subscribe((res) => {
        this.confirmationService.confirm({
          message: 'User is deleted successfully!',
          header: 'Delete Confirmation',
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
    const url = environment.baseSyncAPI + '/user';
    await this.userProxy
      .changeStatus(this.user.id, this.user.status == 0 ? 1 : 0)
      .subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Successfully ${this.user.status == 0 ? 'deactivated' : 'activated'
            }`,
        });
        this.user = res;
      });

      if(this.user.userType.id==2){
        await axios.get(url);
      }
   
  }
}
