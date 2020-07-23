import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormGroupDirective,
} from '@angular/forms';
import 'rxjs/add/observable/combineLatest';
import { NotificationBuilderService } from '../notificationBuilder.service';
import { containsElement } from '@angular/animations/browser/src/render/shared';
import { JiraIntegrationService } from '../services/JiraIntegration.service';
import { Constants } from '../constants';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  lgoinForm: FormGroup;
  submitting = false;
  token ;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private notify: NotificationBuilderService,
    private constants: Constants,
    private loginService: LoginService
  ) {

    if( this.loginService.hasToken()){
      
      this.loginService.isAuthorized(this.loginService.hasToken()).subscribe((response) => {
        this.loginService.setToken(this.loginService.hasToken());
        this.router.navigate(['/main']);
      },
        (errorResponse) => {
        });
  
    }
  
    
    this.buildForm();
  }

  ngOnInit(): void { }

  buildForm(): void {
    this.lgoinForm = this.fb.group({
      email: [null, [Validators.required]],
      apiToken: [null, [Validators.required]],
    });
  }

  login() {
    if (this.submitting) {
      return;
    }

    if (this.lgoinForm.invalid) {
      this.notify.showError('Please fill all required fields');
      return;
    }

    this.submitting = true;

    let loginFormData = this.lgoinForm.value;

    this.token = `Basic ${btoa(loginFormData.email + ':' + loginFormData.apiToken)}`; 

    this.loginService.isAuthorizedUser(loginFormData.email, loginFormData.apiToken).subscribe(res => this.handleResponse(res), res=> this.handleResponse(res));

  }


  handleResponse( response ){
    // console.log(response);
    if(response.headers.get('X-Seraph-LoginReason') == 'OK'){
      this.loginService.setToken(this.token);
      this.router.navigate(['/main']);
    }else{
      this.notify.showError('Invalid Login Credentials');
    }
    this.submitting = false;
  }
}
