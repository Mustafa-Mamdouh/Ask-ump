import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Constants } from '../constants';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class LoginService {
  constructor(
    private http: HttpClient,
    private constants: Constants,
    private router: Router
  ) { }

  isAuthorized(token):  Observable<any> {
    if (token == null) {
      token = localStorage.getItem('__T');
    }
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };

    return this.http.get(this.constants.urls.getAllMetadata, httpOptions);
  }

  hasToken(){
    return localStorage.getItem('__T'); 
  }

  isAuthorizedUser(userName, password): Observable<any> {
    return this.isAuthorized(`Basic ${btoa(userName + ':' + password)}`);
  }
  setToken(token) {
    localStorage.setItem('__T', token);
  }


  clearToken() {
    localStorage.removeItem('__T');
  }
}
