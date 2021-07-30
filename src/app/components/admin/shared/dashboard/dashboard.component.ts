
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from '@model/customer';
import { CustomerServiceService } from 'src/app/services/customer/customer-service.service';

declare var $:any

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isShowComponent = 0;
  customer: Customer = {} as Customer;

  constructor(private customerService: CustomerServiceService
    ,private router: Router) { }

  ngOnInit(): void {
    this.customer = JSON.parse(localStorage.getItem("LogInSuccess")!);
    this.load();
  }

  load(){
    this.onCheckClickMenu(0);
    this.onSelectComponent(0);
  }

  onShowAdmin(){
    $("#infor-user").toggle('show');
  }

  onHome(){
    this.router.navigate(["/"]);
  }

  onCheckClickMenu(index:any){
    var listItem = document.getElementsByClassName("list-items");
 
    var listLi = listItem[0]?.getElementsByClassName("item-admin");
  
    for(let i = 0; i< 6; i++){
      if(i!=index)
        listLi[i]?.classList?.add('no-pick');
      else{
        listLi[i]?.classList?.add('pick');
        listLi[i]?.classList?.remove('no-pick');
      }
    }

    this.onSelectComponent(index);
  }

  onSelectComponent(index:any){
    this.isShowComponent = index;
  }

  onLogOut(){
    localStorage.removeItem("LogInSuccess");
    this.router.navigate(["/"]);
  }

}
