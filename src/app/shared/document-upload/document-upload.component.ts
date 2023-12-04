import { async } from '@angular/core/testing';
import { LazyLoadEvent, ConfirmationService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import {
  DocumentControllerServiceProxy,
  Documents,
  DocumentsDocumentOwner,
  LearningMaterial,
  LearningMaterialSector,
  LearningMaterialUserType,
  Sector,
  ServiceProxy,
  UserType,
} from './../../../shared/service-proxies/service-proxies';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css'],
})
export class DocumentUploadComponent implements OnInit, OnChanges {
  @Input() doucmentList: Documents[] = [];
  @Input() documentOwner: DocumentsDocumentOwner;
  @Input() documentOwnerId: number;
  @Input() showUpload = true;
  @Input() isNew: boolean;
  @Input() showDeleteButton = true;
  @Output() newItemEvent = new EventEmitter<string>();

  loading: boolean;
  uploadedFiles: any[] = [];
  SERVER_URL = environment.baseUrlAPIDocUploadAPI;
  uploadURL: string;

  constructor(
    private docService: DocumentControllerServiceProxy,
    private httpClient: HttpClient,
    private confirmationService: ConfirmationService,
    private serviceProxy: ServiceProxy,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.documentOwner) {
      this.uploadURL =
        this.SERVER_URL +
        '/' +
        this.documentOwnerId +
        '/' +
        this.documentOwner.toString();
    }
    this.load();
  }

  ngOnInit(): void {
    if (this.documentOwner) {
      this.uploadURL =
        this.SERVER_URL +
        '/' +
        this.documentOwnerId +
        '/' +
        this.documentOwner.toString();
    }
  }

  loadDocments(event: LazyLoadEvent) {
    this.load();
  }

  async load() {
    this.loading = true;
    await this.docService
      .getDocuments(this.documentOwnerId, this.documentOwner)
      .subscribe((res) => {
        this.doucmentList = res;

        this.loading = false;
      });
  }

  onUploadComplete(event: any) {
    this.load();
    this.newItemEvent.emit();
  }

  click() {
    this.newItemEvent.emit();
  }

  myUploader(event: any) {
    if (this.doucmentList === undefined || this.doucmentList === null) {
      this.doucmentList = [];
    }
    const fileReader = new FileReader();

    for (const file of event.files) {
      file.documentOwner = this.documentOwner;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentOwner', this.documentOwner.toString());
      const fullUrl =
        this.SERVER_URL +
        '/' +
        this.documentOwnerId +
        '/' +
        this.documentOwner.toString();
      this.httpClient.post<any>(fullUrl, formData).subscribe((res) => {
        this.load();
      });
    }
  }

  async deleteConfirm(doc: Documents) {
    this.confirmationService.confirm({
      message: `Do you want to delete ${doc.fileName} ?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.docService.deleteDoc(doc.id).subscribe(async (res: any) => {
          await this.load();
        });
      },
      reject: () => {},
    });
  }

  base64ToArrayBuffer(base64: any) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  onUpload(event: any) {
    alert('test');
  }
}
