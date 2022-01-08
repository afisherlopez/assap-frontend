import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {CompanycamCredentialService} from '../../companycam/companycam-credential.service';
import {CompanycamService} from '../../companycam/companycam.service';
import {Photo} from '../../companycam/model/photo';
import {Project} from '../../companycam/model/project';
import {AuditService} from '../audit.service';
import {Audit} from '../model/audit.interface';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit {
  audit?: Audit;
  project?: Project;
  photos: Photo[] = [];

  apiKey = true;

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
    private companycamService: CompanycamService,
    private companycamCredentialService: CompanycamCredentialService,
  ) {
  }

  ngOnInit(): void {
    if (!this.companycamCredentialService.apiKey) {
      this.apiKey = false;
      return;
    }

    this.route.params.pipe(
      switchMap(({aid}) => this.auditService.findOne(aid)),
      tap(audit => this.audit = audit),
      switchMap(audit => audit ? this.companycamService.getProjects(audit.name) : of([])),
      tap(([project]) => this.project = project),
      switchMap(([project]) => project ? this.companycamService.getPhotos(project.id) : []),
    ).subscribe(photos => {
      this.photos = photos;
    });
  }
}
