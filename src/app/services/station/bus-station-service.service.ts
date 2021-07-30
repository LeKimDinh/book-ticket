import { BaseServiceService } from '@baseService/base-service.service';
import { BusStation } from 'src/app/model/bus-station';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class BusStationServiceService extends BaseServiceService {
  private URL = environment.baseUrl + '/ben';

  constructor(http: HttpClient) {
    super(http);
  }

  getAllBusStation() {
    return this.onGet(`${this.URL}`);
  }

  getDestinationStationsById(id: any) {
    return this.onGet(`${this.URL}/get-list-ben-toi?ben_di_id=${id}`);
  }

  getDestinationStationNotRelaionshipById(id: any) {
    return this.onGet(`${this.URL}/get-list-ben-custom-by-id?id_ben_toi=${id}`);
  }

  getBusStationDetailById(id: Int16Array) {
    return this.onGet(`${this.URL}/get-detail/${id}`);
  }

  postCreateStation(busStation: any) {
    let url = `${this.URL}/create`;
    return this.onPost(url, busStation);
  }

  postUpdateStation(busStationID: Int16Array, busStation: any) {
    let url = `${this.URL}/${busStationID}/update`;
    return this.onPost(url, busStation);
  }

  getBusStationNumber() {
    return this.onGet(`${this.URL}/get-count-ben`);
  }

  getBusStationRevenue(year: number, busStationId: number) {
    let time = '01/01/' + year;
    return this.onGet(
      `${this.URL}/thong-ke-ben-in-year?time=${time}&id_ben=${busStationId}`
    );
  }
}
