import { Component, Input, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PaypalServiceService } from 'src/app/services/paypal/paypal-service.service';
import { TicketServiceService } from 'src/app/services/ticket/ticket-service.service';
import { Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';


declare var $: any;
declare var paypal: any;

@Component({
  selector: 'app-paypall',
  templateUrl: './paypall.component.html',
  styleUrls: ['./paypall.component.css'],
})
export class PaypallComponent implements OnInit {
  @Output() newIsLoading = new EventEmitter<boolean>();

  @ViewChild('paypal', { static: true })
  paypalElement!: ElementRef;

  paidFor = false;
  
  inforCustomer:any;
  inforRoute:any;
  inforSeat: any;

  tickets:any[]=[];
  tokenPayPal!: string;

  constructor(private payPallService: PaypalServiceService) {}

  ngOnInit(): void {
    this.tokenPayPal = JSON.parse(sessionStorage.getItem("tokenPayPal")!);
    let description = '';
    let price = 0;
    this.inforCustomer = JSON.parse(sessionStorage.getItem("step3")!);
    this.inforSeat = JSON.parse(sessionStorage.getItem("step2")!);
    this.inforRoute = JSON.parse(sessionStorage.getItem("step1")!);

    if(this.inforSeat.length == 2){
      this.tickets.push(this.inforSeat[0]);
      this.tickets.push(this.inforSeat[1]);
      description =
      'Book ticket two way' +
      this.inforRoute.departure.ben_toi +
      ' ⇒ ' +
      this.inforRoute.destination.ben_toi;
    price = (this.tickets[1].totalMoney + this.tickets[0].totalMoney) / 22000;
    }else{
      this.tickets.push(this.inforSeat);
      description =
      'Book ticket one way' +
      this.inforRoute.departure.ben_toi +
      ' ⇒ ' +
      this.inforRoute.destination.ben_toi;
    price = (this.tickets[0].totalMoney) / 22000;
    }

  
    this.payMent(description, price);
  }

  payMent(description:string, price:number){
    paypal
    .Buttons({
      createOrder: (data:any, actions:any) => {
        return actions.order.create({
          purchase_units: [
            {
              description: description,
              amount: {
                currency_code: 'USD',
                value: price.toFixed(2)
              }
            }
          ]
        });
      },
      onApprove: async (data:any, actions:any) => {
        this.onClose();
        const order = await actions.order.capture();
        this.payPallService.getTransectionPayPal(data.orderID, this.tokenPayPal).subscribe(
          data => {
            let transaction = JSON.stringify(data);
            let ticket = this.onSetTicketToBook(JSON.parse(transaction).purchase_units[0].payments.captures[0].id);
            this.newIsLoading.emit(Object(ticket));
          }
        )
      }
    })
    .render(this.paypalElement.nativeElement);
  }

  onSetTicketToBook(paypalId:any){
    let ticket;
    let slotsOneWay = [];
    let slotsTwoWay = [];
    if(this.inforRoute.isOneWay){
      for(let i of this.tickets[0].seats){
        slotsOneWay.push({
          ten:this.inforCustomer.name,
          so_ghe:i.stt,
          noi_xuong:this.inforRoute.destination.ben_toi,
          dia_chi:this.inforCustomer.district+", "+this.inforCustomer.city
        })
      }
      ticket = {
        gio_chay:this.tickets[0].time,
        gio_ket_thuc:'',
        id_tuyen_xe:this.tickets[0].routerId,
        sdt:this.inforCustomer.phone,
        email:this.inforCustomer.email,
        date:this.inforRoute.daygo,
        gia_ve:this.tickets[0].totalMoney,
        paypal_id: paypalId,
        vnpay_id:'null',
        diem_xuong:this.inforRoute.destination.ben_toi,
        slot:slotsOneWay
      }
    }
    else{
      for(let i of this.tickets[0].seats){
        slotsOneWay.push({
          ten:this.inforCustomer.name,
          so_ghe:i.stt,
          noi_xuong:this.inforRoute.destination.ben_toi,
          dia_chi:this.inforCustomer.district+", "+this.inforCustomer.city
        })
      }
      for(let i of this.tickets[1].seats){
        slotsTwoWay.push({
          ten:this.inforCustomer.name,
          so_ghe:i.stt,
          noi_xuong:this.inforRoute.departure.ben_toi,
          dia_chi:this.inforCustomer.district+", "+this.inforCustomer.city
        })
      }
      ticket = {
        gio_chay:this.tickets[0].time,
        gio_ket_thuc:'',
        id_tuyen_xe:this.tickets[0].routerId,
        sdt:this.inforCustomer.phone,
        email:this.inforCustomer.email,
        date:this.inforRoute.daygo,
        gia_ve:this.tickets[0].totalMoney,

        paypal_id: paypalId,
        diem_xuong:this.inforRoute.destination.ben_toi,
        slot:slotsOneWay,
        vnpay_id:'null',

        gio_chay2:this.tickets[1].time,
        gio_ket_thuc2:'',
        id_tuyen_xe2:this.tickets[1].routerId,
        date2:this.inforRoute.returnday,
        gia_ve2:this.tickets[1].totalMoney,
        diem_xuong2:this.inforRoute.departure.ben_toi,
        slot2:slotsTwoWay
      }
    }
    return ticket;
  }

  onClose() {
    $('#myModalPay').hide();
  }
}
