import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusStation } from '@model/bus-station';
import { BusSchedule } from 'src/app/model/bus-router';
import { BusRouterServiceService } from 'src/app/services/router/bus-router-service.service';
import { SeatServiceService } from 'src/app/services/seat/seat-service.service';
import { BusStationServiceService } from 'src/app/services/station/bus-station-service.service';

@Component({
  selector: 'app-detail-schedule',
  templateUrl: './detail-schedule.component.html',
  styleUrls: ['./detail-schedule.component.css']
})
export class DetailScheduleComponent implements OnInit {
  date:any;
  today:any
  isShow: boolean = true;
  routeId!:Int16Array;

  busStationInfor:BusStation = {} as BusStation;
  routes:BusSchedule[] = [] as BusSchedule[];
  route:any;

  times:any[] = [];
  isLoad = true;

  constructor(private activeRoute:ActivatedRoute
    ,private seatService: SeatServiceService
    , private busRouterService: BusRouterServiceService
    , private busStationService: BusStationServiceService
    , private router: Router
    ) { }

  ngOnInit(): void {
    this.routeId = this.activeRoute.snapshot.params['id'];
    this.getRouteDetail();
    this.setDate(); 
    this.getBusStationById(this.route.ben_xe_di_id);
    this.getRoute();
  }

  setDate(){
    let now = new Date();
    this.date = now.getFullYear()+ '-' + ('0' + (now.getMonth() + 1)).slice(-2)  + '-' + ('0' + now.getDate()).slice(-2);
    this.today = this.date;
  }

  getRouteDetail(){
    this.route = JSON.parse(sessionStorage.getItem('routeDetail')!);
  }

  onChangeDate($event:any){
    this.date = $event.value;
    this.getRouteById(this.route.diem_di_id,this.route.diem_toi_id, this.date);
  }

  getRoute(){
    this.busRouterService.getAllRoute().subscribe(
      data => {
        this.routes = data.data;
        let routeTemp = data.data[0];
        this.routes?.map(r=>{
          if(r.id == this.routeId){
            routeTemp = r;
            r = data.data[0];
            this.routes[0] = routeTemp;
          }
        })
        this.route = data.data[0];
        this.getRouteById(this.route.ben_xe_di_id, this.route.ben_xe_toi_id, this.date);
      }
    )
  }

  getRouteById(departureId: Int16Array, destinationId: Int16Array, date: string){
    let dateS = date.split("-");
    let dateR = dateS[2]+"/"+dateS[1]+"/"+dateS[0];
    this.busRouterService.getRouterById(departureId, destinationId, dateR)
    .subscribe(
      data => {
        this.route = data.data;
        if(data.data.start_date==null){
          this.isShow = true;
          this.getTime(this.route.id,this.date);
        }else{
          this.isShow = false;
        }
      }
    )
  }

  onChangeRoute($event:any){
    this.isLoad = true;
    this.busRouterService.getRouterInforById($event.value).subscribe(
      data =>{
        this.route = data.data;
        this.route.ben_xe_di = data.data.diem_di;
        this.route.ben_xe_di_id = data.data.diem_di_id;
        this.route.ben_xe_toi_id = data.data.diem_toi_id;
        this.route.ben_xe_toi = data.data.dime_toi;
       
        this.getBusStationById(data.data.diem_di_id);
        this.getRouteById(this.route.ben_xe_di_id,this.route.ben_xe_toi_id,this.date);
        this.getTime($event.value, this.date);
      }
    )
  }

  getBusStationById(busStationsId: Int16Array){
    this.busStationService.getBusStationDetailById(busStationsId).subscribe(
      data => {
        this.busStationInfor = data.data;
      }
    )
  }

  getTime(routerId:any, date: string){
    this.times = [];
    let dateS = date.split("-");
    let dateR = dateS[2]+"/"+dateS[1]+"/"+dateS[0];
    this.isLoad = true;
    this.busRouterService.getRunTime(routerId,dateR).subscribe(data=>{
      for(let t of data.data){
        let endTime = this.onCalculateTime(t.giochay,this.route.khoang_thoi_gian)
        this.times.push({
          run_time: t.giochay,
          end_time: endTime
        })
      };
      this.isLoad = false;
    });
  }

  onBookTicket(){
    sessionStorage.setItem("date", JSON.stringify(this.date));
    sessionStorage.setItem("time", JSON.stringify(this.date));
    this.router.navigate(["/select-route",this.routeId]);
  }

  onCalculateTime(time: string, rangeTime: string){
    let timeN = time.split(":");
    let rTime = rangeTime.split(":");

    let hour = parseInt(timeN[0]) + parseInt(rTime[0]);
    let minute = parseInt(timeN[1]) + parseInt(rTime[1]);

    let minuteD =  parseInt((minute/60).toString());
    if(minuteD>0){
      minute = minute - (minuteD*60);
      hour += minuteD;
    }
    if(hour>24){
      hour -= 24;
    }
    return hour+":"+minute;
  }
}
