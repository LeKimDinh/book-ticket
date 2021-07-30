import { error } from '@angular/compiler/src/util';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Customer, LogIn } from 'src/app/model/customer';
import { CustomerServiceService } from 'src/app/services/customer/customer-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() signUp = new EventEmitter<Boolean>(false);
  @Output() logInSuccess = new EventEmitter<Object>();

  formLogIn!: FormGroup;

  customerInfor!: Customer;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
   this.formLogIn = this.fb.group({
     userName:[null,[Validators.required]],
     passWord:[null,[Validators.required]]
   })
  }

  
  onLogIn(){
    var logInInfor : LogIn = {
      tai_khoan : this.formLogIn.get('userName')?.value,
      mat_khau : this.formLogIn.get('passWord')?.value
    }
    this.logInSuccess.emit(logInInfor);
  }


  onSignUp(){
   this.signUp.emit(true)
  }

}
