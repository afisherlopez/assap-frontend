import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  rootUrl = environment.url + 'authApi/v1/';
  currentLoginUser: any = {};

  constructor(private http: HttpClient,
  ) { }

  getAuthToken() {
    return localStorage.getItem('accessToken');
  }

  allstates(): Observable<any> {
    return this.http.get(`${this.rootUrl}all-states/`);
  }

  getUser(): Observable<any> {
    return this.http.get(`${this.rootUrl}user/`);
  }

  signUp(data: any): Observable<any> {
    return this.http.post(`${this.rootUrl}register/`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.rootUrl}login/`, data);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.rootUrl}logout/`, null);
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(`${this.rootUrl}forgot-password/`, data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.rootUrl}change-password/`, data);
  }
}