import {Component, OnInit} from '@angular/core';
import {AuditService} from '../audit.service';
import {FeatureService} from '../feature.service';
import {Audit} from '../model/audit.interface';

@Component({
  selector: 'app-pre-audit',
  templateUrl: './pre-audit.component.html',
  styleUrls: ['./pre-audit.component.scss'],
})
export class PreAuditComponent implements OnInit {
  audits: Audit[] = [];

  constructor(
    private auditService: AuditService,
    private featureService: FeatureService,
  ) {
  }

  ngOnInit(): void {
    this.auditService.findAll().subscribe(audits => {
      this.audits = audits;
    });
  }

  create(): void {
    const name = prompt('New Audit Name');
    if (!name) {
      return;
    }

    this.auditService.create({
      name,
      type: {},
      zone: {},
    }).subscribe(audit => {
      this.audits.push(audit);
    });
  }

  rename(audit: Audit) {
    const name = prompt('Rename Audit', audit.name);
    if (!name) {
      return;
    }
    this.auditService.update(audit.objectId, {
      name,
    }).subscribe(() => {
      audit.name = name;
    });
  }

  delete(audit: Audit) {
    if (!confirm(`Are you sure you want to delete '${audit.name}'?`)) {
      return;
    }
    this.auditService.delete(audit).subscribe(() => {
      const index1 = this.audits.indexOf(audit);
      if (index1 >= 0) {
        this.audits.splice(index1, 1);
      }
    });
    this.featureService.deleteAll({auditId: audit.auditId}).subscribe();
  }
}