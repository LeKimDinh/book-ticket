import { BaseServiceService } from '@baseService/base-service.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TransPaypalServiceService extends BaseServiceService {
  private URL = 'https://api.sandbox.paypal.com/v2/checkout/orders';

  constructor(http: HttpClient) {
    super(http);
  }

  getTransectionPayPal(orderId: any) {
    let url = `${this.URL}/${orderId}`;
    return this.onGet(url);
  }
}
