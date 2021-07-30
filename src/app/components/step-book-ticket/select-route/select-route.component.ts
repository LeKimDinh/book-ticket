import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BusRouterInfor, BusSchedule } from '@model/bus-router';
import { BusStation } from '@model/bus-station';

import { ToastrService } from 'ngx-toastr';
import { PaypalServiceService } from 'src/app/services/paypal/paypal-service.service';
import { BusRouterServiceService } from 'src/app/services/router/bus-router-service.service';
import { BusStationServiceService } from 'src/app/services/station/bus-station-service.service';

declare var $: any;

@Component({
  selector: 'app-select-route',
  templateUrl: './select-route.component.html',
  styleUrls: ['./select-route.component.css'],
})
export class SelectRouteComponent implements OnInit {
  routeId: any;
  today: any;
  returnDay: any;

  placeGo: string = '';
  placeDes: string = '';

  isDisableReturnDate = true;
  isLoad = true;
  busForm!: FormGroup;
  routerInfor: BusRouterInfor = {} as BusRouterInfor;

  bookTicketStep1 = {
    departure: {
      id: '',
      ben_toi: '',
    },
    destination: {
      id: '',
      ben_toi: '',
    },
    daygo: '',
    returnday: '',
    isOneWay: true,
  };

  listSearchToGo: BusStation[] = [] as BusStation[];
  listSearchToDestination: BusStation[] = [] as BusStation[];

  busStations: BusStation[] = [] as BusStation[];
  busStationsByID: BusStation[] = [] as BusStation[];

  bustationById: BusSchedule = {} as BusSchedule;

  constructor(
    private router: Router,
    private busStationService: BusStationServiceService,
    private busRouterService: BusRouterServiceService,
    private toastr: ToastrService,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.routeId = this.activateRoute.snapshot.params['id'];

    this.getDate(JSON.parse(sessionStorage.getItem('date')!));
    this.getAllBusStation();
    this.getBusRouterInfor(this.routeId);
  }

  initForm(){
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

  getBusRouterInfor(busRouteId: Int16Array) {
    this.busRouterService.getRouterInforById(busRouteId).subscribe((data) => {
      this.routerInfor = data.data;
      this.busForm.controls?.departureId?.setValue(this.routerInfor?.diem_di_id);
      this.busForm.controls?.departure.setValue(this.routerInfor?.diem_di);
      this.busForm.controls?.destinationId.setValue(this.routerInfor?.diem_toi_id);
      this.busForm.controls?.destination.setValue(this.routerInfor?.diem_toi);
      
      this.getAllBusStationsById(this.routerInfor.diem_di_id, 1);
    });
  }

  getDate(time: string) {
    let day: any;
    if (time == null) {
      day = new Date();
    } else {
      day = new Date(time);
    }

    this.today = day.getFullYear() + '-' + ('0' + (day.getMonth() + 1)).slice(-2) + '-' + ('0' + day.getDate()).slice(-2);
    this.busForm?.controls?.dateGo.setValue(this.today);
  }

  getAllBusStation() {
    this.busStationService.getAllBusStation().subscribe((data) => {
      this.busStations = data.data;
    });
  }

  onCheckTyeCheck(type: boolean) {
    this.busForm.controls?.isOneWay?.setValue(type);
    this.isDisableReturnDate = type;

    if(type){
      this.returnDay = "";
    }
    else{
      let today = this.today.split("-");
      this.returnDay = today[0]+"-"+today[1]+"-"+(Number(today[2])+1);
      this.busForm.controls?.dateReturn?.setValue(this.returnDay);
    }
  }

  setSelectionRange(type: any) {
    var dataList = document.getElementsByClassName('data-list-container');
    if (type == 0) {
      dataList[0].classList.add('show');
      dataList[1].classList.remove('show');

      if (!this.onCheckValue(this.listSearchToDestination, this.placeDes)) {
        if (this.listSearchToDestination[0] != undefined)
          this.placeDes = this.listSearchToDestination[0].ben_toi;

        this.listSearchToGo = [];
      }
    } else {
      dataList[1].classList.add('show');
      dataList[0].classList.remove('show');

      if (!this.onCheckValue(this.listSearchToGo, this.placeGo)) {
        if (this.listSearchToGo[0] != undefined)
          this.placeGo = this.listSearchToGo[0].ben_toi;
        this.listSearchToDestination = [];
      }
    }
  }

  onCheckValue(listData: any, keyWork: any) {
    for (let i of listData) {
      if (i.name == keyWork) return true;
    }
    return false;
  }

  onSelectDateOrigin(event: any, type: any) {
    var list: BusStation[];

    if (type == 0) {
      list = this.busStations;
      this.placeGo = event.value;

      this.listSearchToGo = [];

      list.filter((element) => {
        if (
          element.ben_toi
            .toString()
            .toLowerCase()
            .includes(event.value.toLowerCase())
        )
          this.listSearchToGo.push(element);
      });
    } else {
      list = this.busStationsByID;
      this.placeDes = event.value;

      this.listSearchToDestination = [];

      list.filter((element) => {
        if (
          element.ben_toi
            .toString()
            .toLowerCase()
            .includes(event.value.toLowerCase())
        )
          this.listSearchToDestination.push(element);
      });
    }
  }

  onSelect(object: BusStation, type: any) {
    if (type == 0) {
      this.busForm?.controls?.departure?.setValue(object.ben_toi);
      this.busForm?.controls?.departureId?.setValue(object.id);
      this.getAllBusStationsById(object.id);
    } else {
      this.busForm?.controls?.destination?.setValue(object.ben_toi);
      this.busForm?.controls?.destinationId?.setValue(object.id);
      this.listSearchToDestination = [];
    }
  }

  getAllBusStationsById(id: any, type = 0) {
    this.isLoad = true;
    this.busStationService.getDestinationStationsById(id)
    .subscribe((data) => {
      this.isLoad = false;
      this.busStationsByID = data.data;
      if(type == 0){
        this.busForm?.controls?.destination?.setValue(this.busStationsByID[0]?.ben_toi??"");
        this.busForm?.controls?.destinationId?.setValue(this.busStationsByID[0]?.id);  
      }

      this.onGetRouteById(this.busStationsByID);
    });
  }

  onGetRouteById(data: any[]) {
    this.bustationById = data.find((x) => x.id == this.routeId);
  }

  dateChange(event: any, type: any) {
    var tomorrow = new Date(new Date(event.value).getTime() + 24 * 60 * 60 * 1000);
    if (type == 0) {
      this.today = event.value;
      this.busForm.controls?.dateGo?.setValue(event.value);
      if(!this.busForm.controls?.isOneWay.value){
        this.returnDay = tomorrow.getFullYear() +
        '-' +
        ('0' + (tomorrow.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + tomorrow.getDate()).slice(-2);
        this.busForm.controls?.dateRetrun.setValue(this.returnDay);
      }
    } else {
      this.busForm.controls?.dateReturn?.setValue(event.value);
    }
  }

  onSearch() {
    const dateGo = this.busForm?.controls?.dateGo?.value?.split("-")??[];
    const returnDate = this.busForm?.controls?.dateReturn?.value?.split("-")??[];
    this.bookTicketStep1 = {
      departure: {
        id: this.busForm?.controls?.departureId?.value,
        ben_toi: this.busForm?.controls?.departure?.value,
      },
      destination: {
        id: this.busForm?.controls?.destinationId?.value,
        ben_toi: this.busForm?.controls?.destination?.value,
      },
      daygo: dateGo.length<1?"":dateGo[2]+"/"+dateGo[1]+"/"+dateGo[0],
      returnday: returnDate.length<1?"":returnDate[2]+"/"+returnDate[1]+"/"+returnDate[0],
      isOneWay: this.busForm?.controls?.isOneWay?.value,
    }
    if (this.bookTicketStep1.destination.ben_toi == '') {
      this.toastr.warning('Chọn nơi đi và nơi đến !', 'Xin hãy');
      return;
    }

    sessionStorage.setItem('step1', JSON.stringify(this.bookTicketStep1));

    if (!this.bookTicketStep1.isOneWay)
      return this.router.navigate(['/select-seats-two-way']);
    return this.router.navigate(['/select-seats']);
  }

  onContinue() {
    this.onSearch();
  }

  @HostListener('document:click', ['$event'])
  clickDown(e: any) {
    var container = $('.select-place');

    if (!container.is(e.target)) {
      var dataList = document.getElementsByClassName('data-list-container');
      var length = dataList.length;
      setTimeout(function () {
        for (let i = 0; i < length; i++) {
          dataList[i].classList.remove('show');
        }
      }, 300);

      if (
        !this.onCheckValue(this.listSearchToGo, this.placeGo) &&
        this.listSearchToGo.length > 0
      ) {
        this.placeGo = this.listSearchToGo[0].ben_toi;
        this.listSearchToGo = [];
      }

      if (
        !this.onCheckValue(this.listSearchToDestination, this.placeDes) &&
        this.listSearchToDestination.length > 0
      ) {
        this.placeDes = this.listSearchToDestination[0].ben_toi;
        this.listSearchToDestination = [];
      }
    }
  }
}
