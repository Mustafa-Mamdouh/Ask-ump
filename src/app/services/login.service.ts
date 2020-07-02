import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Constants } from '../constants';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class LoginService {
  isLoggedIn = false;

  constructor(
    private http: HttpClient,
    private constants: Constants,
    private router: Router
  ) {}
}
