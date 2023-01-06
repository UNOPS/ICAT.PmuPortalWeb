import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { IaDashboardComponent } from './ia-dashboard/ia-dashboard.component';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { GMap, GMapModule } from 'primeng/gmap';
import { CountriesMapModule } from 'countries-map';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import {MessagesModule} from 'primeng/messages';




@NgModule({
  declarations: [DashboardComponent, IaDashboardComponent],
  imports: [
    CommonModule,
    TableModule,
    ChartModule,
    GMapModule,
    CountriesMapModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    MessagesModule,
   
  ]
})
export class DashboardModule { 
  
}
