import { environment } from '@env/environment';
import { Ticket, TicketTwoWay } from './../../model/ticket';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseServiceService } from '@baseService/base-service.service';

@Injectable({
  providedIn: 'root',
})
export class TicketServiceService extends BaseServiceService {
  private URL = environment.baseUrl + '/ve';

  constructor(http: HttpClient) {
    super(http);
  }

  getRevenueStatisticsByYear(year: number, routerId: Int16Array) {
    let time = '01/01/' + year;
    return this.onGet(
      `${this.URL}/thong-ke-tuyen-in-year?time=${time}&id_tuyen_xe=${routerId}`
    );
  }

  getTicketRevenue(year: string) {
    return this.onGet(`${this.URL}/thong-ke-doanh-thu-12-thang?time=${year}`);
  }

  getTicketRevenueInfor(year: number){
    let time = '01/01/' + year;
    return this.onGet(
      `${this.URL}/thong-ke-theo-tuyen-of-year?time=${time}`
    );
  }

  postCreateTicketOneWay(ticket: any) {
    return this.onPost(`${this.URL}/create`, ticket);
  }

  postCreateTicketTwoWay(ticket: any) {
    return this.onPost(`${this.URL}/create2`, ticket);
  }

  getTicketByCode(gio: string, date: string, sdt: string, id: Int16Array, email: string) {
    return this.onGet(`${this.URL}/get-ve-by-code?gio=${gio}&date=${date}&sdt=${sdt}&id_tuyen=${id}&email=${email}`);
  }

  getTicketHistory(customerId: Int16Array) {
    let url = `${this.URL}/thong-ke-theo-khach-hang?khach_hang_id=${customerId}`;
    return this.onGet(url);
  }

  getCheckTicket(data:any){
    let url = `${environment.baseUrl}/web/giuong/check-slot`;
    return this.onPost(url,data);
  }

}
