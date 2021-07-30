import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { TicketRevenue } from '@model/ticket';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { BusServiceService } from 'src/app/services/bus/bus-service.service';
import { CustomerServiceService } from 'src/app/services/customer/customer-service.service';
import { BusRouterServiceService } from 'src/app/services/router/bus-router-service.service';
import { BusStationServiceService } from 'src/app/services/station/bus-station-service.service';
import { TicketServiceService } from 'src/app/services/ticket/ticket-service.service';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css'],
})
export class HomeAdminComponent implements OnInit {
  year!: number;
  ticketRevenue: TicketRevenue[] = [] as TicketRevenue[];
  totalAmount: number = 0;
  totalTicket: number = 0;
  isLoad = true;
  isLoadAccount = true;

  accountNumber!: number;
  busStationNumber!: number;
  busRouterNumber!: number;
  busNumber!: number;

  lineChartData: ChartDataSets[] = [
    {       
      data: [],
      label: '' 
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
  lineChartOptions: (ChartOptions & { annotation?: any }) = {
    responsive: true,
  };
  lineChartColors: Color[] = [
    {
      borderColor: '#ef5222;',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];

  lineChartLegend = true;
  lineChartType:any = 'line';
  lineChartPlugins = [];

  constructor(
    private customerService: CustomerServiceService,
    private busStationService: BusStationServiceService,
    private busRouterService: BusRouterServiceService,
    private busService: BusServiceService,
    private ticketService: TicketServiceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.year = new Date().getFullYear();
    this.onGetAccountNumber();
    this.onGetBusStationNumber();
    this.onGetBusRouterNumber();
    this.onGetBusNumber();
    this.onGetDataForChartByYear(this.year);
  }

  onGetDataForChartByYear(year: number) {
    this.isLoad = true;
    this.isLoad = true;
    let fullYear = '01/01/' + year;
    this.ticketService.getTicketRevenue(fullYear).subscribe(
      (data) => {
        this.ticketRevenue = data.data;
        this.onCalculatorRevenueByYear(this.ticketRevenue);
        this.isLoad = false;
      },
      (error) => {
        console.log(error);
        this.isLoad = false;
      }
    );
  }

  onCalculatorRevenueByYear(data: TicketRevenue[]) {
    this.lineChartData[0].data = [];
    this.totalAmount = 0;
    this.totalTicket = 0;
    data.forEach((d) => {
      this.totalAmount += d.total_amount;
      this.totalTicket += d.total_ticket;
      this.lineChartData[0].data?.push(d.total_amount);
    });
    this.lineChartData[0].label = 'Doanh thu của nhà xe (VNĐ)';
    this.isLoad = false;
  }

  onPreviousYear() {
    if(this.year == 2020){
      this.toastr.info("Công ty thành lập năm 2020");
      return;
    }
    this.year = this.year - 1;

    this.onGetDataForChartByYear(this.year);
  }

  onNextYear() {
    if(this.year == new Date().getFullYear())
      return;
    this.year = this.year + 1;
    this.onGetDataForChartByYear(this.year);
  }

  onGetAccountNumber() {
    this.customerService.getAccountNumber().subscribe(
      (data) => {
        this.accountNumber = data.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onGetBusStationNumber() {
    this.busStationService.getBusStationNumber().subscribe(
      (data) => {
        this.busStationNumber = data.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onGetBusRouterNumber() {
    this.busRouterService.getBusRouterNumber().subscribe(
      (data) => {
        this.busRouterNumber = data.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onGetBusNumber() {
    this.busService.getBusNumber().subscribe(
      (data) => {
        this.busNumber = data.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
