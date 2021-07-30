import { onCompareDate } from 'src/app/shared/compare-date/compare-date';
import { ToastrService } from 'ngx-toastr';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ExcelJson } from '@model/excel-json';
import { RouterForExport } from '@model/router';
import { ExportExcelService } from 'src/app/services/export-excel/export-excel.service';
import { BusRouterServiceService } from 'src/app/services/router/bus-router-service.service';
import { ExcelService } from 'src/app/services/excel/excel.service';
import { ExportCustomer } from '@model/customer';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
@Component({
  selector: 'app-export-file',
  templateUrl: './export-file.component.html',
  styleUrls: ['./export-file.component.css'],
})
export class ExportFileComponent implements OnInit {
  @ViewChild('htmlData') 
  htmlData!: ElementRef;
  isDetail = false; 
  isExport = true;

  busRouterForExport: RouterForExport[] = [] as RouterForExport[];
  busRouterDetail: RouterForExport = {} as RouterForExport;
  date: any;
  today:string = "";
  type!:number;
  isLoad = true;
  isLoadDetail= false;
  routeName!: string;
  runTime!: string;
  customers: ExportCustomer[] = [] as ExportCustomer[];

  constructor(
    private busRouterService: BusRouterServiceService,
    private exportExcelService: ExportExcelService,
    private toartService: ToastrService,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    let day = new Date();
    this.date =
      day.getFullYear() +
      '-' +
      ('0' + (day.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + day.getDate()).slice(-2);
    this.today = this.date;
    this.type = 1;
    this.onGetBusesRouterToExport(this.date);
  }

  onChangeDate($event: any) {
    if($event.value!=this.today){
      this.type = 2;
    }
    else{
      this.type = 1;
    }

    this.isExport = !onCompareDate($event.value, this.today);

    this.isDetail = false;
    this.date = $event.value;
    this.onGetBusesRouterToExport(this.date);
  }

  onGetBusesRouterToExport(date: string) {
    this.isLoad = true;
    let time = ('0' + new Date(date).getDate()).slice(-2) + '/' + ('0' + (new Date(date).getMonth() + 1)).slice(-2) + '/' + new Date(date).getFullYear();
    this.busRouterService.getAllRouteToExport(time).subscribe((data) => {
      this.busRouterForExport = data.data;
      if (this.busRouterForExport.length == 0) {
        this.toartService.info('Không có tuyến nào trong ngày ' + time);
      } else {
        this.busRouterForExport.forEach(
          (b) => (b.tuyen_xe_name = b.tuyen_xe_name.replace('->',' ⇒ '))
        );
      }
      this.isLoad = false;
    });
  }

  onDetail(bus:RouterForExport){
    this.isDetail = true;
    this.routeName = bus.tuyen_xe_name;
    this.busRouterDetail = bus;
    this.runTime = bus.gio_chay;
    let dateD = this.date.split("-");
    this.isLoadDetail = true;
    this.excelService.postExcel(bus.id_tuyen_xe, bus.gio_chay, this.type, dateD[2]+"/"+dateD[1]+"/"+dateD[0])
    .subscribe(
      data => {
        this.customers = data.data.danh_sach_ve;
        this.isLoadDetail = false;
      }
    )
  }

  onExportPDFFile() {
/*     let divToPrint = document.getElementById('router-infor-detail');
    let newWin = window.open('');
    newWin!.document.write(divToPrint!.outerHTML);
    newWin!.print();
    newWin!.close(); */
    let header = [['STT', 'Ten Khach Hang', 'SDT', 'So Luong Ve', 'Ghe']];
    let tableData:any[] = [];
    this.customers.forEach((c,i)=>{
      let user = [
        i+1,
        this.removeVietnameseTones(c.ten_khach_hang),
        c.so_dien_thoai,
        c.vi_tri_giuong.length,
        c.vi_tri_giuong.map(v=>v.stt)
      ]
      tableData.push(user);
    })
    let routeName = this.removeVietnameseTones(this.routeName)
    var pdf = new jsPDF();
    pdf.setFontSize(12);
    pdf.setTextColor(99);
    (pdf as any).autoTable({
    head: header,
    body: tableData,
    })

    pdf.output('dataurlnewwindow')
    const date = this.date.split('-')
    pdf.save(`${routeName}-${date[2]}/${date[1]}/${date[0]}-${this.runTime}h.pdf`);
  }

  onExportExcelFile() {
    const edata: Array<ExcelJson> = [];

    const udt: ExcelJson = {
      data: [
        {
          B: 'STT',
          C: 'Tên Khách',
          D: 'Số Điện Thoại',
          E: 'Số lượng vé',
          F: 'Ghế',
        }, // table header  
      ],
      skipHeader: true,
    };


    this.customers.forEach((customer, index) => {
      let seat ="";
      for(let vt of customer.vi_tri_giuong){
        seat += vt.stt + ", "
      }
      udt.data.push({
        B: index,
        C: customer.ten_khach_hang,
        D: customer.so_dien_thoai,
        E: customer.vi_tri_giuong.length + ' vé',
        F: seat,
      });
    });
    edata.push(udt);
    const date = this.date.split('-')
    let fileName = this.routeName + "-"+date[2]+"."+date[1]+"."+date[0]+"-" + this.runTime+ "h";
    this.exportExcelService.exportJsonToExcel(edata, fileName);
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
}
