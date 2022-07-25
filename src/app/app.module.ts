import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
//import { NgImageSliderModule } from 'ng-image-slider';
import {PaginatorModule} from 'primeng/paginator';
import {ToggleButtonModule} from 'primeng/togglebutton';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditCountryComponent } from './country-profile/edit-country/edit-country.component';
import { ClimateActionComponent } from './climate-action/climate-action/climate-action.component';
// import { TokenInterceptor } from 'src/shared/token-interceptor ';
import { HttpClientJsonpModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CountriesMapModule } from 'countries-map';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { StepsModule } from 'primeng/steps';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { InputMaskModule } from 'primeng/inputmask';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ChartModule } from 'primeng/chart';
import { TreeModule } from 'primeng/tree';
import { TableModule } from 'primeng/table';
import { GMapModule } from 'primeng/gmap';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CarouselModule } from 'primeng/carousel';
// import { ProposeProjectComponent } from './propose-project/propose-project.component';
import { ViewCountryComponent } from './country-profile/view-country/view-country.component';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import { environment } from '../environments/environment';
import { CountryNdcComponent } from './country-ndc/country-ndc.component';
import {
  API_BASE_URL,
  DocumentControllerServiceProxy,
  ProjectControllerServiceProxy,
  MethodologyControllerServiceProxy,
  InstitutionControllerServiceProxy,
  ServiceProxy,
  LearningMaterialControllerServiceProxy,
  UsersControllerServiceProxy,
  AuthControllerServiceProxy,
  AuditControllerServiceProxy,
  SectorControllerServiceProxy,
  CountryControllerServiceProxy,
  // AssesmentControllerServiceProxy,
} from 'shared/service-proxies/service-proxies';
import { HttpClient } from '@angular/common/http';
import { ProjectInformationComponent } from './climate-action/project-information/project-information.component';
import { MethodologiesComponent } from './methodologies/methodologies.component';

import { AddNdcComponent } from './country-ndc/add-ndc/add-ndc.component';
import { EditNdcComponent } from './country-ndc/edit-ndc/edit-ndc.component';
import { DocumentUploadComponent } from './shared/document-upload/document-upload.component';
// import { ProposeProjectListComponent } from './propose-project-list/propose-project-list.component';
import { AuditComponent } from './audit/audit.component';
import { LoginLayoutComponent } from './login/login-layout/login-layout.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { LoginLayoutService } from './login/login-layout/login-layout.service';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { AllClimateActionComponent } from './all-climate-action/all-climate-action.component';
// import { ActiveClimateActionComponent } from './active-climate-action/active-climate-action.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserFormComponent } from './user/user-form/user-form.component';
// import { GhgImpactComponent } from './assess-ca/ghg-impact/ghg-impact.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { LearningMaterialComponent } from './learning-material/learning-material.component';
import { DocumentComponent } from './learning-material/document/document.component';
// import { ProposedResultComponent } from './climate-action-result/proposed-result/proposed-result.component';
// import { ActiveResultComponent } from './climate-action-result/active-result/active-result.component';
// import { ResultComponent } from './view-climate-action-results/proposed-result/result.component';
// import { CaResultComponent } from './view-climate-action-results/ca-result/ca-result.component';
// import { AllResultComponent } from './climate-action-result/all-result/all-result.component';
import {
  NbLayoutDirectionService,
  NbMenuModule,
  NbOverlay,
  NbOverlayModule,
  NbOverlayService,
  NbPositionBuilderService,
  NbSidebarModule,
  NbThemeModule,
  
  NbToastrModule,
  NbToastrService,
  NbLayoutModule,
} from '@nebular/theme';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MessagesModule } from 'primeng/messages';
// import { VehicalParameterComponent } from './component/vehical-parameter/vehical-parameter.component';
// import { RouteParameterComponent } from './component/route-parameter/route-parameter.component';
// import { FuelParameterComponent } from './component/fuel-parameter/fuel-parameter.component';
// import { PowerPlantParameterComponent } from './component/power-plant-parameter/power-plant-parameter.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { DashboardModule } from './dashboard/dashboard.module';
import { InstitutionsComponent } from './institutions/institutions.component';
import { InstitutionFormComponent } from './institutions/institution-form/institution-form.component';
import { CountryRegistryComponent } from './country-registry/country-registry.component';
import { AddCountryComponent } from './country-registry/add-country/add-country.component';
import { SectorComponent } from './sector/sector.component';
import { AddSectorComponent } from './sector/add-sector/add-sector.component';
import { RoleGuardService } from './auth/role-guard.service';
import { TokenInterceptor } from './shared/token-interceptor ';
import { SharedDataService } from 'shared/shared-data-services';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommonModule } from '@angular/common';

export function getRemoteServiceBaseUrl(): string {
  return environment.baseUrlAPI;
}
@NgModule({
  declarations: [
    AppComponent,
    // ProposeProjectComponent,
    EditCountryComponent,
    ClimateActionComponent,
    ViewCountryComponent,
    CountryNdcComponent,
    ProjectInformationComponent,
    MethodologiesComponent,
    AddNdcComponent,
    EditNdcComponent,
    DocumentUploadComponent,
    // ProposeProjectListComponent,
    AuditComponent,
    LoginLayoutComponent,
    ForgotPasswordComponent,
    LoginFormComponent,
    AllClimateActionComponent,
    // ActiveClimateActionComponent,
    UserListComponent,
    UserFormComponent,
    // GhgImpactComponent,
    LearningMaterialComponent,
    DocumentComponent,
    InstitutionsComponent,
    InstitutionFormComponent,
    CountryRegistryComponent,
    AddCountryComponent,
    SectorComponent,
    AddSectorComponent,
  
    // ResultComponent,
    // ProposedResultComponent,
    // ActiveResultComponent,
    // VehicalParameterComponent,
    // RouteParameterComponent,
    // FuelParameterComponent,
    // PowerPlantParameterComponent,
    // AllResultComponent,
    
  ],
  imports: [

    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    DashboardModule,
    PaginatorModule,
    MultiSelectModule,
    ToastModule,
    ButtonModule,
    DropdownModule,
    FileUploadModule,
    AutoCompleteModule,
    StepsModule,
    RadioButtonModule,
    CheckboxModule,
    CalendarModule,
    DialogModule,
    ListboxModule,
    TableModule,
    InputNumberModule,
    InputMaskModule,
    TabViewModule,
    AccordionModule,
    CardModule,
    SliderModule,
    ToggleButtonModule,
    SplitButtonModule,
    SelectButtonModule,
    TooltipModule,
    ProgressBarModule,
    ConfirmDialogModule,
    GMapModule,
    ChartModule,
    ProgressSpinnerModule,
    OverlayPanelModule,
    TreeModule,
    FlexLayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    MessagesModule,
    // MessageModule,
    ToastModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    CountriesMapModule,
    CarouselModule,
    ScrollPanelModule
  ],
  providers: [
    LoginLayoutService,
    ConfirmationService,
    ServiceProxy,
    LearningMaterialControllerServiceProxy,
    DocumentControllerServiceProxy,
    ConfirmationService,
    ProjectControllerServiceProxy,
    MethodologyControllerServiceProxy,
    InstitutionControllerServiceProxy,
    UsersControllerServiceProxy,
    AuthControllerServiceProxy,
    AuditControllerServiceProxy,
    SectorControllerServiceProxy,
    CountryControllerServiceProxy,
    // AssesmentControllerServiceProxy,
    RoleGuardService,
    SharedDataService,

    { provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl },
    HttpClientModule,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
