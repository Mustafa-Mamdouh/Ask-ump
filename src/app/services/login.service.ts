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
  ) {}

  setToken(){
      localStorage.setItem('__T', this.constants.authenticationParameters.apiToken );
  }

  isAuthorized(){
    return localStorage.getItem('__T') === this.constants.authenticationParameters.apiToken ;
  }
  clearToken(){
    localStorage.removeItem('__T');
  }
}
