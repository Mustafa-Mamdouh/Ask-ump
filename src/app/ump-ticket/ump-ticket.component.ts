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
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

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
  affectionTypeData = ['Yes', 'No', 'I am not sure'];
  businessLineData = ['Data Science', 'BDE', 'LTI/ LSI', 'LTS', 'Fkagship', 'LMS', 'LLS', 'Other'];
  hasChampData = ['Yes', 'No'];
  isUmpChampData = ['Yes', 'No'];
  championsNames = [{ name: 'Feiran Ji', ldap: 'feji' }, { name: 'Soumasish Goswami', ldap: 'sogoswam' }, 
  { name: 'Jenny', ldap: 'hwu1' }, { name: 'shuoze wang', ldap: 'shuozwan' }, 
  { name: 'Aash Anand', ldap: 'aanand' }, { name: 'Aditya Choudhary', ldap: 'adchoudh' },
   { name: 'Yash Kelkar', ldap: 'ykelkar@linkedin.com' },{ name: 'Ronnie Ghose', ldap: 'rghose' },
   { name: 'Chris Dong', ldap: 'cdong' },{ name: 'UMP Support Team', ldap: null }];

  isHasChampDisabled=true;
  // Files 

  issueData: any = {};

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
    private loginService: LoginService,
    public dialog: MatDialog
  ) {


    if (!this.loginService.hasToken()) {
      this.router.navigate(['/']);
    } else {
      // this.loginService.isAuthorized(this.loginService.hasToken()).subscribe((response) => {
      // },
      //   (errorResponse) => {
      //     this.router.navigate(['/']);

      //   });



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

  openModal(target, data): void {

    let comp: any;
    switch (target) {
      case "confirm":
        comp = ConfirmModalComponent
        break;
    }

    let dialogRef = this.dialog.open(comp, {
      width: "500px",
      disableClose: true,
      autoFocus: false,
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {

      console.log(result);
      if (result.result == "CONFIRM") {
        this.confirmTicket(result.watcher);
      }
    });
  }


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
      hasChamp: [null, [Validators.required]],
      isUmpChamp: [null, [Validators.required]],
      assignChamp: [null, [Validators.required]],
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

    let desc = 'dataset name : ' + this.submitTicketForm.value.datasetName + ' \n'
      + 'Question Type : ' + this.submitTicketForm.value.questionType + ' \n'
      + 'Environment : ' + this.submitTicketForm.value.envType + ' \n'
      + 'flow/usecase type : ' + this.submitTicketForm.value.flowUseCaseType + ' \n'
      + 'Execution Link : <a href="' + this.submitTicketForm.value.executionUrl + '" >' + this.submitTicketForm.value.executionUrl + '</a> \n'
      + 'Failing step : ' + this.submitTicketForm.value.failingStep + ' \n'
      + 'Priority : ' + this.submitTicketForm.value.affectionType + ' \n'
      + 'Line of Business : ' + this.submitTicketForm.value.businessLine + ' \n'
      + 'Are you a UMP Champion ? ' + this.submitTicketForm.value.isUmpChamp + ' \n'
      + 'Description : ' + this.submitTicketForm.value.description + ' \n';
    let labelsString = '';
    let assigne = null;
    if (this.submitTicketForm.value.assignChamp.name != 'UMP Support Team') {
      labelsString = 'ump-champion-assigned';
      assigne = this.submitTicketForm.value.assignChamp.ldap;
    }
    this.issueData = {
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
        }, labels: [
          labelsString
        ],
        assignee: {
          name: assigne
        }
      }
    };
    this.openModal("confirm", this.issueData);

  }

  confirmTicket(watcher) {

    this.submitting = true;

    let snackBarRef = this.snackBar.open('Loading ... ');


    this.jiraIntegrationService.postTicket(JSON.stringify(this.issueData)).subscribe(
      (response) => {
        snackBarRef.dismiss();
        this.notify.showSuccess('Ticket Added tikcet key : ' + response.key);
        this.addwatcher(response.key, watcher);
        this.uploadAttachments(response.key);
        setTimeout(() => this.formGroupDirective.resetForm(), 0);
        this.submitting = false;
        window.open('https://jira01.corp.linkedin.com:8443/browse/' + response.key, "blank");
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

  addwatcher(issueKey, watcher) {

    if (watcher && watcher.length > 0)
      this.jiraIntegrationService.addWatcher('\"' + watcher + '\"', issueKey).subscribe((response) => {
        this.notify.showSuccess('Watcher added! ');
      }, (errorResponse) => { this.notify.showError('Failed to add watchers'); });
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
  onHasChampChange(event) {
    console.log(event);
    if (event.value == "Yes") {
      this.isHasChampDisabled=false;
    } else {
      this.isHasChampDisabled=true;
      this.submitTicketForm.patchValue({assignChamp:this.championsNames[this.championsNames.length-1]});

    }
    console.log(this.isHasChampDisabled);
  }
}