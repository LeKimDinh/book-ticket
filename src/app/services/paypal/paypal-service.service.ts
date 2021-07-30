import { BaseServiceService } from '@baseService/base-service.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class PaypalServiceService extends BaseServiceService {
  private URL = environment.baseUrl + '/paypal';
  /* https://api.sandbox.paypal.com/v2/checkout/orders/ */

  constructor(http: HttpClient, private httpP: HttpClient) {
    super(http);
  }

  getTokenPayPal() {
    return this.onGet(`${this.URL}/pay/get-token`);
  }

  getTransectionPayPal(orderId: Int16Array, token:string) {
    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: token,
      }),
    };
    let url = `https://api.sandbox.paypal.com/v2/checkout/orders/${orderId}`;
    return this.httpP.get(url,httpOption);
  }

  getRefund(ticketId: Int16Array) {
    return this.onGet(`${this.URL}/pay/${ticketId}/refund`);
  }

  getCancelRoute(routeId: any) {
    return this.onGet(`${this.URL}/cancel-tuyen-xe?id_tuyen_xe=${routeId}`);
  }
}
