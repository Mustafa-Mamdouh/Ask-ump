import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Constants } from '../constants';
import { Observable } from 'rxjs';

@Injectable()
export class JiraIntegrationService {
  httpOptions;

  constructor(private http: HttpClient, private constants: Constants) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(constants.authenticationParameters.email + ':' + constants.authenticationParameters.apiToken)}`,
        'Cookie':'atlassian.xsrf.token=f3d66b33-74fb-4128-be15-4c2dba036700_3b3982270d28c762955507e7d412299437392353_lin',
        'Origin':'http://localhost:4200/',
        'X-Atlassian-Token':'no-check'
      })
    };
  }
  getMetadata(): Observable<any> {
    return this.http.get(this.constants.urls.getAllMetadata, this.httpOptions);
  }
  postTicket(ticket): Observable<any> {
    return this.http.post(this.constants.urls.postTicketUrl, ticket, this.httpOptions);
  }
}
