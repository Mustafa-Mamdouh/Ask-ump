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
import { JiraIntegrationService } from './../services/JiraIntegration.service';
import { Constants } from '../constants';

@Component({
  selector: 'app-ump-ticket',
  templateUrl: './ump-ticket.component.html',
  styleUrls: ['./ump-ticket.component.css'],
})
export class UmpTicketComponent implements OnInit {
  submitTicketForm: FormGroup = new FormGroup({});
  ticketCauses = ['ACL Request', 'Question', 'Flow Failure'];
  submitting = false;
  response: any = { projects: [] };
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private notify: NotificationBuilderService,
    private snackBar: MatSnackBar,
    private jiraIntegrationService: JiraIntegrationService
  ) {
    this.buildForm();
    jiraIntegrationService.getMetadata().subscribe(
      (response) => {
        this.response = response;
        console.log(this.response);
      },
      (errorResponce) => {
        this.notify.showError(errorResponce.statusText);
        this.response = {};
      }
    );
  }

  ngOnInit(): void {}

  buildForm(): void {
    this.submitTicketForm = this.fb.group({
      projectName: [null, [Validators.required]],
      datasetName: [null, [Validators.required]],
      ticketCause: [null, [Validators.required]],
      description: [null, [Validators.required]],
      executionUrl: [null, [Validators.required]],
    });
  }
  submitTicket() {
    if (this.submitting) {
      return;
    }

    if (this.submitTicketForm.invalid) {
      this.notify.showError('Invalid data');
      return;
    }
    this.submitting = true;
    let snackBarRef = this.snackBar.open('Loading ... ');

    let issueData = {
      fields: {
        project: {
          key: this.submitTicketForm.value.projectName.key,
        },
        summary: this.submitTicketForm.value.datasetName,
        description: this.submitTicketForm.value.description,
        issuetype: {
          name: 'Task',
        },
      },
    };


    console.log(JSON.stringify(issueData));
    this.jiraIntegrationService.postTicket(JSON.stringify(issueData)).subscribe(
      (response) => {
        snackBarRef.dismiss();
        this.notify.showSuccess('Ticket Added');
        setTimeout(() => this.formGroupDirective.resetForm(), 0);
        this.submitting = false;
      },
      (errorResponce) => {
        console.log(errorResponce);
        this.notify.showError(
          errorResponce.status + '  ' + errorResponce.error
        );
        this.submitting = false;
        snackBarRef.dismiss();
      }
    );
  }
  selected(event) {
    let target = event.source.selected._element.nativeElement;
    let selectedData = {
      value: event.value,
      text: target.innerText.trim(),
    };
  }
}
