import {Component, OnInit} from '@angular/core';
import {ToastService} from 'ng-bootstrap-ext';
import {CompanycamCredentialService} from '../../companycam/companycam-credential.service';
import {CompanycamService} from '../../companycam/companycam.service';
import {ParseCredentialService} from '../../parse/parse-credential.service';
import {ParseService} from '../../parse/parse.service';
import {User} from '../../parse/user.interface';

const errorExplanations: Record<string, string> = {
  403: 'Invalid credentials',
  404: 'Invalid server URL.',
  0: 'Can\'t connect to server.',
};

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  url!: string;
  appId!: string;
  masterKey!: string;

  username?: string;
  password?: string;
  user?: User;

  companycamApiKey!: string;

  constructor(
    private parseCredentialService: ParseCredentialService,
    private companycamCredentialService: CompanycamCredentialService,
    private parseService: ParseService,
    private toastService: ToastService,
    private companycamService: CompanycamService,
  ) {
  }

  ngOnInit(): void {
    this.url = this.parseCredentialService.url;
    this.appId = this.parseCredentialService.appId;
    this.masterKey = this.parseCredentialService.masterKey;
    this.companycamApiKey = this.companycamCredentialService.apiKey;

    if (this.parseCredentialService.sessionToken) {
      this.parseService.getCurrentUser().subscribe(user => this.user = user);
    }
  }

  save(): void {
    this.parseCredentialService.url = this.url;
    this.parseCredentialService.appId = this.appId;
    this.parseCredentialService.masterKey = this.masterKey;
  }

  test() {
    this.save();
    const op = this.username && this.password
      ? this.parseService.login(this.username, this.password)
      : this.parseService.getConfig()
    ;
    op.subscribe(() => {
      this.toastService.success('Parse Server', 'Successfully connected to Parse server.');
    }, error => {
      console.error(error);
      const explanation = error.error?.error ?? errorExplanations[error.status];
      this.toastService.error('Parse Server', `Failed to connect to Parse server: ${explanation}`, error);
    });
  }

  logout() {
    this.parseService.logout().subscribe(() => {
      delete this.user;
    }, error => {
      this.toastService.error('Log out', 'Failed to log out', error);
    });
  }

  login() {
    if (!this.username || !this.password) {
      return;
    }

    this.parseService.login(this.username, this.password).subscribe(user => {
      this.user = user;
    }, error => {
      this.toastService.error('Log in', 'Failed to log in', error);
    });
  }

  saveCompanycam() {
    this.companycamCredentialService.apiKey = this.companycamApiKey;
  }

  testCompanycam() {
    this.saveCompanycam();
    this.companycamService.test(this.companycamApiKey).subscribe(user => {
      this.toastService.success('Companycam', `Logged in as ${user.first_name} ${user.last_name}`);
    }, error => {
      this.toastService.error('Companycam', 'Failed to log in', error);
    });
  }
}
