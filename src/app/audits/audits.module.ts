import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgbDropdownModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '../forms/forms.module';
import {SharedModule} from '../shared/shared.module';
import {AuditService} from './audit.service';
import {AuditComponent} from './audit/audit.component';

import {AuditsRoutingModule} from './audits-routing.module';
import {FeatureService} from './feature.service';
import {PreAuditComponent} from './pre-audit/pre-audit.component';
import {PreTypeComponent} from './pre-type/pre-type.component';
import {PreZoneComponent} from './pre-zone/pre-zone.component';
import {TypeListComponent} from './type-list/type-list.component';
import {TypeComponent} from './type/type.component';
import {ZoneListComponent} from './zone-list/zone-list.component';
import {ZoneComponent} from './zone/zone.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    NgbNavModule,
    NgbDropdownModule,
    AuditsRoutingModule,
  ],
  providers: [
    AuditService,
    FeatureService,
  ],
  declarations: [
    PreAuditComponent,
    ZoneComponent,
    TypeComponent,
    AuditComponent,
    PreZoneComponent,
    PreTypeComponent,
    ZoneListComponent,
    TypeListComponent,
  ],
})
export class AuditsModule {
}