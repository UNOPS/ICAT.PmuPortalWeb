import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { LazyLoadEvent } from 'primeng/api';
import {
  MitigationActionType,
  Project,
  ProjectControllerServiceProxy,
  ProjectOwner,
  ProjectStatus,
  Sector,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-climate-action',
  templateUrl: './climate-action.component.html',
  styleUrls: ['./climate-action.component.css'],
})
export class ClimateActionComponent implements OnInit, AfterViewInit {
  climateactions: Project[];
  selectedClimateActions: Project[];
  climateaction: Project = new Project();
  relatedItems: Project[] = [];
  sectors: Sector[];
  sectorName: string[] = [];
  sector: Sector = new Sector();
  cols: any;
  columns: any;
  options: any;
  sectorList: Sector[] = [];
  projectStatusList: ProjectStatus[] = [];
  mitigationActionList: MitigationActionType[] = [];

  selectedSectorType: Sector;
  selectedMitigationType: MitigationActionType;
  selectedstatustype: ProjectStatus;
  searchText: string;

  loading: boolean;
  totalRecords = 0;
  rows = 10;
  last: number;
  event: any;

  searchBy: any = {
    text: null,
    sector: null,
    status: null,
    mitigationAction: null,
    editedOn: null,
  };

  first = 0;

  cities: { name: string; id: number }[] = [
    { name: 'test', id: 1 },
    { name: 'test 2', id: 2 },
  ];

  statusList: string[] = [];

  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private projectProxy: ProjectControllerServiceProxy,
    private cdr: ChangeDetectorRef,
  ) {}
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.serviceProxy
      .getManyBaseProjectControllerProject(
        undefined,
        undefined,
        undefined,
        undefined,
        ['editedOn,DESC'],
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res: any) => {
        this.climateactions = res.data;
        this.totalRecords = res.totalRecords;
        if (res.totalRecords !== null) {
          this.last = res.count;
        } else {
          this.last = 0;
        }
      });

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
        0,
      )
      .subscribe((res: any) => {
        this.sectorList = res.data;
      });

    this.serviceProxy
      .getManyBaseProjectStatusControllerProjectStatus(
        ['name'],
        undefined,
        undefined,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res: any) => {
        this.projectStatusList = res.data;
      });

    this.serviceProxy
      .getManyBaseMitigationActionControllerMitigationActionType(
        ['name'],
        undefined,
        undefined,
        undefined,
        ['name,ASC'],
        undefined,
        1000,
        0,
        0,
        0,
      )
      .subscribe((res: any) => {
        this.mitigationActionList = res.data;
      });
  }

  onMAChange(event: any) {
    this.onSearch();
  }

  onSectorChange(event: any) {
    this.onSearch();
  }

  onStatusChange(event: any) {
    this.onSearch();
  }

  onSearchClick(event: any) {
    const words = this.searchText.split(' ');

    const searchfilter: string[] = [];

    for (const w of words) {
      searchfilter.push('climateActionName||$contL||' + w.trim());
    }
    for (const w of words) {
      searchfilter.push('contactPersoFullName||$contL||' + w.trim());
    }
    for (const w of words) {
      searchfilter.push('climateaction.sector.name||$contL||' + w.trim());
    }
    for (const w of words) {
      searchfilter.push(
        'climateactions.projectStatus.name||$contL||' + w.trim(),
      );
    }
    for (const w of words) {
      searchfilter.push(
        'climateactions.mitigationAction.name||$contL||' + w.trim(),
      );
    }
    for (const w of words) {
      searchfilter.push('climateactions.editedOn||$contL||' + w.trim());
    }

    if (!this.searchText || this.searchText?.length < 4) {
      this.relatedItems = [];
      return;
    }

    this.serviceProxy
      .getManyBaseProjectControllerProject(
        undefined,
        undefined,
        undefined,
        searchfilter,
        undefined,
        undefined,
        10,
        0,
        0,
        0,
      )
      .subscribe((res) => {
        this.climateactions = res.data;
      });
  }

  onSearch() {
    const event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  loadgridData = (event: LazyLoadEvent) => {
    this.loading = true;
    this.totalRecords = 0;

    const sectorId = this.searchBy.sector ? this.searchBy.sector.id : 0;
    const statusId = this.searchBy.status ? this.searchBy.status.id : 0;
    const filtertext = this.searchBy.text ? this.searchBy.text : '';
    const mitTypeId = this.searchBy.mitigationAction
      ? this.searchBy.mitigationAction.id
      : 0;

    const editedOn = this.searchBy.editedOn
      ? moment(this.searchBy.editedOn).format('YYYY-MM-DD')
      : '';

    const pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    setTimeout(() => {
      this.projectProxy
        .getClimateActionDetails(
          pageNumber,
          this.rows,
          sectorId,
          statusId,
          mitTypeId,
          editedOn,
          filtertext,
        )
        .subscribe((a) => {
          this.climateactions = a.items;
          this.totalRecords = a.meta.totalItems;
          this.loading = false;
        });
    }, 1);
  };

  detail() {
    this.router.navigate(['/project-information']);
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
    return this.climateactions
      ? this.first === this.climateactions.length - this.rows
      : true;
  }

  isFirstPage(): boolean {
    return this.climateactions ? this.first === 0 : true;
  }

  search() {
    const a: any = {};
    a.rows = this.rows;
    a.first = 0;
  }

  removeFromString(arr: string[], str: string) {
    const escapedArr = arr.map((v) => escape(v));
    const regex = new RegExp(
      '(?:^|\\s)' + escapedArr.join('|') + '(?!\\S)',
      'gi',
    );
    return str.replace(regex, '');
  }
}
