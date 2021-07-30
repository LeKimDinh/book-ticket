import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BusStation } from '@model/bus-station';
import { BusStationServiceService } from 'src/app/services/station/bus-station-service.service';
import { ToastrService } from 'ngx-toastr';
import { ImageDriveService } from 'src/app/services/image-drive/image-drive.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

type NewType = ChartOptions;

@Component({
  selector: 'app-bus-station',
  templateUrl: './bus-station.component.html',
  styleUrls: ['./bus-station.component.css'],
})
export class BusStationComponent implements OnInit {
  year!: number;

  inputSearch = '';
  busStationIdRevenue!: number;
  srcImage: any = '';
  picture: any = '';
  isSubmit = false;
  isAdd = true;
  isLoad = true;
  isLoadStation = false;
  isShow = false;

  busStationId: any;

  busStations: BusStation[] = [] as BusStation[];
  busStationsSearch: BusStation[] = [] as BusStation[];

  busStationForm!: FormGroup;
  busStationRevenueForm!: FormGroup;

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
  lineChartOptions: NewType & { annotation?: any } = {
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
    private busStationService: BusStationServiceService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private imageSerive: ImageDriveService
  ) {}

  ngOnInit(): void {
    this.year = new Date().getFullYear();

    this.onFormInit();
    this.onRevenueFormInit();

    this.onGetAllBusStation();
  }

  onChangeBusStation($event: any) {
    let bus = this.busStationsSearch.find((b) => b.id == $event.value);

    this.busStationRevenueForm.controls.busStationId.setValue($event.value);

    this.onGetBusStationRevenue(
      this.year,
      this.busStationRevenueForm.controls.busStationId.value
    );

    this.busStationRevenueForm.controls.address.setValue(bus?.dia_chi);
  }

  onSearch(search: string) {
    this.busStations = this.busStationsSearch;
    search = this.removeVietnameseTones(search.toLocaleLowerCase());

    let busSearchByCity: BusStation[] = [] as BusStation[];

    for (let i of this.busStations) {
      let city = i.thanh_pho;
      city = this.removeVietnameseTones(city.toLocaleLowerCase());
      if (city.includes(search)) {
        busSearchByCity.push(i);
      }
    }

    this.busStations = this.onUniqueArray(busSearchByCity);
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

  onUniqueArray(array: BusStation[]) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j]) a.splice(j--, 1);
      }
    }
    return a;
  }

  onPreviousYear() {
    if (this.year == 2020) {
      this.toastr.info('Công ty thành lập năm 2020');
      return;
    }
    this.year = this.year - 1;
    this.onGetBusStationRevenue(
      this.year,
      this.busStationRevenueForm.controls.busStationId.value
    );
  }

  onNextYear() {
    if (this.year == new Date().getFullYear()) return;
    this.year = this.year + 1;
    this.onGetBusStationRevenue(
      this.year,
      this.busStationRevenueForm.controls.busStationId.value
    );
  }

  onFormInit() {
    this.busStationForm = this.fb.group({
      busStationName: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
    });
  }

  onRevenueFormInit() {
    this.busStationRevenueForm = this.fb.group({
      busStationId: [null],
      ticket: new FormControl(0),
      amount: new FormControl(0),
      address: new FormControl(''),
    });
  }

  onSetValueForm(data: any) {
    this.busStationId = data.id;
    this.busStationForm.patchValue({
      busStationName: data.ben_toi,
      address: data.dia_chi,
      city: data.thanh_pho,
    });
    this.srcImage = data.picture;
    this.picture = data.picture;
    this.isLoadStation = false;
  }

  onResetValueForm() {
    this.busStationForm.patchValue({
      busStationName: null,
      address: null,
      city: null,
    });
    this.srcImage = '';
    this.picture = '';
  }

  onSubmit() {
    this.isSubmit = true;
    this.isLoadStation = true;
    let busStation = {
      ten_ben: this.busStationForm.controls.busStationName.value,
      dia_chi: this.busStationForm.controls.address.value,
      thanh_pho: this.busStationForm.controls.city.value,
      picture: "",
    };
    this.onImageFromDriver(this.fileSelected, busStation);
  }

  onCreateBusStation(busStation: any) {
    this.busStationService.postCreateStation(busStation).subscribe(
      (data) => {
        this.toastr.success('Thêm bến xe thành công');
        this.srcImage = "";
        this.onGetAllBusStation();
        this.isSubmit = false;
        this.isShow = false;
        this.isLoadStation = false;
      },
      () => {
        this.toastr.warning('Thêm bến thất bại');
        this.isSubmit = false;
      }
    );
  }

  onPostBusStation(busStation: any) {
    this.busStationService
      .postUpdateStation(this.busStationId, busStation)
      .subscribe(
        (data) => {
          this.onGetAllBusStation();
          this.toastr.success('Chỉnh sửa bến xe thành công');
          this.isSubmit = false;
          this.isLoadStation = false;
        },
        (error) => {
          this.toastr.warning('Chỉnh sửa bến thất bại');
          this.isSubmit = false;
        }
      );
  }

  onEditBusStation(busStation: BusStation) {
    this.isAdd = false;
    this.isShow = true;
    this.isLoadStation = true;
    this.onSetValueForm(busStation);
  }

  onAddBusStation() {
    this.isAdd = true;
    this.isShow = true;
    this.onResetValueForm();
  }

  onDeleteBusStation(busStationId: number) {}

  fileSelected: any;

  imgeChanged(obj: any) {
    this.fileSelected = <File>obj.target.files[0];
    if (obj.target.files && obj.target.files[0]) {
      const file = obj.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => (this.srcImage = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onImageFromDriver(file: any, busStation: any) {
    this.imageSerive
      .uploadImage(file)
      .pipe()
      .subscribe(
        (res) => {
          this.picture = `https://drive.google.com/uc?id=${res.id}`;
          busStation.picture = this.picture;
          if (this.isAdd) {
            if(this.busStationForm.invalid){
              return;
            }
            this.onCreateBusStation(busStation);
          } else {
            this.onPostBusStation(busStation);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onGetAllBusStation() {
    this.isLoad = true;
    this.busStationService.getAllBusStation().subscribe((data) => {
      this.busStations = data.data;
      this.busStationsSearch = data.data;

      this.lineChartData[0].label =
        'Doanh thu của bến ' + this.busStationsSearch[0].ben_toi;

      this.busStationRevenueForm.controls.address.setValue(
        this.busStations[0].dia_chi
      );
      this.busStationRevenueForm.controls.busStationId.setValue(
        this.busStationsSearch[0].id
      );
      this.busStationIdRevenue = this.busStationsSearch[0].id;
      this.onGetBusStationRevenue(this.year, this.busStations[0].id);
    });
  }

  onGetBusStationRevenue(year: number, busStationId: number) {
    this.isLoad = true;
    this.busStationService
      .getBusStationRevenue(year, busStationId)
      .subscribe((data) => {
        this.busStationRevenueForm.controls.amount.setValue(data.data.total);
        this.lineChartData[0].data = [];

        let ticket = 0;

        for (let b of data.data.list_data) {
          ticket += b.total_ve;
          this.lineChartData[0].data.push(b.total_amount);
        }
        this.lineChartData[0].label = 'Doanh thu của bến ' + this.busStationsSearch.find(b=>b.id==this.busStationIdRevenue)?.ben_toi;

        this.busStationRevenueForm.controls.ticket.setValue(ticket);
        this.isLoad = false;
      });
  }
}
