import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BusType } from '@model/bus';
import { BusServiceService } from 'src/app/services/bus/bus-service.service';
import { BusRouterServiceService } from 'src/app/services/router/bus-router-service.service';
import { BusStation } from '@model/bus-station';
import { BusStationServiceService } from 'src/app/services/station/bus-station-service.service';

const busType = [
  {
    floor:2,
    roww:7,
    srow:3,
    slot_count:44
  },
  {
    floor:2,
    roww:5,
    srow:2,
    slot_count:20
  },
  {
    floor:1,
    roww:6,
    srow:3,
    slot_count:16
  },
]

@Component({
  selector: 'app-bus-type',
  templateUrl: './bus-type.component.html',
  styleUrls: ['./bus-type.component.css'],
})
export class BusTypeComponent implements OnInit {
  isAdd = true;
  isShow = false;
  isBan = false;
  isLoad = true;
  isLoadStation = false;
  isLoadStationDestination = false;
  isBanRoute = false;
  today!: string;
  date!: string;
  message!: string;
  times!: any[];
  busTypes!:any[];
  buses: BusType[] = [] as BusType[];
  busesSearch: BusType[] = [] as BusType[];
  search!: string;
  busForm!: FormGroup;

  departures: BusStation[] = [] as BusStation[];
  destinations: BusStation[] = [] as BusStation[];

  constructor(
    private busService: BusServiceService,
    private fb: FormBuilder,
    private busRouterService: BusRouterServiceService,
    private busStationService: BusStationServiceService,
    private toarstService: ToastrService
  ) {}

  ngOnInit(): void {
    this.busTypes = busType;
    let day = new Date();
    this.today =
      day.getFullYear() +
      '-' +
      ('0' + (day.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + day.getDate()).slice(-2);
    this.date = this.today;

    this.onGetAllBus();
    this.onFormInit();
    this.onGetBusesStation();
  }

  onFormInit() {
    this.busForm = this.fb.group({
      busId: new FormControl(null),
      busRouter: new FormControl(null),
      busBrand: new FormControl(null, Validators.required),
      busName: new FormControl(null, Validators.required),
      timeRun: new FormControl('00:00', Validators.required),
      floor: new FormControl(null),
      row: new FormControl(null),
      slotCount: new FormControl(null),
      scrow: new FormControl(null),
      routerOff: new FormControl(null),
      routerReady: new FormControl(null),
      departure: new FormControl(''),
      destination: new FormControl(''),
    });
  }

  onSave() {
    let busR = {
      ten_xe: this.busForm.controls?.busName.value,
      hang_xe: this.busForm.controls?.busBrand.value,
      tuyen_san_sang_id: this.busForm.controls?.routerReady?.value,
      tuyen_off_id: this.busForm.controls?.routerOff?.value,
      gio_chay: this.busForm.controls?.timeRun.value,
      floor: this.busForm.controls?.floor.value,
      row: this.busForm.controls?.row.value,
      srow: this.busForm.controls?.scrow.value,
      slot_count: this.busForm.controls?.slotCount.value,
    }
    if(this.isAdd){
      if(this.busForm.invalid){
        this.toarstService.warning("Xin hãy nhập đủ thông tin!");
        return;
      }
      this.busService.postCreateBus(busR).subscribe(
        data => {
          this.toarstService.success("Tạo thành công");
          this.onGetAllBus();
          this.isShow = false;
          this.isAdd = false;    
        },()=>{
          this.toarstService.warning("Tạo thất bại");
        }
      )
    }else{
      this.busService.postUpdateBus(this.busForm.controls?.busId.value, busR).subscribe(
        data => {
          this.toarstService.success("Cập nhật thành công");
          this.isShow = false;
          this.isAdd = false;
        },()=>{
          this.toarstService.warning("Cập nhật thất bại");
        }
      )
    }
  }

  onSearch(){
    const search = this.removeVietnameseTones(this.search.toLocaleLowerCase());
    let busSearchByCity: BusType[] = [] as BusType[];
    this.busesSearch.map(b=>{
      let departure = this.removeVietnameseTones(b.diem_di.toLocaleLowerCase());
      if(departure.includes(search)){
        busSearchByCity.push(b);
      }
    });
    this.buses = busSearchByCity?.length>0?busSearchByCity:this.busesSearch;
  }

  removeVietnameseTones(str: string) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g," ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    return str;
  }

  onResetValueForm() {
    this.busForm.patchValue({
      busId: null,
      busRouter: null,
      busBrand: null,
      busName: null,
      timeRun: null,
      floor: null,
      row: null,
      slotCount: null,
      scrow: null,
      routerOff: null,
      routerReady: null,
      departureId: null,
      destinationId: null,
    });
  }

  onSetValueForm(data: BusType, type=0) {
    let time = this.onSetTime(data?.gioChay);
    this.busForm.patchValue({
      departure: data?.diem_di_id,
      destination: data?.diem_toi_id,
      busBrand: data?.hangXe,
      busName: data?.tenXe,
      row: data?.row,
      floor: data?.floor,
      scrow: data?.srow,
      slotCount: data?.slotCount,
      busId: data?.id,
      routerReady: data?.tuyenSanSangId,
      routerOff: data?.tuyenOffId
    });
    if(type==0){
      this.busForm.controls?.timeRun?.setValue(time)
    }
  }

  onChangeTime($event: any) {
    this.busForm.controls?.timeRun?.setValue($event.value);
  }

  onGetRunTime(busId: Int16Array, date: string) {
    let dateR = date.split('-');
    this.busRouterService
      .getRunTime(busId, dateR[2] + '/' + dateR[1] + '/' + dateR[0])
      .subscribe((data) => {
        this.times = data.data;
        this.times.find((t, i) => {
          if (t.giochay == this.busForm.controls?.timeRun.value) {
            this.times[i] = this.times[0];
            this.times[0] = t;
          }
        });
        this.busForm.controls?.timeRun.setValue(this.onSetTime(this.times[0].giochay));
      });
  }

  onSetTime(time: any) {
    let hours = time?.substring(0, time.indexOf(':'));
    let minius = time?.split(':')?.pop();
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minius > 0 && minius < 10) {
      minius = '0' + minius;
    }
    return hours + ':' + minius;
  }

  onGetAllBus() {
    this.isLoad = true;
    this.busService.getAllBus().subscribe((data) => {
      this.buses = data.data;
      this.busesSearch = data.data;
      this.isLoad = false;
    });
  }

  onBan() {
    if(this.isBanRoute){
      this.toarstService.info(this.message);
    }else{
      let dateRun = this.date.split("-");
      let bus = {
        id_tuyen_xe: this.busForm.controls?.routerReady?.value,
        gio: this.busForm.controls?.timeRun?.value,
        ngay: dateRun[2]+"/"+dateRun[1]+"/"+dateRun[0]
      }
      this.busRouterService.postCancelDependency(bus).subscribe(
        data => {
          this.toarstService.success("Chặn thành công");
        },()=>{
          this.toarstService.warning("Chặn thất bại");
        }
      )
    }
  }

  onGetBusesStation() {
    this.isLoadStation = true;
    this.busStationService.getAllBusStation().subscribe((data) => {
      this.departures = data.data;
      this.busForm.controls.departure.setValue(this.departures[0].id);
      this.isLoadStation = false;
    });
  }

  onChangeDeparture(id: any) {
    this.busForm.controls?.departure.setValue(id.value);
    this.onGetDestinationStationById(id.value);  
    if(this.isBan){
      this.onCheckBanBus();
    }else{
      this.destinations = [];
      this.departures.map((d,i)=>{
        if(this.busForm.controls?.departure.value!=d.id){
          this.destinations.push(d);
        }
      })
    }
  }

  onChangeDestination(id: any) {
    this.busForm.controls?.destination.setValue(id.value);
    if(this.isBan){
      this.onCheckBanBus(); 
      this.onGetRouteById(
        this.busForm.controls?.departure.value,
        this.busForm.controls?.destination.value,
        this.date
      ); 
    }
    else{
      this.onGetRouteById(
        this.busForm.controls?.departure.value,
        this.busForm.controls?.destination.value,
        this.date
      ); 
      this.onGetRouteById(
        this.busForm.controls?.destination.value,
        this.busForm.controls?.departure.value,
        this.date,1
      ); 
    }

  }

  onGetDestinationStationById(id: number, destinationId = 0) {
    this.isLoadStationDestination = true;
     this.busStationService.getDestinationStationsById(id).subscribe((data) => {
      if(this.isBan){
        this.destinations = this.onSortBusStation(data.data, destinationId);
      }
      else{
        this.destinations = data.data;      
      }
      this.busForm.controls?.destination.setValue(this.destinations[0]?.id);  
      this.onGetRouteById(
        this.busForm.controls?.departure.value,
        this.busForm.controls?.destination.value,
        this.date
      );
      if(this.isAdd){
        this.onGetRouteById(
          this.busForm.controls?.destination.value,
          this.busForm.controls?.departure.value,
          this.date,1
        );
      }
      this.isLoadStationDestination = false;
    });
  }

  onGetRouteById(
    departureId: Int16Array,
    destinationId: Int16Array,
    date: string,
    type = 0
  ) {
    let dateR = date.split('-');
    this.busRouterService
      .getRouterById(
        departureId,
        destinationId,
        dateR[2] + '/' + dateR[1] + '/' + dateR[0]
      )
      .subscribe((data) => {
        this.busTypes = busType;
        if (data.data.start_date && this.isBan) {
          this.message = 'Hiện tại tuyến xe đã bị chặn từ ngày ' + data.data.start_date + ' đến ' + data.data.finish_date
          this.toarstService.info(this.message);
          this.isBanRoute = true;
        }
        else{
          this.isBanRoute = false;
        }

        if(this.isBan){
          this.onGetRunTime(data.data.id, this.date);
          const busT = this.buses.find((b) => b.tuyenSanSangId == data.data.id);
          this.onSetValueForm(busT!,1);
        }
        if(type==0)
          this.busForm.controls?.routerReady.setValue(data.data.id);
        else
          this.busForm.controls?.routerOff.setValue(data.data.id);
      },()=>{
        this.times=[];  
        this.onResetValueForm();
        this.destinations = [];
        this.isBanRoute = true;
        this.busTypes = [];
      });
  }

  onSortBusStation(data: BusStation[], destinationId = 0) {
    if (destinationId == 0) {
      return data;
    }

    data.forEach((d, i) => {
      if (d.id === destinationId) {
        data[i] = data[0];
        data[0] = d;
      }
    });
    return data;
  }

  onEditBus(bus: BusType) {
    this.isShow = true;
    this.isAdd = false;
    this.isBan = false;
    let day = new Date();
    this.today =
      '1999' +
      '-' +
      ('0' + (day.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + day.getDate()).slice(-2);
    this.date = this.today;
    this.onSetValueForm(bus);
    this.onGetDestinationStationById(bus.diem_di_id, bus.diem_toi_id);
    this.onSortDeparture(bus.diem_di_id);
  }

  onBanBus(bus: BusType) {
    this.isBan = true;
    this.isAdd = false;
    this.isShow = true;
    let day = new Date();
    this.today =
      day.getFullYear() +
      '-' +
      ('0' + (day.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + day.getDate()).slice(-2);
    this.date = this.today;
    this.onSetValueForm(bus);
    this.onSortDeparture(bus.diem_di_id);

    this.onCheckBanBus();
    this.onGetDestinationStationById(bus.diem_di_id, bus.diem_toi_id);
    this.onGetRunTime(bus.tuyenSanSangId, this.date);
  }

  onSortDeparture(departureId: number) {
    this.departures.forEach((d, i) => {
      if (d.id === departureId) {
        this.departures[i] = this.departures[0];
        this.departures[0] = d;
      }
    });
  }

  onChangeSeatType($event: any) {
    let busType = this.busTypes.find(b=>b.slot_count==$event.value);
    this.busForm.controls?.slotCount?.setValue(busType?.slot_count);
    this.busForm.controls?.floor?.setValue(busType?.floor);
    this.busForm.controls?.row?.setValue(busType?.roww);
    this.busForm.controls?.scrow?.setValue(busType?.srow);
  }

  onAdd() {
    this.isAdd = true;
    this.isShow = true;
    this.isBan = false;
    this.onResetValueForm();
    this.onGetDestinationStationById(this.departures[0].id);

    this.busForm.controls?.departure.setValue(this.departures[0].id);
    this.busForm.controls?.slotCount?.setValue(this.busTypes[0].slot_count);
    this.busForm.controls?.floor?.setValue(this.busTypes[0].floor);
    this.busForm.controls?.row?.setValue(this.busTypes[0].roww);
    this.busForm.controls?.scrow?.setValue(this.busTypes[0].srow);
  }

  onChangeDate($event: any) {
    this.date = $event.value;
    this.onCheckBanBus();
    this.onGetRouteById(
      this.busForm.controls?.departure.value,
      this.busForm.controls?.destination.value,
      this.date
    );
  }

  onCheckBanBus(){
    let time = this.date.split("-");
    let runTime = this.busForm.controls?.timeRun.value;
    let currentYear = new Date().getFullYear();
    if(Number.parseInt(time[0])<currentYear){
      time[0] = currentYear.toString();
    }
    this.busRouterService.getCheckBanBus(this.busForm.controls?.departure.value, this.busForm.controls.destination.value, time[2]+"/"+time[1]+"/"+time[0], runTime).subscribe(
      data => {
        if(!data.data){
          this.isBanRoute = true;
          this.toarstService.info("Ngày "+ time[2]+"/"+time[1]+"/"+time[0]+" lúc "+runTime+"h đã bị chặn!");
        }else{
          this.isBanRoute = false;
        }
      }
    )
  }
}
