import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class VnpayService {
  URL = environment.baseUrl;

  constructor(private http: HttpClient) {}

  onVNPay(ticket: any, email: string): Observable<any> {
    return this.http.post(
      `${this.URL}/payVn/get-code?link=https://dh-book-ticket.herokuapp.com/success/${email}&vnp_IpAddr=192.168.0.106&vnp_OrderInfo=Dat%20ve%20online&vnp_OrderType=DatVe`,
      ticket
    );
  }
}
