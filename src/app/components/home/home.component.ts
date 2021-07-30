import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ElementRef, HostListener, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BusStationServiceService } from 'src/app/services/station/bus-station-service.service';
import { BusStation } from '../../model/bus-station';
import { BusRouterServiceService } from 'src/app/services/router/bus-router-service.service';
import { BusRouterPopular } from 'src/app/model/bus-router';
import { ToastrService } from 'ngx-toastr';
import { PaypalServiceService } from 'src/app/services/paypal/paypal-service.service';
import {
  debounceTime,
  map,
  distinctUntilChanged
} from "rxjs/operators";
import { fromEvent } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild('departureSearch', { static: true })
  departureSearch!: ElementRef;

  @ViewChild('destinationSearch', { static: true })
  destinationSearch!: ElementRef;

  isShowSearchGo = false;
  isShowSearchDestination = false;
  notifycation = false;
  busForm!: FormGroup;
  isLoad = true;
  isLoadBusStaion = true;
  today: any;
  returnDay: any;

  listSearchToGo: BusStation[] = [] as BusStation[];
  listSearchToDestination: BusStation[] = [] as BusStation[];

  busStations: BusStation[] = [];
  busStationsByID: BusStation[] = [];

  busRoutesPopular: BusRouterPopular[] = [];

  thisElementClicked: boolean = false;

  constructor(
    private router: Router,
    private busStationService: BusStationServiceService,
    private busRouterService: BusRouterServiceService,
    private toastr: ToastrService,
    private paypal: PaypalServiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.onDebounceSearch(this.departureSearch, 0);
    this.onDebounceSearch(this.destinationSearch, 1);
    this.load();
  }

  load() {
    this.showSlide();
    this.formInit();
    this.getDate();
    this.getAllBusStation();
    this.getRoutesPopular();
    this.onGetTokenPayPal();
  }

  onDebounceSearch(element: ElementRef, type: number){
    fromEvent(element.nativeElement,"keyup").pipe(
      map((event:any) => {
        return event.target.value;
      })
      ,debounceTime(500)
      ,distinctUntilChanged()
    ).subscribe((text:string)=>{
      this.onSelectDateOrigin(text,type);
    })
  }

  formInit(){
    this.busForm = this.fb.group({
      departureId: new FormControl(null, Validators.required),
      departure: new FormControl(null, Validators.required),
      destinationId: new FormControl(null, Validators.required),
      destination: new FormControl(null, Validators.required),
      dateGo: new FormControl(null, Validators.required),
      dateReturn: new FormControl(null, Validators.required),
      isOneWay: new FormControl(true, Validators.required)
    })
  }

  onGetTokenPayPal() {
    this.paypal.getTokenPayPal().subscribe((data) => {
      sessionStorage.setItem('tokenPayPal', JSON.stringify(data.accessToken));
      console.log(data);
    });
  }

  showSlide() {
    $('.multiple-items').slick({
      infinites: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      arrows: false,
      dots: false,
      autoplay: true,
      autoplaySpeed: 2000,
      centerMode: true,
      centerPadding: '0',
      pauseOnHover: false,
      responsive: [
        {
          breakpoint: 1100,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 4,
          },
        },
        {
          breakpoint: 900,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 700,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 1,
          },
        },
      ],
    });
  }

  getDate() {
    var day = new Date();
    var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    this.today = day.getFullYear() +
    '-' +
    ('0' + (day.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + day.getDate()).slice(-2);

    this.returnDay =
      tomorrow.getFullYear() +
      '-' +
      ('0' + (tomorrow.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + tomorrow.getDate()).slice(-2);

    this.busForm.controls?.dateGo.setValue(this.today);

    this.busForm.controls?.dateReturn.setValue(this.returnDay);
  }

  dateChange(event: any, type: any) {
    var today = new Date(event.value);
    var tomorrow = new Date(
      new Date(event.value).getTime() + 24 * 60 * 60 * 1000
    );
    if (type == 0) {
      this.returnDay = tomorrow.getFullYear() +
      '-' +
      ('0' + (tomorrow.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + tomorrow.getDate()).slice(-2)
      this.busForm.controls?.dateGo.setValue(today.getFullYear() +
      '-' +
      ('0' + (today.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + today.getDate()).slice(-2));
      this.busForm.controls?.dateReturn.setValue(this.returnDay);
    } else {
      this.busForm.controls?.dateReturn.setValue(today.getFullYear() +
      '-' +
      ('0' + (today.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + today.getDate()).slice(-2));
    }
  }

  onShowSchedule(busRoute: BusRouterPopular) {
    sessionStorage.setItem('routeDetail', JSON.stringify(busRoute));
    this.router.navigate(['/schedule/detail/', busRoute.id]);
  }

  onCheckTyeCheck(type: any) {
    if(!type){
      this.busForm.controls?.isOneWay.setValue(true);
    }
    else{
      this.busForm.controls?.isOneWay.setValue(false);
    }
  }

  setSelectionRange(type: any) {
    var dataList = document.getElementsByClassName('data-list-container');
    if (type == 0) {
      dataList[0].classList.add('show');
      dataList[1].classList.remove('show');
      if (!this.onCheckValue(this.listSearchToGo, this.busForm.controls?.departure.value)) {
        this.busStations = [];
      }
      else{
        this.busStations = this.listSearchToGo;
      }
    } else {
      dataList[1].classList.add('show');
      dataList[0].classList.remove('show');

      if (!this.onCheckValue(this.listSearchToDestination, this.busForm.controls?.destination.value)) {
        this.listSearchToDestination = [];
      }
      else{
        this.busStationsByID = this.listSearchToDestination;
      }
    }
  }

  onSelectDateOrigin(event: string, type: any) {
    var list: BusStation[];
    if (type == 0) {
      this.busStations = [];
      list = this.listSearchToGo;
      if(!event){
        this.busStations = this.listSearchToGo;
        return;
      }
      list.filter((element) => {
        if (
          element.ben_toi
            .toString()
            .toLowerCase()
            .includes(event.toLowerCase())
        )
          this.busStations.push(element);
      });
      this.busForm.controls?.departureId.setValue(this.busStations[0]?.id);
    } else {
      list = this.listSearchToDestination;
      this.busStationsByID = [];
      if(!event){
        this.busStationsByID = this.listSearchToDestination;
        return;
      }
      list.filter((element) => {
        if (
          element.ben_toi
            .toString()
            .toLowerCase()
            .includes(event.toLowerCase())
        )
          this.busStationsByID.push(element);
      });
      this.busForm.controls?.destinationId.setValue(this.busStationsByID[0]?.id);
    }
  }

  onSearch() {
    let dateGo = this.getDateGo();
    dateGo = dateGo.split("-");
    let dateReturn = this.getDateReturn();
    dateReturn = dateReturn.split("-");
    let bookTicketStep1 = {
      departure: {
        id: this.busForm.controls?.departureId?.value,
        ben_toi: this.busForm.controls?.departure?.value,
      },
      destination: {
        id: this.busForm.controls?.destinationId?.value,
        ben_toi: this.busForm.controls?.destination?.value,
      },
      daygo: dateGo[2]+"/"+dateGo[1]+"/"+dateGo[0],
      returnday: dateReturn[2]+"/"+dateReturn[1]+"/"+dateReturn[0],
      isOneWay: this.busForm.controls?.isOneWay?.value,
    };

    if (!bookTicketStep1?.destination?.id) {
      this.toastr.warning('Chọn nơi đi và nơi đến !', 'Xin hãy');
      return;
    }
    sessionStorage.setItem('step1', JSON.stringify(bookTicketStep1));

    if (!bookTicketStep1.isOneWay)
      return this.router.navigate(['/select-seats-two-way']);
    return this.router.navigate(['/select-seats']);
  }

  onSelect(object: BusStation, type: number) {
    if (type == 0) {
      this.getAllBusStationsById(object.id);
      this.busForm.controls?.departure.setValue(object.ben_toi);
      this.busForm.controls?.departureId.setValue(object.id);
    } else {
      this.busForm.controls?.destination.setValue(object.ben_toi);
      this.busForm.controls?.destinationId.setValue(object.id);
    }
  }

  onCheckValue(listData: BusStation[], keyWork: any) {
    if(!keyWork) return true;
    for (let i of listData) {
      if (i.ben_toi == keyWork) return true;
    }
    return false;
  }

  getAllBusStation() {
    this.busStationService.getAllBusStation().subscribe((data) => {
      this.busStations = data.data;
      this.listSearchToGo = this.busStations;
      this.busForm.controls?.departure.setValue(this.busStations[0].ben_toi);
      this.busForm.controls?.departureId.setValue(this.busStations[0].id);
      this.getAllBusStationsById(this.busStations[0].id);
    });
  }

  getAllBusStationsById(id: number) {
    this.isLoadBusStaion = true;
    this.busStationService.getDestinationStationsById(id).subscribe((data) => {
      this.busStationsByID = data.data;
      this.listSearchToDestination = this.busStationsByID;
      this.busForm.controls?.destination.setValue(this.busStationsByID[0]?.ben_toi);
      this.busForm.controls?.destinationId.setValue(this.busStationsByID[0]?.id);
      this.isLoadBusStaion = false;
    });
  }

  getRoutesPopular() {
    this.isLoad = true;
    this.busRouterService.getRouterPopular().subscribe((data) => {
      this.isLoad = false;
      this.busRoutesPopular = data.data;
    });
  }

  @HostListener('document:click', ['$event'])
  clickDDwn(e: any) {
    var container = $('.select-place');

    if (!container.is(e.target)) {
      var dataList = document.getElementsByClassName('data-list-container');
      var length = dataList.length;
      setTimeout(function () {
        for (let i = 0; i < length; i++) {
          dataList[i]?.classList.remove('show');
        }
      }, 300);

      if (
        !this.onCheckValue(this.listSearchToGo, this.busForm?.controls?.departure?.value) &&
        this.listSearchToGo.length > 0
      ) {
        this.busForm.controls?.departure?.setValue(this.listSearchToGo[0].ben_toi);
        this.listSearchToGo = [];
      }

      if (
        !this.onCheckValue(this.listSearchToDestination, this.busForm?.controls?.destination?.value) &&
        this.listSearchToDestination.length > 0
      ) {
        this.busForm?.controls?.destination?.setValue(this.listSearchToDestination[0].ben_toi);
        this.listSearchToDestination = [];
      }
    }
  }

  getOneWay(){
    return this.busForm.controls?.isOneWay?.value;
  }

  getDateGo(){
    return this.busForm.controls?.dateGo?.value;
  }

  getDateReturn(){
    return this.busForm.controls?.dateReturn?.value;
  }
}
