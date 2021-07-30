import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BusSchedule, BusRouterRequest } from './../../../../model/bus-router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BusRouterServiceService } from 'src/app/services/router/bus-router-service.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { TicketServiceService } from 'src/app/services/ticket/ticket-service.service';
import { RevenueRouterInfor } from '@model/router';
import { BusStationServiceService } from 'src/app/services/station/bus-station-service.service';
import { BusStation, Station } from '@model/bus-station';
import { PaypalServiceService } from 'src/app/services/paypal/paypal-service.service';
import * as moment from 'moment';

declare var $: any;

type NewType = ElementRef;

@Component({
  selector: 'app-bus-route',
  templateUrl: './bus-route.component.html',
  styleUrls: ['./bus-route.component.css'],
})
export class BusRouteComponent implements OnInit {
  @ViewChild('someElement')
  someElementRef!: NewType;

  isAdd = false;
  isShow = false;
  isNotify = false;
  isLoading = false;
  isBanForTime = false;
  isLoad = true;
  isLoadStation = false;
  isLoadDestination = false;

  date: any;
  fromDate: any;
  toDate: any;
  year: number = 0;
  amount: number = 0;
  ticket: number = 0;
  compare: string = '';
  percent: string = '';

  inputSearch = '';

  departure: string = '';
  destination: string = '';

  busRouterId!: Int16Array;
  busesRouter: BusSchedule[] = [] as BusSchedule[];
  busesRouterSearch: BusSchedule[] = [] as BusSchedule[];

  revenueBusesRouter: RevenueRouterInfor[] = [] as RevenueRouterInfor[];
  revenueBusRouter: RevenueRouterInfor = {} as RevenueRouterInfor;

  busesDepartureStation: Station[] = [] as Station[];
  busesDestinationStation: Station[] = [] as Station[];

  busRouterForm!: FormGroup;

  lineChartData: ChartDataSets[] = [
    {
      data: [],
      label: '',
    },
  ];
  lineChartLabels: Label[] = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];
  lineChartOptions: ChartOptions & { annotation?: any } = {
    responsive: true,
  };
  lineChartColors: Color[] = [
    {
      borderColor: '#ef5222;',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];

  lineChartLegend = true;
  lineChartType: any = 'line';
  lineChartPlugins = [];

  constructor(
    private busRouterService: BusRouterServiceService,
    private fb: FormBuilder,
    private ticketService: TicketServiceService,
    private toastr: ToastrService,
    private busStationService: BusStationServiceService,
    private paypalService: PaypalServiceService
  ) {}

  ngOnInit(): void {
    let day = new Date();
    this.date = day.getFullYear()+ '-' + ('0' + (day.getMonth() + 1)).slice(-2)  + '-' + ('0' + day.getDate()).slice(-2);
    this.fromDate = this.date;
    this.toDate = day.getFullYear()+ '-' + ('0' + (day.getMonth() + 1)).slice(-2)  + '-' + ('0' + (day.getDate()+1)).slice(-2);
    
    this.onLoad();
  }

  onChangeFromDate(fromDate:any){
    let day = new Date(fromDate.value)
    this.fromDate = fromDate.value;
    this.toDate =day.getFullYear() +"-"+
    ('0' + (day.getMonth() + 1)).slice(-2)+"-"+
    ('0' + (day.getDate()+1)).slice(-2);
  }

  onChangeToDate(toDate: any){
    this.toDate = toDate.value;
  }

  onPreviousYear() {
    if (this.year == 2020) {
      this.toastr.info('Công ty thành lập năm 2020');
      return;
    }
    this.year = this.year - 1;
    this.onGetRevenue(this.year, this.busRouterId);
  }

  onNextYear() {
    if (this.year == new Date().getFullYear()) {
      return;
    }
    this.year = this.year + 1;
    this.onGetRevenue(this.year, this.busRouterId);
  }

  onSearch(search: string) {
    this.busesRouter = this.busesRouterSearch;
    search = this.removeVietnameseTones(search.toLocaleLowerCase());

    let busSearchByDeparture: BusSchedule[] = [] as BusSchedule[];
    let busSearchByDestination: BusSchedule[] = [] as BusSchedule[];

    for (let i of this.busesRouter) {
      let departure = this.removeVietnameseTones(i.ben_xe_di.toLocaleLowerCase());

      if (departure.includes(search)) {
        busSearchByDeparture.push(i);
      }

      let result = busSearchByDeparture.concat(busSearchByDestination);
      this.busesRouter = this.onUniqueArray(result);
    }
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

  onUniqueArray(array: BusSchedule[]) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j]) a.splice(j--, 1);
      }
    }

    return a;
  }

  onGetRevenue(year: number, routerId: Int16Array) {
    this.isLoad = true;

    this.ticketService
      .getRevenueStatisticsByYear(year, routerId)
      .subscribe((data) => {
        this.ticket = 0;
        this.amount = 0;
        this.lineChartData[0].data = [];
        for (let i of data.data.list_data) {
          this.lineChartData[0].data.push(i.total_amount);
          this.ticket += i.total_ve;
          this.amount += i.total_amount;
        }

        this.percent = data.data.amount_percent;
        if (data.data.increase) this.compare = 'Tăng';
        else this.compare = 'Giảm';

        this.isLoad = false;
      });
  }

  onGetRevenueInfor(year: number) {
    this.ticketService.getTicketRevenueInfor(year).subscribe((data) => {
      this.revenueBusesRouter = data.data;
    });
  }

  onLoad() {
    this.year = new Date().getFullYear();
    this.onGetBusesRouter();
    this.onFormInit();
    this.onGetRevenueInfor(this.year);
  }

  onFormInit() {
    this.busRouterForm = this.fb.group({
      busRouterId: new FormControl(null),
      departureId: new FormControl(null),
      destinationId: new FormControl(null),
      price: new FormControl(0),
      range: new FormControl(0),
      hour: new FormControl(0),
      minute: new FormControl(0),
    });
  }

  onResetValueForm() {
    this.busRouterForm.patchValue({
      busRouterId: null,
      departure: '',
      destination: '',
      price: 0,
      range: 0,
      hour: 0,
      minute: 0,
    });
  }

  onSetValueForm(data: any) {
    let time = data.khoang_thoi_gian.split(':');
    this.busRouterForm.patchValue({
      busRouterId: data.id,
      departureId: data.ben_xe_di_id,
      destinationId: data.ben_xe_toi_id,
      price: data.gia_ca,
      range: data.khoang_cach,
      hour: time[0],
      minute: time[1],
    });
  }

  onChangeBusRouter($event: any) {
    this.busRouterId = $event.value;

    let label = this.busesRouterSearch.find((b) => b.id == $event.value)!;
    this.lineChartData[0].label =
      'Doanh thu tuyến ' + label.ben_xe_di + ' ⇒ ' + label.ben_xe_toi;

    this.onGetRevenue(this.year, $event.value);
  }

  onGetBusesRouter() {
    this.busRouterService.getAllRoute().subscribe((data) => {
      this.busesRouter = data.data;

      this.busesRouterSearch = data.data;
      this.lineChartData[0].label =
        'Doanh thu tuyến ' +
        this.busesRouter[0].ben_xe_di +
        ' ⇒ ' +
        this.busesRouter[0].ben_xe_toi;

      this.busRouterId = this.busesRouter[0].id;
      this.onGetRevenue(this.year, this.busesRouter[0].id);
    });
  }

  onGetDestinationById(id: any) {
    this.isLoadDestination = true;
    this.busStationService.getDestinationStationsById(id).subscribe((data) => {
      this.busesDestinationStation = data.data;
      this.onSetDestination();
      this.isLoadDestination = false;
    });
  }

  onGetDestinationNotRelationShipById(id: any) {
    this.isLoadDestination = true;
    this.busStationService
      .getDestinationStationNotRelaionshipById(id)
      .subscribe((data) => {
        this.busesDestinationStation = data.data;

        this.busRouterForm.controls.destinationId.setValue(
          this.busesDestinationStation[0].id
        );
        this.isLoadDestination = false;
      },()=>{
        this.busesDestinationStation = [];
      });
  }

  onGetBusesStation() {
    this.isLoadStation = true;
    this.busStationService.getAllBusStation().subscribe((data) => {
      this.busesDepartureStation = data.data;
      if(this.isAdd){
        this.busRouterForm.controls.departureId.setValue(this.busesDepartureStation[0].id);
        this.onGetDestinationNotRelationShipById(this.busesDepartureStation[0].id);
      }
      else{
        this.onSetDeparture();
        this.onGetDestinationById(this.busRouterForm.controls?.departureId.value);
      }
      this.isLoadStation = false;
    });
  }

  onAddBusRoute() {
    this.isShow = true;
    this.isAdd = true;
    this.isNotify = false;
    this.onResetValueForm();
    this.someElementRef.nativeElement.scrollIntoView({
      behavior: 'smooth',
    });
    this.onGetBusesStation();
  }

  onEditBusRoute(busRouter: BusSchedule) {
    this.isShow = true;
    this.isAdd = false;
    this.isNotify = false;
    this.onSetValueForm(busRouter);
    this.onGetBusesStation();
  }

  onSetDeparture() {
    this.busesDepartureStation.find((d,i)=>{
      if(Number(d.id)==Number(this.busRouterForm?.controls?.departureId?.value)){
        let temp = this.busesDepartureStation[i];
        this.busesDepartureStation[i] = this.busesDepartureStation[0];
        this.busesDepartureStation[0] = temp;
      }
    })
  }

  onSetDestination() {
    this.busesDestinationStation.find((d,i)=>{
      if(Number(d.id)==Number(this.busRouterForm?.controls?.destinationId?.value)){
        let temp = this.busesDestinationStation[i];
        this.busesDestinationStation[i] = this.busesDestinationStation[0];
        this.busesDestinationStation[0] = temp;
      }
    })
  }

  onChangeDeparture($event: any) {
    this.busRouterForm.controls.departureId.setValue($event.value);

    if (!this.isAdd) {
      this.onGetDestinationById($event.value);
      return;
    }

    this.onGetDestinationNotRelationShipById($event.value);
  }

  onChangeDestination($event: any) {
    this.busRouterForm.controls.destinationId.setValue($event.value);

    for (let b of this.busesRouter) {
      if (
        b.ben_xe_di_id == this.busRouterForm.controls.departureId.value &&
        b.ben_xe_toi_id == this.busRouterForm.controls.destinationId.value
      ) {
        this.busRouterForm.controls.busRouterId.setValue(b.id);
        if (!this.isAdd) {
          this.onSetValueForm(b);
        } else {
          this.busRouterForm.patchValue({
            price: b.gia_ca,
            range: b.khoang_cach,
            hour: b.khoang_thoi_gian,
            minute: 0,
          });
        }
        return;
      }
    }
  }

  onSave() {
    let busRouterRequest: BusRouterRequest = {
      diem_di_id: this.busRouterForm.controls.departureId.value,
      diem_toi_id: this.busRouterForm.controls.destinationId.value,
      khoang_cach: Number(this.busRouterForm.controls.range.value),
      gia_ca: this.busRouterForm.controls.price.value,
      thoi_gian_hanh_trinh:
        this.busRouterForm.controls.hour.value +
        ':' +
        this.busRouterForm.controls.minute.value,
    };

    if (this.isNotify) {
      this.isLoading = true;
      if(!this.isBanForTime)
        this.onBanBusRouter(this.busRouterForm.controls.busRouterId.value);
      else{
        this.onBanBusRouterRangeDate(this.busRouterForm.controls.busRouterId.value, this.fromDate, this.toDate);
      }
    } else {
      if (this.isAdd) {
        if(this.busRouterForm?.invalid){
          this.toastr.warning("Xin hãy điền đầy đủ thông tin!");
          return;
        }
        this.onCreateBusRouter(busRouterRequest);
      } else {
        this.onEditBusRouter(busRouterRequest);
      }
    }
  }

  onBanBusRouterRangeDate(busRouterId: any, startDate: any, endDate: any){
    let day = new Date(startDate);
    let sDate = ('0' + day.getDate()).slice(-2)+"/"+
    ('0' + (day.getMonth() + 1)).slice(-2) + "/"+
    day.getFullYear();
    day = new Date(endDate);
    let eDate = ('0' + day.getDate()).slice(-2)+"/"+
    ('0' + (day.getMonth() + 1)).slice(-2) + "/"+
    day.getFullYear();

    this.busRouterService.postCancelDependencyByRangeDate(busRouterId, sDate, eDate)
    .subscribe(
      () => {
        this.onGetBusesRouter();
        this.isLoading = false;
        let message = this.onGetDepartureLabelById(this.busRouterForm?.controls?.departureId?.value) + " ⇒ " + this.onGetDestinationLabelById(this.busRouterForm?.controls?.destinationId?.value);
        this.toastr.success("Chặn tuyến " + message + " thành công!");
      },()=>{
        this.isLoading = false;
        let message = this.onGetDepartureLabelById(this.busRouterForm?.controls?.departureId?.value) + " ⇒ " + this.onGetDestinationLabelById(this.busRouterForm?.controls?.destinationId?.value);
        this.toastr.warning("Chặn tuyến " + message + " thất bại!");
      }
    )
  }

  onBanBusRouter(busRouterId: any) {
    let message = this.onGetDepartureLabelById(this.busRouterForm?.controls?.departureId?.value) + " ⇒ " + this.onGetDestinationLabelById(this.busRouterForm?.controls?.destinationId?.value);
    this.paypalService.getCancelRoute(busRouterId).subscribe(
      () => {
        this.toastr.success('Chặn '+message+' thành công');
        this.onGetBusesRouter();
        this.isNotify = false;
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        this.toastr.warning('Chặn '+message+' thất bại');
      }
    );
  }

  onCreateBusRouter(busRouterRequest: BusRouterRequest) {
    this.busRouterService.postCreateRoute(busRouterRequest).subscribe(
      (data) => {
        this.toastr.success('Thêm tuyến xe thành công');
        this.onGetBusesRouter();
        this.isShow = false;
        this.isAdd = false;
      },
      (error) => {
        this.toastr.warning('Thêm tuyến xe thất bại');
      }
    );
  }

  onEditBusRouter(busRouterRequest: BusRouterRequest) {
    this.busRouterService
      .postUpdateRoute(
        this.busRouterForm.controls.busRouterId.value,
        busRouterRequest
      )
      .subscribe(
        () => {
          this.toastr.success('Cập nhật tuyến thành công!');
          this.onGetBusesRouter();
          this.isShow = false;
          this.isAdd = false;
        },
        () => {
          this.toastr.warning('Cập nhật tuyến thất bại!');
        }
      );
  }

  onShowBanRouter(busRouter: BusSchedule) {
    this.isNotify = true;
    this.isShow = false;
    this.isAdd = false;
    if (busRouter.trang_thai == 0 || busRouter.trang_thai == 2) {
      this.isNotify = false;
      this.isShow = false;
      let message = "Bạn có muốn mở tuyến " + busRouter.ben_xe_di + " ⇒ " + busRouter.ben_xe_toi;

      if (confirm(message)) {
        this.busRouterService.postReturnRoute(busRouter.id).subscribe(
          () => {
            this.toastr.success(
              'Mở tuyến ' +
                busRouter.ben_xe_di +
                ' ⇒ ' +
                busRouter.ben_xe_toi +
                ' thành công'
            );
            this.onGetBusesRouter();
          },
          () => {
            this.toastr.success(
              'Mở tuyến ' +
                busRouter.ben_xe_di +
                ' ⇒ ' +
                busRouter.ben_xe_toi +
                ' thất bại'
            );
          }
        );
      }
      return;
    }

    this.onSetValueForm(busRouter);
    this.onGetBusesStation();
  }

  onBanType(type: boolean){
    this.isBanForTime = type;
  }

  onGetDepartureLabelById(id: number){
    return this.busesDepartureStation.find(b=>Number(b.id)===Number(id))?.ben_toi;
  }

  onGetDestinationLabelById(id: number){
    return this.busesDestinationStation.find(b=>Number(b.id)===Number(id))?.ben_toi;
  }

}
