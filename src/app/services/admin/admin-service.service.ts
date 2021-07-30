import { HttpClient } from '@angular/common/http';
import { BaseServiceService } from '@baseService/base-service.service';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminServiceService extends BaseServiceService {
  private URL = environment.baseUrl + '/admin';

  constructor(http: HttpClient) {
    super(http);
  }

  postCreateAccount(account: any) {
    let url = `${this.URL}/create`;
    return this.onPost(url, account);
  }

  postUpdateAccount(account:any, id:Int16Array){
    return this.onPost(`${this.URL}/update/${id}/`,account)
  }
}
