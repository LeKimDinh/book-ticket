import { CustomerInfor } from './../../../model/customer';
import { District, City } from '@model/city';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CityServiceService } from 'src/app/services/city/city-service.service';
import { CustomerServiceService } from 'src/app/services/customer/customer-service.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-infor-customer',
  templateUrl: './infor-customer.component.html',
  styleUrls: ['./infor-customer.component.css'],
})
export class InforCustomerComponent implements OnInit {
  logInSuccess: any;
  oneWay = true;
  isLoad = true;
  isSubmit = false;
  isAcceptPolicy = false;

  customerForm!: FormGroup;

  cities: City[] = [];
  districts: District[] = [];

  customerInfor: CustomerInfor = {} as CustomerInfor;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private cityService: CityServiceService,
    private customerService: CustomerServiceService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.customerForm = this.onCreateForm(this.customerForm);
    this.onGetCities();
  }

  load(){
    this.logInSuccess = JSON.parse(localStorage.getItem("LogInSuccess")!);
    if(this.customerInfor.thanhPho==undefined){
      this.customerInfor.thanhPho = '';
    }
    if(this.logInSuccess!=null){
      this.onGetCustomerInfor(this.logInSuccess?.id);
    }else{
      this.isLoad = false;
    }
  }

  onGetCustomerInfor(customerId: Int16Array){
    this.isLoad = true;
    this.customerService.getCustomerInfor(customerId).subscribe(
      data => {
        this.isLoad = false;
        this.customerInfor = data.data;
        this.onSetValueForm(this.customerInfor);
      },error => {
        console.log(error);
      }
    )
  }

  onSetValueForm(data: any){
    this.customerForm.controls?.customerName?.setValue(data?.tenKh);
    this.customerForm.controls?.phone?.setValue(data?.sdt);
    this.customerForm.controls?.email?.setValue(data?.email);
    let city = this.cities?.find(c =>
      c.name==data?.thanhPho
    )!;

    if(city != undefined){
      this.cities?.shift();
      this.cities?.unshift(city);
      this.customerForm.controls?.city?.setValue("");
      this.customerForm.controls?.district?.setValue("");
      this.onGetDistrict(city.id);
    }else{
      this.onGetDistrict(this.cities[0]?.id);
    }
    

    this.customerForm.controls?.city?.setValue(data?.thanhPho);
    this.customerForm.controls?.district?.setValue(data?.quanHuyen);
  }

  onContinue() {
    this.isSubmit = true;
    if (this.customerForm?.invalid) {
      return;
    }
    if (!this.isAcceptPolicy) {
      this.toastr.warning(
        'Xin hãy chấp nhận điều khoản của chúng tôi.'
      );
      return;
    }

    let customerInfor = {
      name: this.customerForm.controls?.customerName?.value,
      phone: this.customerForm.controls?.phone?.value,
      email: this.customerForm.controls?.email?.value,
      city: this.customerInfor?.thanhPho,
      district: this.customerForm.controls?.district?.value,
    };

    sessionStorage.setItem("step3",JSON.stringify(customerInfor));
    this.router.navigate(["/confirm-infor",customerInfor?.email])
  }

  onGetCities() {
    this.cityService.getAllCity().subscribe(
      (data) => {
        this.cities = data;
        this.load();
        this.customerForm.controls?.city?.setValue(this.cities[0]);
      },
      (error) => {
        console.log(error);
        this.cities = [];
      }
    );
  }

  onCreateForm(fb: FormGroup) {
    fb = this.fb.group({
      customerName: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      city: new FormControl("", Validators.required),
      district: new FormControl("", Validators.required),
    });
    return fb;
  }

  onCheck() {
    this.isAcceptPolicy = !this.isAcceptPolicy;
  }

  onSelectCity(city: any) {
    this.customerInfor.thanhPho = this.cities?.find(c=>c.id==city?.value)?.name!;
    this.customerForm.controls?.city?.setValue(this.customerInfor?.thanhPho);
    this.onGetDistrict(city?.value);
  }

  onSelectDistrict(district: any){
    this.customerForm.controls.district.setValue(district?.value);
  }

  onGetDistrict(cityId: Int16Array){
    this.cityService.getAllDistrict(cityId).subscribe(
      (data) => {
        this.districts = data;
        this.customerForm.controls?.district?.setValue(this.districts[0]?.name);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onBack(){
   this._location.back();
  }
}
