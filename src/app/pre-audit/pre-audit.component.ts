import {Component, OnDestroy, OnInit} from '@angular/core';
import {Audit, Type, Zone} from "../model/audit.interface";
import {ParseService} from "../parse/parse.service";
import {Feature} from "../model/feature.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {combineLatest, Subscription} from "rxjs";

@Component({
  selector: 'app-pre-audit',
  templateUrl: './pre-audit.component.html',
  styleUrls: ['./pre-audit.component.scss']
})
export class PreAuditComponent implements OnInit, OnDestroy {
  audits: Audit[] = [];
  selectedAudit?: Audit;
  selectedFeatures: Feature[] = [];
  data: object = {};

  activeTab: 'preaudit' | 'zone' = 'preaudit';

  private subscription: Subscription;

  constructor(
    private parseService: ParseService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.subscription = combineLatest([this.parseService.getAudits(), this.route.params]).subscribe(([audits, params]) => {
      this.audits = audits;
      const aid: string = params.aid;
      if (aid) {
        this.selectAudit(aid);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private selectAudit(auditId: string) {
    this.selectedAudit = this.audits.find(a => a.auditId === auditId);

    this.parseService.getFeatures({auditId, zoneId: "null"}).subscribe(features => {
      this.selectedFeatures = features;

      this.data = features[0] ? this.parseService.feature2Data(features[0]) : {};
    });
  }
}
