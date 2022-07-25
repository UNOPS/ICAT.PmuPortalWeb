import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-ia-dashboard',
  templateUrl: './ia-dashboard.component.html',
  styleUrls: ['./ia-dashboard.component.css'],
})
export class IaDashboardComponent implements OnInit {
  //   basicData: any;
  //   horizontalOptions: any;
  //   lineStylesData: any;
  //   basicOptions: any;
  //   config: AppConfig;
  //   constructor() { }
  ngOnInit(): void {
    //   this.basicData = {
    //     labels: ['Pending data requests', 'Pending data entry', 'Pending data review'],
    //     datasets: [
    //         {
    //             label: 'My First dataset',
    //             backgroundColor: '#42A5F5',
    //             data: [65, 59, 80, 81, 56, 55, 40]
    //         },
    //     ]
  }
  //   this.horizontalOptions = {
  //     indexAxis: 'y',
  //     plugins: {
  //         legend: {
  //             labels: {
  //                 color: '#495057'
  //             }
  //         }
  //     },
  //     scales: {
  //         x: {
  //             ticks: {
  //                 color: '#495057'
  //             },
  //             grid: {
  //                 color: '#ebedef'
  //             }
  //         },
  //         y: {
  //             ticks: {
  //                 color: '#495057'
  //             },
  //             grid: {
  //                 color: '#ebedef'
  //             }
  //         }
  //     }
  // };
  // this.lineStylesData = {
  //     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  //     datasets: [
  //         {
  //             label: 'First Dataset',
  //             data: [65, 59, 80, 81, 56, 55, 40],
  //             fill: false,
  //             tension: .4,
  //             borderColor: '#42A5F5'
  //         },
  //         {
  //             label: 'Second Dataset',
  //             data: [28, 48, 40, 19, 86, 27, 90],
  //             fill: false,
  //             borderDash: [5, 5],
  //             tension: .4,
  //             borderColor: '#66BB6A'
  //         },
  //         {
  //             label: 'Third Dataset',
  //             data: [12, 51, 62, 33, 21, 62, 45],
  //             fill: true,
  //             borderColor: '#FFA726',
  //             tension: .4,
  //             backgroundColor: 'rgba(255,167,38,0.2)'
  //         }
  //     ]
  // };
  // this.config = this.configService.config;
  // this.updateChartOptions();
  // this.subscription = this.configService.configUpdate$.subscribe(config => {
  //     this.config = config;
  //     this.updateChartOptions();
  // });
  // }
  // updateChartOptions() {
  //     if (this.config.dark)
  //         this.applyDarkTheme();
  //     else
  //         this.applyLightTheme();
  // }
  // applyLightTheme() {
  //     this.basicOptions = {
  //         plugins: {
  //             legend: {
  //                 labels: {
  //                     color: '#495057'
  //                 }
  //             }
  //         },
  //         scales: {
  //             x: {
  //                 ticks: {
  //                     color: '#495057'
  //                 },
  //                 grid: {
  //                     color: '#ebedef'
  //                 }
  //             },
  //             y: {
  //                 ticks: {
  //                     color: '#495057'
  //                 },
  //                 grid: {
  //                     color: '#ebedef'
  //                 }
  //             }
  //         }
  //     };
  //   }
}
