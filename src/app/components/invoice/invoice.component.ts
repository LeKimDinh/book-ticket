import { Component, OnInit } from '@angular/core';
import { TicketServiceService } from 'src/app/services/ticket/ticket-service.service';
import { ToastrService } from 'ngx-toastr';
import { PaypalServiceService } from 'src/app/services/paypal/paypal-service.service';
import { BusRouterServiceService } from 'src/app/services/router/bus-router-service.service';
import { Router } from '@model/router';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class InvoiceComponent implements OnInit {
  today: any;
  routeId!: Int16Array;
  runTime!: string;
  phone!: string;
  email!: string;
  
  isShow = false;
  ticket!: any;
  ticketCode = "";
  routes: Router[] = [] as Router[];
  time!: any[];

  isLoad = false;

  constructor(
    private busService: BusRouterServiceService,
    private ticketService: TicketServiceService,
    private toastr: ToastrService,
    private payPalSerice: PaypalServiceService
  ) {}

  ngOnInit(): void {
    let day = new Date();
    this.today = day.getFullYear() +
    '-' +
    ('0' + (day.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + day.getDate()).slice(-2);
    this.onGetAllRoute();
  }

  onGetAllRoute(){
    this.busService.getAllRoute().subscribe(
      data => {
        this.routes = data.data;
        this.routeId = this.routes[0].id;
        this.onGetRunTime(this.routeId, this.today);
      }
    )
  }

  onGetRunTime(id:Int16Array, date: string){
    let dateS = date.split("-");
    let dateR = dateS[2]+"/"+dateS[1]+"/"+dateS[0];
    this.busService.getRunTime(id, dateR).subscribe(
      data => {
        this.time = data.data
        this.runTime = this.time[0].giochay;
      }
    )
  }

  onChangeRoute($event:any){
    this.routeId = $event.value;
    this.onGetRunTime(this.routeId , this.today);
  }

  onChangeDate($event:any){
    this.today = $event.value;
    this.onGetRunTime(this.routeId, this.today);
  }

  onChangeTime($event: any){
    this.runTime = $event.value;
  }

  onSearch() {
    let dateR = this.today.split("-");
    dateR = dateR[2]+"/"+dateR[1]+"/"+dateR[0];
    this.isLoad = true;
    this.ticketService.getTicketByCode(this.runTime,dateR, this.phone, this.routeId, this.email)
    .subscribe(
      (data) => {
        this.isLoad = false;
        if(data.data.length>0){
          this.ticket = data.data;
          this.isShow = true;
          this.ticket.tuyen_xe = this.ticket.tuyen_xe?.replace('->',"⇒");
          data.data.forEach((d: any, i: any)=>{
            this.ticket[i].slots = this.setSeatName(d.slots);     
          })
        }
        else{
          this.toastr.warning('Hiện không có thông tin vé.');
        }
      },
      () => {
        this.isLoad = false;
        this.isShow = false;
        this.toastr.warning('Hiện không có thông tin vé.');
      }
    );
  }

  setSeatName(seat:any[]){
    let seats: string[] = [];

    seat.forEach((s,i)=>{
      let value = Number(s);
      if(value<10){
        seats.push("A0"+i);
      }
      else if(value>=10&&value<=22){
        seats.push("A"+i);
      }
      else if(value-22<10&&value-22>0){
        seats.push("B0"+(value-22));
      }
      else{
        seats.push("B"+(value-22));
      }
    })
    return seats;
  }

  onBack() {
    this.isShow = false;
  }

  onCancel(billId: Int16Array) {
    this.isLoad = true;
    this.payPalSerice.getRefund(billId).subscribe(
      data => {
        this.isLoad = false;
        this.toastr.success("Hủy vé thành công");
        this.onSearch();
      },error=>{
        this.isLoad = false;
        this.toastr.warning("Hủy vé thất bại");
      }
    )
  }
}
