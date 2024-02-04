import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'ng-bootstrap-ext';
import { AuditService } from 'src/app/shared/services/audit.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public signupForm!: FormGroup;
  public selectedUserType: string = 'sandbox';
  submitting = false;

  constructor(
    private formBuilder: FormBuilder,
    public auditService: AuditService,
    public authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private http: HttpClient // Inject the HttpClient

  ) {
  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      userName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      ConfirmPassword: ['', Validators.required],
      state: ['']
    });

    // Fetch and populate the states when the component initializes
    // this.authService.allstates().subscribe((res: any) => {
    //   this.states = res;//.map((stateObj: any) => stateObj.state);
    // });
  }


  signUp() {
    let userData: any = {
      userName: this.signupForm.get('userName')?.value,
      email: this.signupForm.get('Email')?.value,
      password: this.signupForm.get('password')?.value,
      password_confirm: this.signupForm.get('ConfirmPassword')?.value,
    };


    if (this.selectedUserType === 'sandbox') {
      userData.role = 'guest';
    } else if (this.selectedUserType === 'dataCollector') {
      userData.role = 'dataCollector';
      // userData.state = this.signupForm.get('state')?.value;
    }

    this.submitting = true;
    this.authService.signUp(userData).subscribe((res) => {
        this.submitting = false;
        this.toastService.success('Success', 'Registration successful!');
        this.signupForm.reset();
        this.router.navigate(['auth/login']);
    }, error => {
      this.submitting = false;
      this.toastService.error('Error', 'Registration failed', error);
    });
  }
}
