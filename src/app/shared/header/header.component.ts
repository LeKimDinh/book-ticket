import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/model/customer';
import { Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomerServiceService } from 'src/app/services/customer/customer-service.service';
import { resolve } from 'dns';

declare var $:any

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  email = "lekimdinh1412@gmail.com";
  isLoad = false;
  title = "Đăng Nhập";
  signUp = false;

  logInSuccess = false;
  isAdmin = false;

  customer: Customer = {} as Customer;
  

  @Input() index:number = 0;
  @Input() pointAward = "";
  @Input() totalPoint = "";

  constructor(
    private router:Router, 
    private customerService: CustomerServiceService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    if(localStorage.getItem("LogInSuccess")!=null){
      this.logInSuccess = true;
      this.customer = JSON.parse(localStorage.getItem("LogInSuccess")!);
      let role = new Array(this.customer.Roles)
      if(role[0]?.toString()=="ROLE_ADMIN"){
        this.isAdmin = true;
      }
    }
    else this.logInSuccess = false;

  }

  onClick(){
    var navList = document.getElementsByClassName('nav');
    navList[0].classList.toggle('collapse');
  }

  onLogIn(){
    $('#myModal').show();
    this.signUp = false;
  }

  onTicketBookingHistory(){
    if(this.customer.email==null){
      this.customer = JSON.parse(localStorage.getItem("LogInSuccess")!);
    }
    this.router.navigate(["/ticket-booking-history/",this.customer.email]);
  }

  onDashboard(){
    this.router.navigate(["/dashboard"]);
  }

  onInforAccount(){
    if(this.customer.email==null){
      this.customer = JSON.parse(localStorage.getItem("LogInSuccess")!);
    }
    this.router.navigate(["/infor-account/", this.customer.email]);
  }

  onInforIndividual(){
    if(this.customer.email==null){
      this.customer = JSON.parse(localStorage.getItem("LogInSuccess")!);
    }
    this.router.navigate(["/infor-individual/", this.customer.email]);
  }

  onAwardPoint(){
    if(this.customer.email==null){
      this.customer = JSON.parse(localStorage.getItem("LogInSuccess")!);
    }
    this.router.navigate(["/point-award/", this.customer.email]);
  }

  onLogOut(){
    this.isAdmin = false;
    localStorage.removeItem("LogInSuccess");
    this.customer = {
      id:0,
      ten_khach_hang: '',
      email: '',
      discount: 0,
      Token: '',
      Roles: []
    };
    this.router.navigate(["/"]);
  }

  onShowMenuUser(){
    $('#infor-user').toggle('show');
  }

  onClose(){
    $('#myModal').hide();
  }

  onLogInSucess(event:any){
    $("#waiting").show();
    $('#myModal').hide();
    this.customerService.postLogIn(event).subscribe(res=>{
      if(res.Token==2){
        this.toastr.info("Xin hãy vào gmail xác nhận tài khoản sau khi đăng ký!");
        $('#waiting').hide();
        return;
      }
      this.customer = res;
      if(this.customer.Roles==null){
        this.toastr.warning('Sai tài khoản mật khẩu!');
        this.logInSuccess = false;
      }
      else {
        localStorage.setItem("LogInSuccess", JSON.stringify(this.customer))
        this.logInSuccess = true;
        if(res.Roles[0]=="ROLE_ADMIN"){
          this.router.navigate(['/dashboard']);
          this.isAdmin = true;
        }
      }
      $('#waiting').hide();
    },()=>{
      $("#waiting").hide()
    })
  }

  onGoSignUp(event:any){
    this.signUp = event;
  }

  onBackToLogIn(event:any){
    this.signUp = false;
    $("#waiting").show();
    $('#myModal').hide();
    this.customerService.postCreateAccount(event).subscribe((data) => {
      if(confirm("Vào gmail để xác nhận tài khoản")){
        window.location.assign("https://accounts.google.com/signin");
      }
      $("#waiting").hide()
    },()=>{
      this.toastr.warning("Tạo tài khoản thất bại!");
      $("#waiting").hide()
    })
  }

}

$(document).mouseup(function(e:any) 
{
  var container = $("#myModal");

  if (container.is(e.target)) 
  {
    container.hide();
  }
});