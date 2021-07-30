import { element } from 'protractor';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BusSchedule } from 'src/app/model/bus-router';
import { BusRouterServiceService } from 'src/app/services/router/bus-router-service.service';
import { fromEvent } from 'rxjs';
import {
  debounceTime,
  map,
  distinctUntilChanged
} from "rxjs/operators";
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-schedule',
  templateUrl: './list-schedule.component.html',
  styleUrls: ['./list-schedule.component.css']
})
export class ListScheduleComponent implements OnInit {

  @ViewChild('placeGo', {static:true})
  placeGoSearch!:ElementRef;

  @ViewChild('placeDes', {static:true})
  placeDesSearch!:ElementRef;

  busRoutes:BusSchedule[] = [];
  busRoutesSearch:BusSchedule[] = [];

  isLoad = true;

  constructor(private busRouteService:BusRouterServiceService, private route: Router) { }

  ngOnInit(): void {
    this.getAllRoute();
    this.onDebounceSearch(this.placeGoSearch,0);
    this.onDebounceSearch(this.placeDesSearch,1);
  }

  getAllRoute(){
    this.isLoad = true;
    this.busRouteService.getAllRoute().subscribe(
      data => {
        this.busRoutes = data.data;
        this.busRoutesSearch = this.busRoutes;
        this.isLoad = false;
      }
    )
  }

  onSearchRoute(value:string, type: number){
    let listRoute: BusSchedule[] = this.busRoutes;
    if(value==""){
      this.busRoutes = this.busRoutesSearch;
      return;
    }

    if(type==0){
      listRoute = listRoute.filter(r => this.removeVietnameseTones(r.ben_xe_di.toLocaleLowerCase()).includes(this.removeVietnameseTones(value.toLocaleLowerCase())));
    }
    else{
      listRoute = listRoute.filter(r => this.removeVietnameseTones(r.ben_xe_toi.toLocaleLowerCase()).includes(this.removeVietnameseTones(value.toLocaleLowerCase())));
    }
    this.busRoutes = [...listRoute];
  }

  onDetail(busRoute:BusSchedule){
    sessionStorage.setItem('routeDetail',JSON.stringify(busRoute))
    this.route.navigate(['/schedule/detail',busRoute.id]);
  }

  onDebounceSearch(element:ElementRef, type:number){
    fromEvent(element.nativeElement,"keyup").pipe(
      map((event:any)=>{
        return event.target.value;
      })
      ,debounceTime(100)
      ,distinctUntilChanged()
    ).subscribe((text:string)=>{
      this.onSearchRoute(text,type);
    })
  }

  onBookTicket(busRoute:BusSchedule){
    this.route.navigate(['/select-route',busRoute.id]);
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
