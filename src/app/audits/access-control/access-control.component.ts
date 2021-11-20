import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ACL} from '../../parse/parse-object.interface';
import {ParseService} from '../../parse/parse.service';
import {AuditService} from '../audit.service';
import {Audit} from '../model/audit.interface';

@Component({
  selector: 'app-access-control',
  templateUrl: './access-control.component.html',
  styleUrls: ['./access-control.component.scss'],
})
export class AccessControlComponent implements OnInit, OnChanges {
  @Input() audit: Audit;

  acl: { key: string; read: boolean; write: boolean; }[] = [];

  userIdToName: Record<string, string> = {};
  userNameToId: Record<string, string> = {};

  constructor(
    private auditService: AuditService,
    private parseService: ParseService,
  ) {
  }

  ngOnInit() {
    this.parseService.getUsers().subscribe(users => {
      for (let user of users) {
        this.userIdToName[user.objectId] = user.username;
        this.userNameToId[user.username] = user.objectId;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.audit) {
      this.acl = Object.entries(this.audit.ACL)
        .map(([key, rest]) => ({key, ...rest}))
        .sort(({key: k1}, {key: k2}) => k1.localeCompare(k2))
      ;
    }
  }

  delete(index: number) {
    this.acl.splice(index, 1);
  }

  add(key: string, read: boolean, write: boolean) {
    key = this.userNameToId[key] || key;
    this.acl.push({key, read, write});
  }

  save() {
    const ACL: ACL = {};
    for (const {key, ...rest} of this.acl) {
      ACL[key] = rest;
    }
    this.auditService.update(this.audit, {ACL}, a => {
      a.ACL = ACL;
      return a;
    }).subscribe();
  }
}
