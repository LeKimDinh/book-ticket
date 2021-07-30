import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BusRouterServiceService } from 'src/app/services/router/bus-router-service.service';
import { ToastrService } from 'ngx-toastr';
import { BusRouter } from '@model/bus-router';
import { seat, Seat } from '@model/seats';
import { SeatServiceService } from 'src/app/services/seat/seat-service.service';
import { SetSeatDependencyFloor } from '../type-bus/bus-44';
import { Step2 } from './../../../model/book-ticket-steps';
import { onCompareDate } from 'src/app/shared/compare-date/compare-date';
import {Location} from '@angular/common';

@Component({
  selector: 'app-select-seats-two-way',
  templateUrl: './select-seats-two-way.component.html',
  styleUrls: ['./select-seats-two-way.component.css'],
})
export class SelectSeatsTwoWayComponent implements OnInit {
  price = 250000;
  totalPriceGo = 0;
  totalPriceReturn = 0;

  isExpiredGo = false;
  isExpiredReturn = false;

  isBanGo: boolean = false;
  isBanReturn: boolean = false;
  isHaveRoute: boolean = true;

  dateGo!: string;
  dateReturn!: string;
  dateNow!: string;

  floor!: number;

  isLoadGo = true;
  isLoadReturn = true;

  step1: any;
  step2s: Step2[] = [] as Step2[];

  busRouterGo: BusRouter = {} as BusRouter;
  busRouterReturn: BusRouter = {} as BusRouter;

  listTimeGo: any[] = [];
  listAMGo: any[] = [];
  listNoonGo: any[] = [];
  listPMGo: any[] = [];

  listTimeReturn: any[] = [];
  listAMReturn: any[] = [];
  listNoonReturn: any[] = [];
  listPMReturn: any[] = [];

  timeGo!: string;
  timeReturn!: string;

  messageGo: string = "Tuyến ";
  messageReturn: string = "Tuyến ";

  seatsGo: Seat = {} as Seat;
  listSeatsChooseGo: seat[] = [] as seat[];
  listSeatsFloor1Go: any[] = [];
  listSeatsFloor2Go: any[] = [];

  seatsReturn: Seat = {} as Seat;
  listSeatsChooseReturn: seat[] = [] as seat[];
  listSeatsFloor1Return: any[] = [];
  listSeatsFloor2Return: any[] = [];

  constructor(
    private router: Router,
    private seatsService: SeatServiceService,
    private routerService: BusRouterServiceService,
    private toastr: ToastrService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.load();
  }

  onContinue() {
    if (this.listSeatsChooseGo.length == 0) {
      this.toastr.warning('Xin hãy chọn ghế xe đi');
      return;
    }

    if (this.listSeatsChooseReturn.length == 0) {
      this.toastr.warning('Xin hãy chọn ghế xe về');
      return;
    }

    let step2Go: Step2 = {
      routerId: this.busRouterGo.id,
      time: this.timeGo,
      boardingPoint: {
        id: 0,
        name: '',
      },
      seats: this.listSeatsChooseGo,
      number: this.listSeatsChooseGo.length,
      totalMoney: this.totalPriceGo,
    };

    let step2Return: Step2 = {
      routerId: this.busRouterReturn.id,
      time: this.timeReturn,
      boardingPoint: {
        id: 0,
        name: '',
      },
      seats: this.listSeatsChooseReturn,
      number: this.listSeatsChooseReturn.length,
      totalMoney: this.totalPriceReturn,
    };

    this.step2s.push(step2Go);
    this.step2s.push(step2Return);
    sessionStorage.setItem('step2', JSON.stringify(this.step2s));
    this.router.navigate(['/infor-customer']);
  }

  onChangeTime(time: any, type: number) {
    if (type == 0) {
      if(this.isBanGo){
        this.toastr.info(this.messageGo);
        return;
      }
      this.onGetSeatsStatus(
        this.busRouterGo.id,
        time.value,
        this.step1.daygo,
        type
      );
      this.listSeatsChooseGo = [];
      this.totalPriceGo = 0;
      this.timeGo = time.value;
    } else {
      if(this.isBanReturn){
        this.toastr.info(this.messageReturn);
        return;
      }
      this.onGetSeatsStatus(
        this.busRouterReturn.id,
        time.value,
        this.step1.returnday,
        type
      );
      this.listSeatsChooseReturn = [];
      this.totalPriceReturn = 0;
      this.timeReturn = time.value;
    }
  }

  load() {
    this.step1 = JSON.parse(sessionStorage.getItem('step1')!);
    this.messageGo += this.step1.departure.ben_toi +
    ' ⇒ ' + this.step1.destination.ben_toi;

    this.messageReturn += this.step1.destination.ben_toi +
    ' ⇒ ' + this.step1.departure.ben_toi;

    let date = this.step1.daygo.split('/');
    this.dateGo = date[2] + '-' + date[1] + '-' + date[0];

    date = this.step1.returnday.split('/');
    this.dateReturn = date[2] + '-' + date[1] + '-' + date[0];

    this.dateNow =
      new Date().getFullYear() +
      '-' +
      ('0' + (new Date().getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + new Date().getDate()).slice(-2);

    this.onGetRouterIdById(
      this.step1.departure.id,
      this.step1.destination.id,
      this.step1.daygo,
      0
    );

    this.onGetRouterIdById(
      this.step1.destination.id,
      this.step1.departure.id,
      this.step1.returnday,
      1
    );
  }

  onBook(value: any, type: number) {
    if (type == 0) {
      var tdS = document.getElementsByClassName('seatGo');
      var length = this.listSeatsChooseGo.length;
      if (tdS[value.stt - 1].classList.toggle('select') == true) {
        if (length + 1 == 6) {
          tdS[value.stt - 1].classList.toggle('select');
          return alert('Chi duoc chon 5 ve');
        }
        this.listSeatsChooseGo.push(value);
        this.totalPriceGo += this.price;
      } else {
        for (let i = 0; i < length; i++) {
          if (this.listSeatsChooseGo[i].stt === value.stt) {
            this.listSeatsChooseGo.splice(i, 1);
            this.totalPriceGo -= this.price;
          }
        }
      }
    } else {
      var tdS = document.getElementsByClassName('seatReturn');
      var length = this.listSeatsChooseReturn.length;
      if (tdS[value.stt - 1].classList.toggle('select') == true) {
        if (length + 1 == 6) {
          tdS[value.stt - 1].classList.toggle('select');
          return alert('Chi duoc chon 5 ve');
        }
        this.listSeatsChooseReturn.push(value);
        this.totalPriceReturn += this.price;
      } else {
        for (let i = 0; i < length; i++) {
          if (this.listSeatsChooseReturn[i].stt === value.stt) {
            this.listSeatsChooseReturn.splice(i, 1);
            this.totalPriceReturn -= this.price;
          }
        }
      
      }
    }
  }

  onSetDate() {
    let day = new Date();
    let dateNow =
      ('0' + day.getDate()).slice(-2) +
      '/' +
      ('0' + (day.getMonth() + 1)).slice(-2) +
      '/' +
      day.getFullYear();
    return dateNow;
  }

  onGetRouterIdById(
    departureId: Int16Array,
    destinationId: Int16Array,
    date: string,
    type: number
  ) {
    this.routerService
      .getRouterById(departureId, destinationId, date)
      .subscribe((data) => {
        let routerId;
        let isBan = false;
        if (type == 0) { 
          this.busRouterGo = data.data;
          if (data.data.start_date != null) {
            this.isBanGo = true;
            this.isHaveRoute = false;
            isBan = true;
            this.messageGo +=
            ' đã bị chặn từ ngày ' +
            this.busRouterGo.start_date +
            ' đến ngày ' +
            this.busRouterGo.finish_date;
            this.toastr.info(this.messageGo);

          }
          routerId = this.busRouterGo.id;
        } else {
          this.busRouterReturn = data.data;
          if (data.data.start_date != null) {
            this.isBanReturn = true;
            this.isHaveRoute = false;
            isBan = true;
            this.messageReturn +=
            ' đã bị chặn từ ngày ' +
            this.busRouterReturn.start_date +
            ' đến ngày ' +
            this.busRouterReturn.finish_date;
            this.toastr.info(this.messageReturn);
          }
          routerId = this.busRouterReturn.id;
        }
        this.onGetRunTime(routerId, date, type, isBan);
      });
  }

  onGetRunTime(
    routerId: Int16Array,
    date: string,
    type: number,
    isBan: boolean
  ) {
    this.routerService.getRunTime(routerId, date).subscribe((data) => {
      if (type == 0) {
        this.listTimeGo = data.data;
        const selectDate = date?.split("/");
        const now = new Date();
        const hours = now.getHours();
        let isToday = false;
    
        if(Number(selectDate[2])==Number(now.getFullYear())){
          if(Number(selectDate[1])==Number(('0' + (now.getMonth() + 1)).slice(-2))){
            if(Number(selectDate[0])==Number(('0' + now.getDate()).slice(-2))){
              isToday = true;
            }
          }
        }

        let listTimeTemp = [];
        if(isToday){
          for(let i of this.listTimeGo){
            if(Number(hours)-1 < parseInt(i.giochay)){
              listTimeTemp.push(i);
            }
          }
        }else{
          listTimeTemp = this.listTimeGo;
        }

        for (let i of listTimeTemp) {
          if (parseInt(i.giochay) <= 10) {
            this.listAMGo.push(i);
          }
          if (parseInt(i.giochay) > 10 && parseInt(i.giochay) < 17) {
            this.listNoonGo.push(i);
          }
          if (parseInt(i.giochay) >= 17) {
            this.listPMGo.push(i);
          }
        }
        this.timeGo = data.data[0].giochay;
        if(this.listAMGo.length==0&&this.listNoonGo.length==0&&this.listPMGo.length==0){
          this.isExpiredGo = true;
        }else{
          this.isExpiredGo = false;
        }
      } else {
        this.listTimeReturn = data.data;
        for (let i of data.data) {
          if (parseInt(i.giochay) <= 10) {
            this.listAMReturn.push(i);
          }
          if (parseInt(i.giochay) > 10 && parseInt(i.giochay) < 17) {
            this.listNoonReturn.push(i);
          }
          if (parseInt(i.giochay) >= 17) {
            this.listPMReturn.push(i);
          }
        }
        this.timeReturn = data.data[0].giochay;
      }
      
      if (isBan) {
        this.floor = 2;
        return;
      }      

      if(this.isExpiredGo || this.isBanReturn){
        this.isLoadGo = false;
        this.isLoadReturn = false;
      }else{
        this.onGetSeatsStatus(routerId, data.data[0].giochay, date, type);
      }
    });
  }

  onGetSeatsStatus(
    routerId: Int16Array,
    time: string,
    date: string,
    type: number
  ) {
    if(type==0){
      this.isLoadGo = true;
    }
    else{
      this.isLoadReturn = true;
    }
    this.seatsService.getStatusSeat(routerId, time, date).subscribe((data) => {
      let listSeat = SetSeatDependencyFloor(data.data);
      if (type == 0) {
        this.seatsGo = data.data;
        this.listSeatsFloor1Go = listSeat[0];
        if (listSeat.length > 1) {
          this.listSeatsFloor2Go = listSeat[1];
        }
        this.isLoadGo = false;
      } else {
        this.seatsReturn = data.data;
        this.listSeatsFloor1Return = listSeat[0];
        if (listSeat.length > 1) {
          this.listSeatsFloor2Return = listSeat[1];
        }
        this.isLoadReturn = false;
      }
    });
  }

  onChangeDateGo(date:any){
    this.dateGo = date.value;
    const dateGoR = date.value.split("-");
    this.dateReturn = dateGoR[0]+"-"+dateGoR[1]+"-"+(Number(dateGoR[2])+1);
    this.step1.returnday = (Number(dateGoR[2])+1)+"/"+dateGoR[1]+"/"+dateGoR[0];
    this.step1.daygo = (Number(dateGoR[2]))+"/"+dateGoR[1]+"/"+dateGoR[0]
    let finishDate = this.busRouterGo.finish_date?.split('/');
    let startDate = this.busRouterGo.start_date?.split('/');
    const now = new Date();
    const hours = now.getHours();
    let isCheck = false;
    let isCheckRuntime = false;
    if(Number(dateGoR[0])==Number(now.getFullYear())){
      if(Number(dateGoR[1])==Number(('0' + (now.getMonth() + 1)).slice(-2))){
        if(Number(dateGoR[2])==Number(('0' + now.getDate()).slice(-2))){
          isCheckRuntime = true;
          if(Number(hours)-1 >= parseInt(this.listTimeGo[this.listTimeGo.length-1].giochay)){
            isCheck = true;
          }else{
            isCheck = false;
          }
        }
      }
    }
    
    if(!isCheckRuntime){
      console.log(isCheckRuntime)
      this.onGetRunTime(
        this.busRouterGo.id,
        this.step1.daygo,
        0, false
      );
    }
    this.isExpiredGo = isCheck;
    if(!finishDate || !startDate){
      this.isBanGo = false;
      let dateP = date.value.split('-');
      this.step1.daygo = dateP[2] + '/' + dateP[1] + '/' + dateP[0];
      this.onGetSeatsStatus(
        this.busRouterGo.id,
        this.timeGo,
        this.step1.daygo,
        0
      );
      this.onGetSeatsStatus(
        this.busRouterReturn.id,
        this.timeReturn,
        this.step1.returnday,
        1
      );
    }else{
      if (
        !onCompareDate(
          date.value,
          finishDate[2] + '-' + finishDate[1] + '-' + finishDate[0]
        )
      ) {
        if (
          !onCompareDate(
            startDate[2] + '-' + startDate[1] + '-' + startDate[0],
            date.value
          )
        ){
          this.isBanGo = true;
          this.seatsGo = {} as Seat;
          this.listSeatsFloor1Go = [];
          this.listSeatsFloor2Go = [];
          this.toastr.info(this.messageGo);
        }
      }
    }
  }

  onChangeDateReturn(date:any){
    this.dateReturn = date.value;
    let finishDate = this.busRouterReturn.finish_date.split('/');
    let startDate = this.busRouterReturn.start_date.split('/');

    if(onCompareDate(this.dateReturn, this.dateReturn)||this.dateReturn.toString()==this.dateReturn.toString()){
      let tomorow = new Date(new Date(this.dateReturn).getTime()+ 24 * 60 * 60 * 1000)
      this.dateReturn = tomorow.getFullYear() +
      '-' +
      ('0' + (tomorow.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + tomorow.getDate()).slice(-2);
    }

    if (
      !onCompareDate(
        date.value,
        finishDate[2] + '-' + finishDate[1] + '-' + finishDate[0]
      )
    ) {
      if (
        !onCompareDate(
          startDate[2] + '-' + startDate[1] + '-' + startDate[0],
          date.value
        )
      ){
        this.isBanReturn = true;
        this.seatsReturn = {} as Seat;
        this.listSeatsFloor1Return = [];
        this.listSeatsFloor2Return = [];
        this.toastr.info(this.messageReturn);
        return;
      }
    }

    this.isBanReturn = false;
    let dateP = date.value.split('-');
    this.step1.returnday = dateP[2] + '/' + dateP[1] + '/' + dateP[0];
    this.onGetSeatsStatus(
      this.busRouterReturn.id,
      this.timeReturn,
      this.step1.returnday,
      0
    );
  }

  onGoBack(){
    this._location.back();
  }

  getBan(){
    if(!this.isBanGo && !this.isBanReturn){
      return true;
    }
    return false;
  }
}
