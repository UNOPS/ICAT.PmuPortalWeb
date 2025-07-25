import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCountryComponent } from './country-profile/edit-country/edit-country.component';
import { ClimateActionComponent } from './climate-action/climate-action/climate-action.component';
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

import { InstitutionsComponent } from './institutions/institutions.component';
import { InstitutionFormComponent } from './institutions/institution-form/institution-form.component';
import { CountryRegistryComponent } from './country-registry/country-registry.component';
import { AddCountryComponent } from './country-registry/add-country/add-country.component';
import { SectorComponent } from './sector/sector.component';
import { AddSectorComponent } from './sector/add-sector/add-sector.component';

import { RoleGuardService } from './auth/role-guard.service';
import { ViewCountryComponent } from './country-registry/view-country/view-country.component';
import { AssignMethodologyComponent } from './methodologies/assign-methodology/assign-methodology.component';
import { SetPasswordComponent } from './login/set-password/set-password.component';

export enum UserRoles {
  ICAT_ADMIN = 'ICAT Admin',
  ICAT_USER = 'ICAT User',
  PMU_ADMIN = 'PMU Admin',
  PMU_USER = 'PMU User',
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
  { path: 'reset-password', component: SetPasswordComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
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
    path: 'assign-methodologies',
    component: AssignMethodologyComponent,
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
    path: 'institution',
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
    path: 'institution-new',
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

  {
    path: 'country-registry',
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
