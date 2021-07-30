import { Component, OnInit } from '@angular/core';
import { CustomerInfor } from '@model/customer';
import { CustomerServiceService } from 'src/app/services/customer/customer-service.service';

@Component({
  selector: 'app-award-point',
  templateUrl: './award-point.component.html',
  styleUrls: ['./award-point.component.css']
})
export class AwardPointComponent implements OnInit {

  customerInfor: CustomerInfor = {} as CustomerInfor;
  customerId!:Int16Array;
  level:string="";

  constructor(private customerService: CustomerServiceService) { }

  ngOnInit(): void {
    this.customerId = JSON.parse(localStorage.getItem("LogInSuccess")!)?.id;
    this.getCustomerInfor(this.customerId);
  }

  getCustomerInfor(customerId:Int16Array){
    this.customerService.getCustomerInfor(customerId).subscribe(
      data => {
        this.customerInfor = data.data;
        if(this.customerInfor.diemTichLuy>=0&&this.customerInfor.diemTichLuy<1000){
          this.level="TV";
        }else if(this.customerInfor.diemTichLuy>=1000&&this.customerInfor.diemTichLuy<2000){
          this.level = "KH V1";
        }else if(this.customerInfor.diemTichLuy>=2000&&this.customerInfor.diemTichLuy<4000){
          this.level = "KH V2";
        }else if(this.customerInfor.diemTichLuy>=4000&&this.customerInfor.diemTichLuy<6000){
          this.level = "KH V3";
        }else {
          this.level = "KH V4";
        }
      }
    )
  }  

}
