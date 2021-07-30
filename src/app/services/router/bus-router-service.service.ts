import { BaseServiceService } from '@baseService/base-service.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BusRouter, BusRouterRequest } from 'src/app/model/bus-router';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class BusRouterServiceService extends BaseServiceService {
  private URL = environment.baseUrl + '/tuyenxe';

  constructor(http: HttpClient) {
    super(http);
  }

  getBusRouterNumber() {
    return this.onGet(`${this.URL}/get-count-tuyen-xe`);
  }

  getRouterById(diemDiId: Int16Array, diemToiId: Int16Array, date = "") {
    return this.onGet(
      `${this.URL}/get-tuyen-xe?diem_di_id=${diemDiId}&diem_toi_id=${diemToiId}&date=${date}`
    );
  }

  getRunTime(id: Int16Array, ngay: string) {
    return this.onGet(`${this.URL}/${id}/gio-chay?ngay=${ngay}`);
  }

  getRouterInforById(id: Int16Array) {
    return this.onGet(`${this.URL}/get-tuyen-xe-by-id/${id}`);
  }

  getRouterPopular() {
    return this.onGet(this.URL + '/get-tuyen-xe-pho-bien');
  }

  getRouter() {
    return this.onGet(`${this.URL}/tuyenxe/`);
  }

  postReturnRoute(routeId: any) {
    let url = `${this.URL}/${routeId}/bat-tuyen-xe`;
    return this.onPost(url, null);
  }

  getAllRoute() {
    return this.onGet(`${this.URL}/`);
  }

  postCreateRoute(route: BusRouterRequest) {
    let url = `${this.URL}/create`;
    return this.onPost(url, route);
  }

  postUpdateRoute(routeID: Int16Array, route: any) {
    let url = `${this.URL}/${routeID}/update`;
    return this.onPost(url, route);
  }

  getAllRouteToExport(date: string) {
    let url = `${this.URL}/list-tuyen-xe-theo-ve?date=${date}`;
    return this.onGet(url);
  }

  postCancelDependency(data: any) {
    let url = `${this.URL}/tao-tuyen-off`;
    return this.onPost(url, data);
  }

  postCancelDependencyByRangeDate(busRouterId: any, startDate: any, endDate: any){
    let url = `${this.URL}/tao-tuyen-off-auto?id_tuyen_xe=${busRouterId}&start_date=${startDate}&finish_date=${endDate}`;
    return this.onPost(url,null);
  }

  getCheckBanBus(departureId: Int16Array, destinationId: Int16Array, date: string, time: string){
    let url = `${this.URL}/check-tuyen-xe?diem_di_id=${departureId}&diem_toi_id=${destinationId}&date=${date}&gio=${time}`;
    return this.onGet(url);
  }
}
