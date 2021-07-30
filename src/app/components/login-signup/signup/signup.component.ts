import { CustomerServiceService } from './../../../services/customer/customer-service.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { District } from './../../../model/city';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { City } from '@model/city';
import { CityServiceService } from 'src/app/services/city/city-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  @Output() backToLogIn = new EventEmitter<Object>();

  isShow = false;
  typeInput = 'password';
  form!: FormGroup;

  cities: City[] = [] as City[];
  districts: District[] = [] as District[];

  constructor(
    private cityService: CityServiceService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.onGetCities();
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      account: [null, Validators.required],
      password: [null, Validators.required],
      phone: [null],
      identify: [null],
      email: [null, [Validators.email, Validators.required]],
      city: [null],
      district: [null],
    });
  }

  onBackToLogIn() {
    this.backToLogIn.emit(true);
  }

  onSignUpSuccess() {
    if (this.form.controls.email.invalid) {
      this.toastr.warning('Thông tin email không hợp lệ hoặc chưa có!');
      return;
    }
    if (this.form.invalid) {
      this.toastr.warning('Thông tin không hợp lệ!');
      return;
    }
    
    let customer = {
      tai_khoan: this.form.controls.account.value,
      mat_khau: this.form.controls.password.value,
      email: this.form.controls.email.value,
      ten: this.form.controls.account.value,
      sdt: this.form.controls.phone.value,
      cmnd: this.form.controls.identify.value,
      thanh_pho: this.form.controls.city.value,
      quan_huyen: this.form.controls.district.value,
      dia_chi: this.form.controls.city.value +","+this.form.controls.district.value
    };
    this.backToLogIn.emit(customer);

  }

  onShowPassword() {
    this.isShow = !this.isShow;
    this.typeInput = this.typeInput == 'text' ? 'password' : 'text';
  }

  onGetCities() {
    this.cityService.getAllCity().subscribe((data) => {
      this.cities = data;
      this.form.controls.city.setValue(this.cities[0].name);
    });
  }

  onDistrictsById(id: Int16Array) {
    this.cityService.getAllDistrict(id).subscribe((data) => {
      this.districts = data;
      this.form.controls.district.setValue(this.districts[0].name);
    });
  }

  onChangeCity($event: any) {
    let city = this.cities.find((c) => c.id == $event.value);
    this.form.controls.city.setValue(city?.name);
    this.onDistrictsById($event.value);
  }

}
