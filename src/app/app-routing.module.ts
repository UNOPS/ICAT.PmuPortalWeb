

import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCountryComponent } from './country-profile/edit-country/edit-country.component';
import { ClimateActionComponent } from './climate-action/climate-action/climate-action.component';
//import { ViewCountryComponent } from './country-profile/view-country/view-country.component';
import { CountryNdcComponent } from './country-ndc/country-ndc.component';
import { MethodologiesComponent } from './methodologies/methodologies.component';
import { ProjectInformationComponent } from './climate-action/project-information/project-information.component';
import { AddNdcComponent } from './country-ndc/add-ndc/add-ndc.component';
import { EditNdcComponent } from './country-ndc/edit-ndc/edit-ndc.component';


import { LoginLayoutComponent } from './login/login-layout/login-layout.component';


import { AuditComponent } from './audit/audit.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import { AllClimateActionComponent } from './all-climate-action/all-climate-action.component';



import { LearningMaterialComponent } from './learning-material/learning-material.component';







import { IaDashboardComponent } from './dashboard/ia-dashboard/ia-dashboard.component';
//import { LandingPageComponent } from './landing-page/landing-page.component';
//import { LoardMoreComponent } from './landing-page/loard-more/loard-more.component';




















import { InstitutionsComponent } from './institutions/institutions.component';
import { InstitutionFormComponent } from './institutions/institution-form/institution-form.component';
import { CountryRegistryComponent } from './country-registry/country-registry.component';
import { AddCountryComponent } from './country-registry/add-country/add-country.component';
import { SectorComponent } from './sector/sector.component';
import { AddSectorComponent } from './sector/add-sector/add-sector.component';


import { RoleGuardService } from './auth/role-guard.service';
import { ViewCountryComponent } from './country-registry/view-country/view-country.component';




export enum UserRoles {
  ICAT_ADMIN = 'ICAT Admin',
  ICAT_USER = 'ICAT User',
  PMU_ADMIN = 'PMU Admin',
  PMU_USER = 'PMU User',
  // TT = 'Technical Team',
  // DCT = 'Data Collection Team',
  // QC = 'QC Team',
  // INS_ADMIN = 'Institution Admin', 
  // DEO = 'Data Entry Operator',
}
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.ICAT_ADMIN,
        UserRoles.ICAT_USER,
        UserRoles.PMU_ADMIN,
        UserRoles.PMU_USER,
       
      ],
    },
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
//  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // redirect to `first-component`
  { path: 'login', component: LoginLayoutComponent },
  {
    path: 'user-list',
    component: UserListComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.ICAT_ADMIN,
        UserRoles.ICAT_USER,
        UserRoles.PMU_ADMIN,
        UserRoles.PMU_USER,
      ],
    },
  },
  {
    path: 'user',
    component: UserFormComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.ICAT_ADMIN,
        UserRoles.ICAT_USER,
        UserRoles.PMU_ADMIN,
        UserRoles.PMU_USER,
      ],
    },
  },
  {
    path: 'user-new',
    component: UserFormComponent,
    data: {
      expectedRoles: [
        UserRoles.ICAT_ADMIN,
        UserRoles.ICAT_USER,
        UserRoles.PMU_ADMIN,
        UserRoles.PMU_USER,
      ],
    },
  },
  // {
  //   path: 'qc',
  //   component: QualityCheckComponent,
  //   canActivate: [RoleGuardService],
  //   data: {
  //     expectedRoles: ['ccs-admin', 'ins-admin'],
  //   },
  // },
  {
    path: 'methodologies',
    component: MethodologiesComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.ICAT_ADMIN,
        UserRoles.ICAT_USER,
        UserRoles.PMU_ADMIN,
        UserRoles.PMU_USER,
      ],
    },
  },

  {
    path: 'instituion',
    component: InstitutionsComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.ICAT_ADMIN,
        UserRoles.ICAT_USER,
        UserRoles.PMU_ADMIN,
        UserRoles.PMU_USER,
      ],
    },
  },

  {
    path: 'instituion-new',
    component: InstitutionFormComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.ICAT_ADMIN,
        UserRoles.ICAT_USER,
        UserRoles.PMU_ADMIN,
      ],
    },
  },

  { path: 'country-registry', 
  component: CountryRegistryComponent,
  canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.ICAT_ADMIN,
        UserRoles.ICAT_USER,
        UserRoles.PMU_ADMIN,
        UserRoles.PMU_USER,
      ],
    },

},  

  { 
    path: 'add-country', 
    component: AddCountryComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.ICAT_ADMIN,
        UserRoles.ICAT_USER,
        UserRoles.PMU_ADMIN,
        UserRoles.PMU_USER,
      ],
    },
  }, 

  { 
    path: 'view-sectors', 
    component: SectorComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.ICAT_ADMIN,
        UserRoles.ICAT_USER,
        UserRoles.PMU_ADMIN,
        UserRoles.PMU_USER,
      ],
    },
  }, 

  { 
    path: 'add-sectors', 
    component: AddSectorComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.ICAT_ADMIN,
        UserRoles.ICAT_USER,
        UserRoles.PMU_ADMIN,
        UserRoles.PMU_USER,
      ],
    },
  },




  


  
  {
    path: 'view-country',
    component: ViewCountryComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.ICAT_ADMIN,
        UserRoles.ICAT_USER,
        UserRoles.PMU_ADMIN,
        UserRoles.PMU_USER,
      ],
    },
  },

  { 
    path: 'edit-country', 
    component: EditCountryComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.ICAT_ADMIN,
        UserRoles.ICAT_USER,
        UserRoles.PMU_ADMIN,
        UserRoles.PMU_USER,
      ],
    },
  },


  {
    path: 'climate-action',
    component: ClimateActionComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.ICAT_ADMIN,
        UserRoles.ICAT_USER,
        UserRoles.PMU_ADMIN,
        UserRoles.PMU_USER,
      ],
    },
  },


  // {
  //   path: 'all-climate-action',
  //   component: AllClimateActionComponent,
  //  canActivate: [RoleGuardService],
  //   data: {
  //     expectedRoles: [
  //       UserRoles.ICAT_ADMIN,
  //       UserRoles.ICAT_USER,
  //       UserRoles.PMU_ADMIN,
  //       UserRoles.PMU_USER,
  //     ],
  //   },
  // },
  
  // { path: 'project-information', component: ProjectInformationComponent },


  // { path: 'ndc', component: CountryNdcComponent },
  {
    path: 'activity',
    component: AuditComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.ICAT_ADMIN,
        UserRoles.ICAT_USER,
        UserRoles.PMU_ADMIN,
        UserRoles.PMU_USER,
      ],
    },
  },
  // { path: 'addndc', component: AddNdcComponent },
  // { path: 'editndc', component: EditNdcComponent },
  // {
  //   path: 'methodologies',
  //   component: MethodologiesComponent,
  //   canActivate: [RoleGuardService],
  //   data: {
  //     expectedRoles: [
  //       UserRoles.COUNTRY_ADMIN,
  //       UserRoles.SECTOR_ADMIN,
  //       UserRoles.MRV_ADMIN,
  //       UserRoles.TT,
  //     ],
  //   },
  // },

  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  
  
 
 
  
  
  {
    path: 'learning-material',
    component: LearningMaterialComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: [
        UserRoles.ICAT_ADMIN,
        UserRoles.ICAT_USER,
        UserRoles.PMU_ADMIN,
        UserRoles.PMU_USER,
      ],
    },
  },
 
  // { path: 'ca-result', component: CaResultComponent},
  
  
  
 // { path: 'landing-page', component: LandingPageComponent },
 // { path: 'loard-more', component: LoardMoreComponent },
 
  
  // { path: 'ia-dashboard', component: IaDashboardComponent},
  
  // {
  //   path: 'ia-dashboard',
  //   component: IaDashboardComponent,
  //   canActivate: [RoleGuardService],
  //   data: {
  //     expectedRoles: [UserRoles.INS_ADMIN, UserRoles.DEO],
  //   },
  // },
  // { path: 'ia-dashboard', component: IaDashboardComponent},
  
  // {
  //   path: 'ia-dashboard',
  //   component: IaDashboardComponent,
  //   canActivate: [RoleGuardService],
  //   data: {
  //     expectedRoles: [UserRoles.INS_ADMIN, UserRoles.DEO],
  //   },
  // },
  
 
 
 

 
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
