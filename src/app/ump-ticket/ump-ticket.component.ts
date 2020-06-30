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

  questionTypeData = ['I want to know how to do XYZ in UMP', 'My flow failed and need help', 'Operations help (Delete data/ Pinot table etc)'
    , 'Access related request', 'Other'];
  envTypeData = ['Faro', 'Holdem', 'War'];
  flowUseCaseTypeData = ['Backfill', 'Time properties related', 'Data quality related', 'UDP', 'Pinot Related',
    'Test flow', 'Scheduled flow', 'Distcp', 'HP '];
  failingStepData = ['Data file step', 'Pre/ post validation step', 'Trigger step', 'Prune dates step', 'Any other steps'];
  affectionTypeData = ['This is affecting production data/ flow (HP) -> Reach out to DFSRE oncall',
    'This is affecting production data/ flow (Non-HP)', 'This is affecting me',
    'This is blocking my team (5+ people)', 'This is affecting my org (20+ people)'];
  businessLineData = ['Data Science', 'BDE', 'LTI/ LSI', 'LTS', 'Fkagship', 'LMS', 'LLS', 'Other'];
  searchHistoryData = ['Yes', 'No'];
  documentationReadingHistoryData = ['Yes', 'No'];
  isUmpChampData = ['Yes', 'No'];
  constructor(
    private fb: FormBuilder,
    private notify: NotificationBuilderService,
    private snackBar: MatSnackBar,
    private jiraIntegrationService: JiraIntegrationService
  ) {
    this.buildForm();
    // jiraIntegrationService.getMetadata().subscribe(
    //   (response) => {
    //     this.response = response;
    //     console.log(this.response);
    //   },
    //   (errorResponce) => {
    //     this.notify.showError(errorResponce.statusText);
    //     this.response = {};
    //   }
    // );
  }

  ngOnInit(): void { }

  buildForm(): void {
    this.submitTicketForm = this.fb.group({
      questionType: [null, [Validators.required]],
      envType: [null, [Validators.required]],
      flowUseCaseType: [null, [Validators.required]],
      failingStep: [null, [Validators.required]],
      affectionType: [null, [Validators.required]],
      businessLine: [null, [Validators.required]],
      executionUrl: [null, [Validators.required]],
      searchHistory: [null, [Validators.required]],
      documentationReadingHistory: [null, [Validators.required]],
      isUmpChamp: [null, [Validators.required]]
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
          key: 'APA',
        },
        components: [
          {
            id: "37739"
          }
        ],
        summary: this.submitTicketForm.value.datasetName,
        description: this.submitTicketForm.value.description,
        issuetype: {
          name: 'Bug',
        },
      },
    };


    console.log(JSON.stringify(issueData));
    this.jiraIntegrationService.postTicket(JSON.stringify(issueData)).subscribe(
      (response) => {
        snackBarRef.dismiss();
        this.notify.showSuccess('Ticket Added tikcet key : ' + response.key);
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
