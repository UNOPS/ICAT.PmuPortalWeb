import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import axios from "axios";
import {
  LearningMaterialControllerServiceProxy,
  ServiceProxy,
  LearningMaterial,
  ProjectOwner,
  ProjectStatus,
  Documents,
  DocumentsDocumentOwner,
  Sector,
  UserType,
  LearningMaterialSector,
  LearningMaterialUserType,
} from 'shared/service-proxies/service-proxies';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from 'environments/environment';
import decode from 'jwt-decode';
@Component({
  selector: 'app-learning-material',
  templateUrl: './learning-material.component.html',
  styleUrls: ['./learning-material.component.css']
})
export class LearningMaterialComponent implements OnInit, AfterViewInit {

  learnigMaterials: LearningMaterial[];
  sortOrder: number = 1; //1
  sortType: number = 0; //0
  event: any;
  searchBy: any = {
    text: null,
    sortOption: '',
  };
  display: boolean = false;


  @Output() newItemEvent = new EventEmitter<string>();
  closeResult = '';

  isSaving: boolean = false;
  // project: Project = new Project();
  // selectedcitie: any = {};
  // ndcList: Ndc[];
  options: any;
  // relatedItem: Project[] = [];
  // exsistingPrpject: boolean = false;
  // countryList: Country[] = [];
  projectOwnerList: ProjectOwner[] = [];
  projectStatusList: ProjectStatus[] = [];
  // sectorList: Sector[] = [];
  // financingSchemeList: FinancingScheme[] = [];
  documents: Documents[] = [];
  documentsDocumentOwner: DocumentsDocumentOwner = DocumentsDocumentOwner.LearningMaterial;
  documentOwnerId: any = 4;
  editEntytyId: number = 0;
  proposeDateofCommence: Date;
  isLoading: boolean = false;

  checked: boolean = false;
  sectorList: Sector[] = [];
  typeList: UserType[] = [];
  selectedSector: Sector;
  finalSector: Sector = new Sector();
  selectedType: UserType = new UserType();
  documentLists: Documents[] = [];
  sortOptions = [    // for sorting drop down
    { name: 'By Date -> New to Oldest' },
    { name: 'By Date -> Oldest to New' },
    { name: 'By Document Name -> Z to A' },
    { name: 'By Document Name -> A to Z' },
  ];



  downloadURL: String = environment.baseUrlAPIDocdownloadAPI

  userTypeId: number = 0; // should dynamically add after login system develop
  sectorId: number = 0; // should dynamically add after login system develop
  userrole: any;

  username: any;
  constructor(
    private LearningMaterialProxy: LearningMaterialControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private serviceProxy: ServiceProxy,
    private messageService: MessageService
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }


  onChangeSector() {
    this.finalSector = this.selectedSector;
  }

  ngOnInit(): void {

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userrole = tokenPayload.roles[0];

    this.username = tokenPayload.usr;
    console.log('user-tokenPayload=========', tokenPayload);
    console.log("urole====", this.userrole)




    this.serviceProxy
      .getManyBaseSectorControllerSector(
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
      )
      .subscribe((res: any) => {
        this.sectorList = res.data;
        console.log('this.sectorList', this.sectorList);

      });

    let filter: string[] = [];
    if (this.userrole == "PMU Admin") {
      filter.push('name||$in||' + ["PMU Admin", "PMU User", "Country Admin"]);

    }
    if (this.userrole == "PMU User") {
      filter.push('name||$in||' + ["PMU User", "Country Admin"]);

    }
    if (this.userrole == "ICAT User") {
      filter.push('name||$in||' + ["ICAT User", "PMU User", "Country Admin"]);

    }


    this.serviceProxy
      .getManyBaseUserTypeControllerUserType(
        undefined,
        undefined,
        filter,//['name||$eq||'+this.userrole],
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.typeList = res.data;
        console.log('this.typeList', this.typeList);

      });

    this.loadgridData();

  }

  onSearch() {

    this.loadgridData();
  }

  showModalDialog() {
    this.display = true;
  }
  async closeModalDialog() {
    let url = environment.baseSyncAPI + '/lerninigMeterial';
    this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'You have successfully uploaded the document.' });
    this.display = false;
    await axios.get(url)
  }


  deleteItem(newItem: any) {
    //this.items.push(newItem);
    console.log("hiii....", newItem);
    //deleteOneBaseLearningMaterialControllerLearningMaterial

    this.serviceProxy
      .deleteOneBaseLearningMaterialControllerLearningMaterial(newItem[2])
      .subscribe((res => {
        console.log("111....deleted response", res);
        setTimeout(() => {
          this.loadgridData();
        }, 1000);

      }))
  }

  onStatusChange(event: any) {
    //console.log('inside loadgrid...',this.searchBy.sortOption)
    this.onSearch();

  }
  count: number = 0

  toggele() {
    this.checked = !this.checked
  }
  handleChange(e: any) {
    var isChecked = e.checked;
    this.checked = !this.checked
  }



  getDocuments() {
    // alert('emitted');
    this.count++;
    console.log("count", this.count);
    console.log("finalyya;'''''''''''''")

    setTimeout(() => {
      this.serviceProxy
        .getManyBaseDocumentControllerDocuments(
          undefined,
          undefined,
          undefined,
          undefined,
          ['id,DESC'],
          undefined,
          1000,
          0,
          0,
          0
        )
        .subscribe((res: any) => {
          this.documentLists = res.data;
          console.log('documentLists', res.data);

          let savedDoc = this.documentLists[0];
          let fileName = savedDoc?.fileName;
          let filePath = savedDoc?.relativePath;
          console.log("recieved doc name..", fileName);
          console.log("selected Sector..", this.selectedSector);

          let lm = new LearningMaterial();
          lm.documentType = "Learning Material";
          lm.documentName = fileName;
          // lm.document = filePath;
          lm.document = `${this.downloadURL}/attachment/${savedDoc.id}`
          lm.isPublish = this.checked;

          /////////////////////////////////////
          let learningMaterialsectr: LearningMaterialSector[] = [];
          let sct = new LearningMaterialSector();
          sct.sector.id = this.selectedSector.id;
          // sct.learningMaterial2 = lm;
          learningMaterialsectr.push(sct);
          lm.learningMaterialsector = learningMaterialsectr;

          let learningMaterialusertype: LearningMaterialUserType[] = [];
          let ust = new LearningMaterialUserType();
          ust.userType.id = this.selectedType.id;
          learningMaterialusertype.push(ust);
          lm.learningMaterialusertype = learningMaterialusertype;
          /////////////////////////////////////////
          console.log("learning material object to backend", lm)


          this.serviceProxy
            .createOneBaseLearningMaterialControllerLearningMaterial(lm)
            .subscribe((res: any) => {
              //alert('Saved Successfully');
              this.count = 0;
              this.loadgridData();

            });

        });
    }, 1000);

  }


  loadgridData = () => {



    //console.log('i am coming...',this.searchBy.sortOption);
    //this.loading = true;
    if (this.searchBy.sortOption.name == 'By Date -> New to Oldest') {
      this.sortOrder = 0;
      this.sortType = 0;
      // console.log('inside loadgrid...',this.searchBy.sortOption);
    }
    if (this.searchBy.sortOption.name == 'By Date -> Oldest to New') {
      this.sortOrder = 1;
      this.sortType = 0;
      //console.log('inside loadgrid...',this.searchBy.sortOption);
    }
    if (this.searchBy.sortOption.name == 'By Document Name -> Z to A') {
      this.sortOrder = 0;
      this.sortType = 1;
      //console.log('inside loadgrid...',this.searchBy.sortOption);
    }
    if (this.searchBy.sortOption.name == 'By Document Name -> A to Z') {
      this.sortOrder = 1;
      this.sortType = 1;
      // console.log('inside loadgrid...',this.searchBy.sortOption);
    }



    let filtertext = this.searchBy.text ? this.searchBy.text : '';

    let pageNumber = 1;
    let rows = 10;

    setTimeout(() => {
      this.LearningMaterialProxy.getLearningMaterialDetails(
        pageNumber,
        rows,
        filtertext,
        this.userTypeId,
        this.sectorId,
        this.sortOrder,
        this.sortType,

      )
        .subscribe((a) => {
          this.learnigMaterials = a.items;
          console.log("learnigMaterials..", this.learnigMaterials);
        });
    });

  };

}
function num(num: any) {
  throw new Error('Function not implemented.');
}

