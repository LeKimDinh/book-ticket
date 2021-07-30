import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerInfor } from '@model/customer';

import { CustomerServiceService } from 'src/app/services/customer/customer-service.service';

@Component({
  selector: 'app-infor-account',
  templateUrl: './infor-account.component.html',
  styleUrls: ['./infor-account.component.css'],
})
export class InforAccountComponent implements OnInit {
  customer!: CustomerInfor;
  customerId!: any;
  isShow = false;
  showPassword1 = 'password';
  showPassword2 = 'password';
  showPassword3 = 'password';
  isLoad = false;
  form!: FormGroup;

  constructor(
    private customerService: CustomerServiceService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customer = {} as CustomerInfor;
    this.form = this.onCreateFormGroup(this.form);
    let customer = JSON.parse(localStorage.getItem('LogInSuccess')!);
    this.customerId = customer.id;
    this.getCustomerInfor(this.customerId);
  }

  getCustomerInfor(customerId: Int16Array) {
    this.customerService.getCustomerInfor(customerId).subscribe((data) => {
      this.customer = data.data;
    });
  }

  onShowEditInfor() {
    this.isShow = true;
  }

  onShowPassword(type: number) {
    if (type == 0) {
      this.showPassword1 = this.showPassword1 == 'text' ? 'password' : 'text';
    }
    if (type == 1) {
      this.showPassword2 = this.showPassword2 == 'text' ? 'password' : 'text';
    }
    if (type == 2) {
      this.showPassword3 = this.showPassword3 == 'text' ? 'password' : 'text';
    }
  }

  onSubmit() {
    this.isLoad = true;
    this.customerService
      .postChangePassWord(
        this.customer.taiKhoan,
        this.form.controls.oldPassWord.value,
        this.form.controls.newPassWord.value
      )
      .subscribe((data) => {
        if (data.message == 'Đổi mật khẩu thành công') {
          sessionStorage.removeItem('LogInSuccess');
          this.router.navigate(['/']);
        }
        this.isLoad = false;
      });
  }

  onCreateFormGroup(fg: FormGroup) {
    fg = this.fb.group({
      oldPassWord: new FormControl('', Validators.required),
      newPassWord: ['', Validators.required],
      confirmPassWord: ['', Validators.required],
    });
    return fg;
  }
}
