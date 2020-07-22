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
import { LoginService } from '../services/login.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

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


  // Files 


  selectedFiles: any = [];
  @ViewChild('file') file;


  updateFiles() {
    this.selectedFiles = [];

    for (var i = 0; i < this.file.nativeElement.files.length; i++) {
      this.selectedFiles.push(this.file.nativeElement.files[i]);
    }
  }

  removeFile(index) {
    this.selectedFiles.splice(index, 1);
  }

  constructor(
    private fb: FormBuilder,
    private notify: NotificationBuilderService,
    private snackBar: MatSnackBar,
    private router: Router,
    private jiraIntegrationService: JiraIntegrationService,
    private loginService: LoginService
  ) {


    if (!this.loginService.hasToken()) {
      this.router.navigate(['/']);
    } else {
      this.loginService.isAuthorized(this.loginService.hasToken()).subscribe((response) => {
      },
        (errorResponse) => {
          this.router.navigate(['/']);

        });



    }


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

  logout() {
    this.loginService.clearToken();
    this.router.navigate(['/']);
  }

  ngOnInit(): void { }

  buildForm(): void {
    this.submitTicketForm = this.fb.group({
      questionType: [null, [Validators.required]],
      envType: [null, [Validators.required]],
      flowUseCaseType: [null, [Validators.required]],
      failingStep: [null, [Validators.required]],
      affectionType: [null, [Validators.required]],
      description: [null, [Validators.required]],
      businessLine: [null, [Validators.required]],
      executionUrl: [null, [Validators.required]],
      datasetName: [null, [Validators.required]],
      searchHistory: [null, [Validators.required]],
      documentationReadingHistory: [null, [Validators.required]],
      isUmpChamp: [null, [Validators.required]],
      summary: [null, [Validators.required]],
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
    let desc = 'dataset name : ' + this.submitTicketForm.value.datasetName + ' \n'
      + 'Question Type : ' + this.submitTicketForm.value.questionType + ' \n'
      + 'Environment : ' + this.submitTicketForm.value.envType + ' \n'
      + 'flow/usecase type : ' + this.submitTicketForm.value.flowUseCaseType + ' \n'
      + 'Execution Link : <a href="' + this.submitTicketForm.value.executionUrl + '" >' + this.submitTicketForm.value.executionUrl + '</a> \n'
      + 'Failing step : ' + this.submitTicketForm.value.failingStep + ' \n'
      + 'Priority : ' + this.submitTicketForm.value.affectionType + ' \n'
      + 'Line of Business : ' + this.submitTicketForm.value.businessLine + ' \n'
      + 'Have you tried searching for old UMP tickets ? ' + this.submitTicketForm.value.searchHistory + ' \n'
      + 'Have you read UMP documents ? ' + this.submitTicketForm.value.documentationReadingHistory + ' \n'
      + 'Are you a UMP Champion ? ' + this.submitTicketForm.value.isUmpChamp + ' \n'
      + 'Description : ' + this.submitTicketForm.value.description + ' \n';
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
        summary: this.submitTicketForm.value.summary,
        description: desc,
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
        this.uploadAttachments(response.key);
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

  uploadAttachments(issueKey) {
    if (this.selectedFiles.length > 0) {
      const formData: FormData = new FormData();
      this.selectedFiles.forEach(file => {
        formData.append('file', file);
      });
      this.jiraIntegrationService.uploadAttachment(formData, issueKey).subscribe((response) => {
        this.notify.showSuccess('Attachment added! ');
      }, (errorResponse) => { this.notify.showError('Failed to add attachments'); });
    }
  }
}
