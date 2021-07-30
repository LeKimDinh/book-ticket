import { BusRouter } from 'src/app/model/bus-router';
import { seat } from './../../../model/seats';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SeatServiceService } from 'src/app/services/seat/seat-service.service';
import { Seat } from 'src/app/model/seats';
import { BusRouterServiceService } from 'src/app/services/router/bus-router-service.service';
import { SetSeatDependencyFloor } from './../type-bus/bus-44';
import { ToastrService } from 'ngx-toastr';
import { Step2 } from './../../../model/book-ticket-steps';
import { onCompareDate } from './../../../shared/compare-date/compare-date';
import { Location } from '@angular/common';

@Component({
  selector: 'app-select-seats',
  templateUrl: './select-seats.component.html',
  styleUrls: ['./select-seats.component.css'],
})
export class SelectSeatsComponent implements OnInit {
  isHaveRouter: boolean = true;
  isBan: boolean = false;
  step1: any;

  message: string = '';
  date!: string;
  minDate?: string;
  time!: string;
  floors = 2;
  isLoad = true;
  isExpired = false;
  totalPrice = 0;

  listTime: any[] = [];
  listAM: any[] = [];
  listNoon: any[] = [];
  listPM: any[] = [];

  timeIndex = 1;

  seats: Seat = {} as Seat;

  listSeatsChoose: seat[] = [] as seat[];
  listSeatsFloor1: any[] = [];
  listSeatsFloor2: any[] = [];

  busRouter: BusRouter = {} as BusRouter;
  step2: Step2 = {} as Step2;
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

  onBack(){
    this._location.back();
  }

  onContinue() {
    if (this.listSeatsChoose.length == 0) {
      this.toastr.warning('Xin hay chon ghe');
      return;
    }

    this.step2 = {
      routerId: this.busRouter.id,
      time: this.time,
      boardingPoint: {
        id: 0,
        name: '',
      },
      seats: this.listSeatsChoose,
      number: this.listSeatsChoose.length,
      totalMoney: this.totalPrice,
    };

    sessionStorage.setItem('step1', JSON.stringify(this.step1));
    sessionStorage.setItem('step2', JSON.stringify(this.step2));
    this.router.navigate(['/infor-customer']);
  }

  onChangeTime(time: any) {
    this.time = time.value;
    if (this.isBan) {
      this.toastr.info(this.message);
      return;
    }
    this.onGetSeatsStatus(this.busRouter.id, time.value, this.step1.daygo);
    this.listSeatsChoose = [];
    this.totalPrice = 0;
  }

  onChangeDate(date: any) {
    const selectDate = date.value?.split("-");
    this.step1.daygo = selectDate[2]+"/"+selectDate[1]+"/"+selectDate[0];
    const now = new Date();
    const hours = now.getHours();
    let isCheck = false;
    let isCheckRuntime = false;
    let x =Number(('0' + now.getDate()).slice(-2));
    if(Number(selectDate[0])==Number(now.getFullYear())){
      if(Number(selectDate[1])==Number(('0' + (now.getMonth() + 1)).slice(-2))){
        if(Number(selectDate[2])==Number(('0' + now.getDate()).slice(-2))){
          isCheckRuntime = true;
          if(Number(hours)-1 >= parseInt(this.listTime[this.listTime.length-1].giochay)){
            isCheck = true;
          }else{
            isCheck = false;
          }
        }
      }
    }

    if(!isCheckRuntime){
      this.onGetRunTime(
        this.busRouter.id,
        this.step1.daygo,
        this.busRouter.start_date
      );
    }

    this.isExpired = isCheck;
    let finishDate = this.busRouter.finish_date?.split('/');
    let startDate = this.busRouter.start_date?.split('/');
    if(!finishDate || !startDate){
      this.isBan = false;
      let dateP = date.value.split('-');
      this.step1.daygo = dateP[2] + '/' + dateP[1] + '/' + dateP[0];
      this.onGetSeatsStatus(
        this.busRouter.id,
        this.time,
        this.step1.daygo
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
        )
          this.isBan = true;
          this.seats = {} as Seat;
          this.listSeatsFloor1 = [];
          this.listSeatsFloor2 = [];
          this.toastr.info(this.message);
      }
    }
  }

  load() {
    let dayNow = new Date();
    this.minDate =
      dayNow.getFullYear() +
      '-' +
      ('0' + (dayNow.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + dayNow.getDate()).slice(-2);
    this.step1 = JSON.parse(sessionStorage.getItem('step1')!);
    let day = this.step1.daygo.split('/');
    this.date = day[2] + '-' + day[1] + '-' + day[0];
    this.message =
      'Tuyến ' +
      this.step1.departure.ben_toi +
      ' ⇒ ' +
      this.step1.destination.ben_toi;
    this.onGetRouterIdById(
      this.step1.departure.id,
      this.step1.destination.id,
      this.step1.daygo
    );
  }

  onBook(value: any) {
    var tdS = document.getElementsByClassName('seat');

    var length = this.listSeatsChoose.length;

    if (tdS[value.stt - 1].classList.toggle('select') == true) {
      if (length + 1 == 6) {
        tdS[value.stt - 1].classList.toggle('select');
        return alert('Chi duoc chon 5 ve');
      }
      this.listSeatsChoose.push(value);
      this.totalPrice += this.busRouter.gia_ca;
    } else {
      for (let i = 0; i < length; i++) {
        if (this.listSeatsChoose[i]?.stt === value?.stt) {
          this.listSeatsChoose.splice(i, 1);
          this.totalPrice -= this.busRouter.gia_ca;
        }
      }
    }
  }

  onGetSeatsStatus(routerId: Int16Array, time: string, date: string) {
    this.isLoad = true;
    this.seatsService.getStatusSeat(routerId, time, date).subscribe((data) => {
      this.seats = data.data;
      let listSeat = SetSeatDependencyFloor(this.seats);
      this.listSeatsFloor1 = listSeat[0];
      if (listSeat.length > 1) {
        this.listSeatsFloor2 = listSeat[1];
      } 
      this.isLoad = false;
    });
  }

  onGetRouterIdById(
    departureId: Int16Array,
    destinationId: Int16Array,
    date: string
  ) {
    this.routerService
      .getRouterById(departureId, destinationId, date)
      .subscribe(
        (data) => {
          this.busRouter = data.data;
          if (this.busRouter.start_date != null) {
            this.message +=
              ' đã bị chặn từ ngày ' +
              this.busRouter.start_date +
              ' đến ngày ' +
              this.busRouter.finish_date;
            this.toastr.info(this.message);
            this.isBan = true;
          }
          this.onGetRunTime(
            this.busRouter.id,
            this.step1.daygo,
            this.busRouter.start_date
          );
        },
        () => {
          this.isHaveRouter = false;
          this.toastr.info(
            'Hiện tại tuyến này đang bị chặn trong ngày đến ngày'
          );
          this.isBan = true;
        }
      );
  }

  onGetRunTime(routeId: Int16Array, date: string, banDate: string) {
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

    this.routerService.getRunTime(routeId, date).subscribe((data) => {
      this.listTime = data.data;
      let listTimeTemp = [];
      if(isToday){
        for(let i of this.listTime){
          if(Number(hours)-1 < parseInt(i.giochay)){
            listTimeTemp.push(i);
          }
        }
      }else{
        listTimeTemp = this.listTime;
      }

      for (let i of listTimeTemp) {
        if (parseInt(i.giochay) <= 10) {
          this.listAM.push(i);
        }
        if (parseInt(i.giochay) > 10 && parseInt(i.giochay) < 17) {
          this.listNoon.push(i);
        }
        if (parseInt(i.giochay) >= 17) {
          this.listPM.push(i);
        }
      }

      this.time = data.data[0].giochay;
      if (banDate != null) {
        this.isHaveRouter = false;
        this.seats.floor = 2;
        return;
      }

      if(this.listAM.length==0&&this.listNoon.length==0&&this.listPM.length==0){
        this.isExpired = true;
        this.isLoad = false;
      }else{
        this.isExpired = false;
        this.isLoad = false;
        this.onGetSeatsStatus(routeId, data.data[0].giochay, date);  
      }
    });
  }

}
