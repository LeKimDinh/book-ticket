import { Step2 } from './../../../model/book-ticket-steps';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { TicketServiceService } from 'src/app/services/ticket/ticket-service.service';

declare var $:any

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {  
  isLoading = false;
  isSuccess = false;

  isViewMode = false;
  isEditMode = false;

  inforCustomer:any;
  inforRoute:any;
  inforSeat: any;

  logInSuccess: any;

  isSelectTypePay = false;
  isDiscount = false;
  type!:number;

  isCheckTicket:boolean = false;

  tickets:any[]=[];

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private toastr: ToastrService,
    private ticketService: TicketServiceService
  ) { }

  ngOnInit(): void {
    this.route
      .data
      .subscribe(data => {
        if (data && data.isPay) {
          this.isSuccess = false;
        }
        if (data && data.isSuccess) {
          this.isSuccess = true;
        }
      });
    this.inforCustomer = JSON.parse(sessionStorage.getItem("step3")!);
    this.inforSeat = JSON.parse(sessionStorage.getItem("step2")!);
    this.inforRoute = JSON.parse(sessionStorage.getItem("step1")!);
    this.logInSuccess = JSON.parse(localStorage.getItem("LogInSuccess")!);
    
    if(this.inforSeat.length == 2){
      this.tickets.push(this.inforSeat[0]);
      this.tickets.push(this.inforSeat[1]);
    }else{
      this.tickets.push(this.inforSeat);
    }
    if(Number(this.logInSuccess?.discount)>0){
      this.isDiscount = true;
      this.tickets.map(t=>{
        t.totalMoney = ((Number(t.totalMoney)*(100-Number(this.logInSuccess.discount)))/100).toFixed(2);
      })
    }

    if(!this.isSuccess){
      this.checkPayment();
    }
  }

  Loading(ticket: Object){
    this.isLoading = true;
    if(this.inforRoute.isOneWay){             
      this.ticketService.postCreateTicketOneWay(ticket).subscribe(
        data => {
          this.isSuccess = true;
          this.isLoading = false;
          this.toastr.success("Đặt vé thành công");
          this.router.navigate(["/success",this.inforCustomer.email])
        },error => {
          this.isLoading = false;
          this.toastr.warning("Đặt vé thất bại");
        }
      )
    }else{
      this.ticketService.postCreateTicketTwoWay(ticket).subscribe(
        data => {
          this.isLoading = true;
          this.isSuccess = false;
          this.toastr.success("Đặt vé thành công");
          this.router.navigate(["/success",this.inforCustomer.email])
        },error => {
          this.isLoading = false;
          this.toastr.warning("Đặt vé thất bại");
        }
      )
    }
  }

  onSelectTypePay(type: number){
    this.type = type;
    this.isSelectTypePay = true;
    let pay = <HTMLCollection>document.getElementsByClassName("pay-item");
    let length = pay?.length;
    for(let i = 0; i< length; i++){
      pay[i]?.classList?.remove('pay-item-click');
    }
    pay[type]?.classList?.add('pay-item-click');
  }

  onContinue(){
    if(!this.isSelectTypePay){
      this.toastr.warning("Xin hãy chọn hình thức thanh toán!");
      return;
    }

    this.checkPayment();
    if(!this.isCheckTicket)
      $('#myModalPay').show();
    else
      this.toastr.warning("Vé đã được đặt trước!");
  }

  checkPayment(){
    let data = {
      tuyen_id:0,
      date:"",
      hour:"",
      slots:[],
      tuyen_id2:0,
      date2:"",
      hour2:"",
      slots2:[]
    }

    if(this.inforRoute.isOneWay){
      data.tuyen_id = this.inforSeat?.routerId;
      data.date = this.inforRoute?.daygo;
      data.hour = this.inforSeat?.time;
      data.slots = this.inforSeat.seats?.map((s:any)=>s.stt)
    }else{
      data.tuyen_id = this.inforSeat[0]?.routerId;
      data.date = this.inforRoute?.daygo;
      data.hour = this.inforSeat[0]?.time;
      data.slots = this.inforSeat[0]?.seats?.map((s:any)=>s.stt)
      data.tuyen_id2 = this.inforSeat[1]?.routerId;
      data.date2 = this.inforRoute?.returnday;
      data.hour2 = this.inforSeat[1]?.time;
      data.slots2 = this.inforSeat[1]?.seats?.map((s:any)=>s.stt)
    }
    this.ticketService.getCheckTicket(data).subscribe(res=>{
      if(res.data != "Ok"){
        let seat1 = this.convertToSeatLabel(res.data.ve1);
        this.isCheckTicket = true;
        this.toastr.warning(`Tuyến xe ${this.inforRoute.departure.ben_toi} ⇒ ${this.inforRoute.destination.ben_toi} ghế ${seat1} đã đặt rồi!`);
        if(!this.inforRoute.isOneWay){
          let seat2 = this.convertToSeatLabel(res.data.ve2);
          this.toastr.warning(`Tuyến xe ${this.inforRoute.destination.ben_toi} ⇒ ${this.inforRoute.departure.ben_toi} ghế ${seat2} đã đặt rồi!`);
        }

        setTimeout(() =>{         
          if(this.inforRoute.isOneWay){
            if(this.inforSeat.seats?.length > res.data.ve1?.length){
              if(confirm("Bạn có muốn đặt vé cho ghế còn lại!")){
                res.data.ve1?.map((r:any)=>{
                  this.inforSeat?.seats?.forEach((e:any,i:number) => {
                    if(Number(r)==Number(e?.stt)){
                      this.inforSeat?.seats?.splice(i,1);
                    }
                  })
                })
                sessionStorage.setItem("step2", JSON.stringify(this.inforSeat));
                this.isCheckTicket = false;
              }
            };
          } 
        /*   else{
            if(this.inforSeat[0]?.seats?.length > res.data.ve1?.length || 
              this.inforSeat[1]?.seats?.length > res.data.ve2?.length){
              if(confirm("Bạn có muốn đặt vé cho ghế còn lại!")){
                res.data.ve1?.map((r:any)=>{
                  this.inforSeat[0]?.seats?.forEach((e:any,i:number) => {
                    if(Number(r)==Number(e?.stt)){
                      this.inforSeat[0]?.seats?.splice(i,1);
                    }
                  })
                });
                res.data.ve2?.map((r:any)=>{
                  this.inforSeat[1]?.seats?.forEach((e:any,i:number) => {
                    if(Number(r)==Number(e?.stt)){
                      this.inforSeat[1]?.seats?.splice(i,1);
                    }
                  })
                })
                sessionStorage.setItem("step2", JSON.stringify(this.inforSeat));
              }
            };
          } */
        }, 3000);
      }else{
        this.isCheckTicket = false;
      }
    })
  }

  convertToSeatLabel(seat:[]){
    let seatsLabel = "";
    seat.map(v=>{
      if(Number(v)<10){
        seatsLabel += `A0${Number(v)} `;
      }
      else if(Number(v)>=10&&Number(v)<=22){
        seatsLabel += `A${Number(v)} `;
      } 
      else if(Number(v)-22<10&&Number(v)-22>0){
        seatsLabel += `B0${Number(v-22)} `;
      }
      else{
        seatsLabel += `B${Number(v)-22} `;
      }
    })
    return seatsLabel;
  }
}

$(document).mouseup(function(e:any) 
{
  var container = $("#myModalPay");

  if (container.is(e.target)) 
  {
    $('#myModalPay').hide();
  }
});