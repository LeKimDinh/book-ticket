import { Customer, CustomerInfor, UpdateCustomer } from '@model/customer';
import { Component, OnInit } from '@angular/core';
import { CustomerServiceService } from 'src/app/services/customer/customer-service.service';
import { CityServiceService } from 'src/app/services/city/city-service.service';
import { City, District } from 'src/app/model/city';

@Component({
  selector: 'app-infor-individual',
  templateUrl: './infor-individual.component.html',
  styleUrls: ['./infor-individual.component.css']
})
export class InforIndividualComponent implements OnInit {

  customer!:CustomerInfor;
  updateCustomer!:UpdateCustomer;
  cities!: City[];
  districts!: District[];
  isLoad = false;
  selectCity!:string;
  selectDistrict!:string;

  constructor(private customerService: CustomerServiceService,
    private cityService: CityServiceService  
  ) { }

  ngOnInit(): void {
    this.customer = {} as CustomerInfor;
    let logIn = JSON.parse(localStorage.getItem("LogInSuccess")!);
    this.getCustomerInfor(logIn?.id);
    this.getAllCity();
  }

  getCustomerInfor(id:Int16Array){
    this.customerService.getCustomerInfor(id).subscribe(
      data  => {
        this.customer = data.data;
      } 
    );
  }

  onSelectCity(event:any){
    this.selectCity = this.cities.find(city=>city.id==event.value)!.name; 

    this.getAllDistrict(event.value);
  }

  onSelectDistrict(event:any){
    this.selectDistrict = event.value;
  }

  getAllCity(){
    this.cityService.getAllCity().subscribe(
      data => {
        this.cities = data;

      }
    )
  }

  getAllDistrict(cityId:Int16Array){
    this.cityService.getAllDistrict(cityId).subscribe(
      data => {
        this.districts = data;
        this.selectDistrict = this.districts[0].name;
        
      }
    );
  }

  createCustomerInformation(){
    this.isLoad = true;
    this.updateCustomer = {
      id:this.customer.id, 
      email: this.customer.email,
      ten: this.customer.tenKh,
      sdt: this.customer.sdt,
      cmnd: this.customer.cmnd,
      dia_chi: this.customer.diaChi,
      thanh_pho: this.selectCity,
      quan_huyen: this.selectDistrict
    }


    this.customerService.postChangePersionalInfor(this.updateCustomer.id, this.updateCustomer).subscribe(
      data => {
        this.customer = data.data;
        this.isLoad = false;
      }
    )
  }

}
