import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City, District } from './../../model/city';


@Injectable({
  providedIn: 'root'
})
export class CityServiceService {

  private URL = "https://dc.tintoc.net/app/api-customer/public";
  private HTTPOPTIONS = {
    headers: new HttpHeaders({ 
      'Access-Control-Allow-Headers':'Content-Type',
      'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'})
  };

  constructor(private http: HttpClient) { }

  getAllCity():Observable<City[]>{
    return this.http.get<City[]>(`${this.URL}/provinces?page=0&size=100`, this.HTTPOPTIONS);
  }

  getAllDistrict(cityId:Int16Array):Observable<District[]>{
    return this.http.get<District[]>(`${this.URL}/districts?page=0&size=100&provinceId.equals=${cityId}`, this.HTTPOPTIONS);
  }
}
