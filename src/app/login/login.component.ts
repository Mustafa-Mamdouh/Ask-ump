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
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private notify: NotificationBuilderService,
    private constants: Constants,
    private loginService: LoginService
  ) {

    if(this.loginService.isAuthorized() === true){
      this.router.navigate(['/main']);
    }

    this.buildForm();
  }

  ngOnInit(): void {}

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
    setTimeout(() => {
      if (
        loginFormData.email === this.constants.authenticationParameters.email &&
        loginFormData.apiToken ===
          this.constants.authenticationParameters.apiToken
      ) {
        this.loginService.setToken();
        this.router.navigate(['/main']);
      } else {
        this.notify.showError('Invalid Login Credentials');
      }

      this.submitting = false;
    }, 100);
  }
}
