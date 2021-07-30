import { BaseServiceService } from '@baseService/base-service.service';
import { Seat } from './../../model/seats';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class SeatServiceService extends BaseServiceService {
  private URL = environment.baseUrl + "/web/giuong";

  constructor(http: HttpClient) {
    super(http);
  }

  getStatusSeat(busId:Int16Array, time: string, date:string){
    return this.onGet(`${this.URL}/get-list-giuong-for-xe?tuyen_xe_id=${busId}&gio=${time}&ngay=${date}`);
  }
}
