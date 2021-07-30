import { ToastrService } from 'ngx-toastr';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { UserAccount } from '@model/account';
import { City, District } from '@model/city';
import { AdminServiceService } from 'src/app/services/admin/admin-service.service';
import { CityServiceService } from 'src/app/services/city/city-service.service';
import { CustomerServiceService } from 'src/app/services/customer/customer-service.service';

declare var $: any;

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.css'],
})
export class AccountManagementComponent implements OnInit {
  @ViewChild('someElement')
  someElementRef!: ElementRef;

  isShowForm = false;
  isAdd = false;
  isSubmit = false;
  isLoad = true;

  accountForm!: FormGroup;

  accounts: UserAccount[] = [] as UserAccount[];
  cities: City[] = [] as City[];
  districts: District[] = [] as District[];

  constructor(
    private fb: FormBuilder,
    private cityService: CityServiceService,
    private customerService: CustomerServiceService,
    private adminService: AdminServiceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.onFormInit();
    this.onGetCities();
    this.onGetAllAccount();
  }

  onGetAllAccount() {
    this.isLoad = true;
    this.customerService.getAllUser().subscribe((data) => {
      this.accounts = data.data;
      this.isLoad = false;
    });
  }

  onGetCities() {
    this.cityService.getAllCity().subscribe(
      (data) => {
        this.cities = data;
        this.accountForm.controls.city.setValue(this.cities[0]);
      }
    );
  }

  onGetDistricts(cityId: Int16Array){
    this.cityService.getAllDistrict(cityId).subscribe(
      (data) => {
        this.districts = data;
        this.accountForm.controls.district?.setValue(this.districts[0].id);
      }
    );
  }

  onSelectCity(city: any) {
    this.accountForm.controls?.city?.setValue(city.value);
    this.onGetDistricts(city.value);
  }

  onFormInit() {
    this.accountForm = this.fb.group({
      customerId: new FormControl(null),
      customerName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      user: new FormControl(null, Validators.required),
      passWord: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.required),
      identifi: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      city: new FormControl({} as City, Validators.required),
      district: new FormControl(null, Validators.required),
    });
  }

  onShow(type: boolean, data: any = null) {
    this.isShowForm = true;
    this.isAdd = type;
    if (!this.isAdd) {
      this.onSetValueForm(data);
    } else {
      this.onResetValueForm();
    }

    this.someElementRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  onResetValueForm() {
    this.accountForm.patchValue({
      customerId: null,
      user: null,
      customerName: null,
      email: null,
      passWord: null,
      phone: null,
      identifi: null,
      address: null,
      district: {},
      city: null,
    });
  }

  onSetValueForm(data: UserAccount) {
    this.accountForm.patchValue({
      customerName: data.ten_kh,
      email: data.email,
      user: data.tai_khoan,
      passWord: data.mat_khau,
      phone: data.sdt,
      identifi: data.cmnd,
      address: data.dia_chi,
      city: this.onGetCityIdByLabel(data?.thanh_pho),
      district: this.onGetDistrictIdByLabel(data?.quan_huyen),
      customerId: data.id,
    });
    this.onGetDistricts(this.accountForm?.controls?.city.value);
  }

  onSave() {
    this.isSubmit = true;

    let userAccount = {
      tai_khoan: this.accountForm.controls.user.value,
      mat_khau: this.accountForm.controls.passWord.value,
      ten: this.accountForm.controls.customerName.value,
      email: this.accountForm.controls.email.value,
      sdt: this.accountForm.controls.phone.value,
      cmnd: this.accountForm.controls.identifi.value,
      dia_chi: this.accountForm.controls.address.value,
      quan_huyen: this.onGetDistrictLabelById(this.accountForm?.controls?.district?.value),
      thanh_pho: this.onGetCityLabelById(this.accountForm?.controls?.city?.value),
    };

    if(this.accountForm.invalid){
      return;
    }

    if (!this.isAdd) {
      //update account
      this.adminService
        .postUpdateAccount(
          userAccount,
          this.accountForm.controls.customerId.value
        )
        .subscribe(
          () => {
            this.isSubmit = false;
            this.onLoadData();
            this.toastr.success('Chỉnh sửa tài khoản thành công');
          },
          () => {
            this.toastr.warning('Chỉnh sửa tài khoản thất bại');
          }
        );
    } else {
      //add account
      this.adminService.postCreateAccount(userAccount).subscribe(
        () => {
          this.isSubmit = false;
          this.onLoadData();
          this.toastr.success('Thành công', 'Tạo thành công');
        },
        () => {
          this.toastr.warning('Thông báo', 'Tạo thất bại');
        }
      );
    }
  }

  onGetCityIdByLabel(cityLabel: string){
    return  this.cities?.find(c=> c?.name?.normalize('NFC') === cityLabel?.normalize('NFC'))?.id;
  }

  onGetDistrictIdByLabel(districtLabel: string){
    return this.districts?.find(d=>d?.name?.normalize('NFC')===districtLabel?.normalize('NFC'))?.id;
  }

  onGetCityLabelById(id:Int16Array){
    return this.cities?.find(c=>Number(c.id)===Number(id))?.name;
  }

  onGetDistrictLabelById(id:Int16Array){
    return this.districts?.find(c=>Number(c.id)===Number(id))?.name;
  }
}
