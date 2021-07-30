import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ZaloPayService } from 'src/app/services/zalo-pay/zalo-pay.service';

declare var $: any;

@Component({
  selector: 'app-zalopay',
  templateUrl: './zalopay.component.html',
  styleUrls: ['./zalopay.component.css'],
})
export class ZalopayComponent implements OnInit {
  @Output() newIsLoading = new EventEmitter<boolean>();

  inforCustomer: any;
  inforRoute: any;
  inforSeat: any;

  tickets: any[] = [];
  constructor(private zaloPay: ZaloPayService) {}

  ngOnInit(): void {
    this.inforCustomer = JSON.parse(sessionStorage.getItem('step3')!);
    this.inforSeat = JSON.parse(sessionStorage.getItem('step2')!);
    this.inforRoute = JSON.parse(sessionStorage.getItem('step1')!);
    if (this.inforSeat.length == 2) {
      this.tickets.push(this.inforSeat[0]);
      this.tickets.push(this.inforSeat[1]);
    } else {
      this.tickets.push(this.inforSeat);
    }
  }

  onZaloPay() {
    let ticket = this.onSetTicketToBook();

    let typeTicket = this.inforRoute.isOneWay ? '1 chiều' : 'khứ hồi';

    let description =
      'Thanh toán vé ' +
      typeTicket +
      ' cho tuyến ' +
      this.inforRoute.departure?.ben_toi +
      ' ⇒ ' +
      this.inforRoute.destination?.ben_toi;

      this.zaloPay.onGetZaloPay(description, ticket).subscribe(
        data => {
          window.location.assign(data.data.order_url);
        }
      )
  }

  onSetTicketToBook() {
    let ticket;
    let slotsOneWay = [];
    let slotsTwoWay = [];

    if (this.inforRoute.isOneWay) {
      for (let i of this.tickets[0].seats) {
        slotsOneWay.push({
          ten: this.inforCustomer.name,
          so_ghe: i.stt,
          noi_xuong: this.inforRoute.destination.ben_toi,
          dia_chi: this.inforCustomer.district+", "+this.inforCustomer.city,
          
        });
      }
      ticket = {
        gio_chay: this.tickets[0].time,
        gio_ket_thuc: '',
        id_tuyen_xe: this.tickets[0].routerId,
        sdt: this.inforCustomer.phone,
        email: this.inforCustomer.email,
        date: this.inforRoute.daygo,
        gia_ve: this.tickets[0].totalMoney,

        diem_xuong: this.inforRoute.destination.ben_toi,
        slot: slotsOneWay,
      };
    } else {
      for (let i of this.tickets[0].seats) {
        slotsOneWay.push({
          ten: this.inforCustomer.name,
          so_ghe: i.stt,
          noi_xuong: this.inforRoute.destination.ben_toi,
          dia_chi: this.inforCustomer.district+", "+this.inforCustomer.city,
        });
      }
      for (let i of this.tickets[1].seats) {
        slotsTwoWay.push({
          ten: this.inforCustomer.name,
          so_ghe: i.stt,
          noi_xuong: this.inforRoute.departure.ben_toi,
          dia_chi: this.inforCustomer.district+", "+this.inforCustomer.city,
        });
      }
      ticket = {
        gio_chay: this.tickets[0].time,
        gio_ket_thuc: '',
        id_tuyen_xe: this.tickets[0].routerId,
        sdt: this.inforCustomer.phone,
        email: this.inforCustomer.email,
        date: this.inforRoute.daygo,
        gia_ve: this.tickets[0].totalMoney,
        diem_xuong: this.inforRoute.destination.ben_toi,
        slot: slotsOneWay,

        gio_chay2: this.tickets[1].time,
        gio_ket_thuc2: '',
        id_tuyen_xe2: this.tickets[1].routerId,
        date2: this.inforRoute.returnday,
        gia_ve2: this.tickets[1].totalMoney,
        diem_xuong2: this.inforRoute.departure.ben_toi,
        slot2: slotsTwoWay,
      };
    }
    return ticket;
  }

  onClose() {
    $('#myModalPay').hide();
  }
}
