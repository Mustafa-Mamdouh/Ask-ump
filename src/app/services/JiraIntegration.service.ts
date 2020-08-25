import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Constants } from '../constants';
import { Observable } from 'rxjs';

@Injectable()
export class JiraIntegrationService {
  httpOptions;
  httpOptionFormData;
  constructor(private http: HttpClient, private constants: Constants) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(constants.authenticationParameters.email + ':' + constants.authenticationParameters.apiToken)}`
      })
    };
    this.httpOptionFormData = {
      headers: new HttpHeaders({
        'Authorization': `Basic ${btoa(constants.authenticationParameters.email + ':' + constants.authenticationParameters.apiToken)}`,
        'X-Atlassian-Token': 'nocheck'
      })
    };
  }
  getMetadata(): Observable<any> {
    return this.http.get(this.constants.urls.getAllMetadata, this.httpOptions);
  }
  postTicket(ticket): Observable<any> {
    return this.http.post(this.constants.urls.postTicketUrl, ticket, this.httpOptions);
  }
  uploadAttachment(formData,issueKey){
    return this.http.post(this.constants.urls.uploadAttachment+'/'+issueKey+'/attachments', formData, this.httpOptionFormData);

  }
  addWatcher(formData,issueKey){
    return this.http.post(this.constants.urls.uploadAttachment+'/'+issueKey+'/watchers', formData, this.httpOptions);

  }
}
