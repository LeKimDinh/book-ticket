import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseServiceService {
  token!: any;
  httpOption!: any;

  constructor(private http: HttpClient) {}

  createToken() {
    this.token = JSON.parse(localStorage.getItem('LogInSuccess')!);

    if(this.token == null){
      return null;
    }

    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: this.token.Token,
      }),
    };
    return httpOption;
  }

  onGet<T>(url: string): Observable<any> {
    this.httpOption = this.createToken();
    if(this.httpOption == null)
      return this.http.get<T>(url);
    return this.http.get<T>(url, this.httpOption);
  }

  onPost<T>(url: string, data: any): Observable<any> {
    this.httpOption = this.createToken();
    if(this.httpOption == null)
      return this.http.post<T>(url,data);
    return this.http.post<T>(url, data, this.httpOption);
  }
}
