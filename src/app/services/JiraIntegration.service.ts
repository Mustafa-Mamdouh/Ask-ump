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
        'Authorization': `Basic ${btoa(constants.authenticationParameters.email + ':' + constants.authenticationParameters.apiToken)}`
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
