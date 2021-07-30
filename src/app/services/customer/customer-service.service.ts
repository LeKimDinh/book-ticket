import { UpdateCustomer } from '@model/customer';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogIn,Customer } from 'src/app/model/customer';
import { environment } from "@env/environment";
import { BaseServiceService } from "@baseService/base-service.service";

@Injectable({
  providedIn: 'root'
})

export class CustomerServiceService extends BaseServiceService {

  private URL = environment.baseUrl+"/khach-hang";


  constructor(http: HttpClient) {
    super(http)
   }

  postLogIn(logIn: LogIn){
    return this.onPost(`${this.URL}/login`,logIn);
  }

  getLogOut(){
    let url = `${this.URL}/logout`;
    return this.onGet(url);
  }

  postChangePassWord(userName: string, passWordOld: string, password: string){
    let url = `${this.URL}/change-password?user_name=${userName}&password_old=${passWordOld}&password=${password}`;
    return this.onPost(url,null);
  }

  getCustomerInfor(customerId:Int16Array){
    let url = `${this.URL}/${customerId}`;
    return this.onGet(url)
  }

  getAllUser(){
    let url = `${this.URL}/get-all-user`;
    return this.onGet(url);
  }

  postChangePersionalInfor(customerId: Int16Array, customerInfor: UpdateCustomer){
    let url = `${this.URL}/update/${customerId}/`;
    return this.onPost(url,customerInfor);
  }

  getPointCustomer(customerId: Int16Array){
    let url = `${this.URL}/get-detail-point/${customerId}`;
    return this.onGet(url);
  }

  postCreateAccount(customer:any){
    return this.onPost(`${this.URL}/create`,customer);
  }

  getAccountNumber(){
    return this.onGet(`${this.URL}/get-count-user`);
  }

}
