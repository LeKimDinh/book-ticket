import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ZaloPayService {
  URL = environment.baseUrl + "/zalo-pay/get-code";
  constructor(private http: HttpClient) { }

  onGetZaloPay(descriptions: string, ticket: any):Observable<any>{
    let title = "zalopay";
    let user = "admin";
    return this.http.post(`${this.URL}?title=${title}&appUser=${user}&description=${descriptions}`,ticket);
  }
}
