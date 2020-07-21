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

  isAuthorized(token) :Boolean{
    if (token == null) {
      token = localStorage.getItem('__T');
    }
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };

    this.http.get(this.constants.urls.getAllMetadata, httpOptions).subscribe((response) => {
      setToken(token);
      return true;
    },
      (errorResponse) => {
        return false;
      });
  }


  isAuthorizedUser(userName, password) :Boolean{
    return this.isAuthorized(`Basic ${btoa(userName + ':' + password)}`);
  }
  setToken(token) {
    localStorage.setItem('__T', token);
  }


  clearToken() {
    localStorage.removeItem('__T');
  }
}
