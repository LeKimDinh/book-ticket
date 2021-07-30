import { seat } from "./seats";


export interface Step2 {
  routerId:Int16Array;
  time:string;
  boardingPoint:{
    id:number,
    name:string
  };
  seats:seat[];
  number:number;
  totalMoney:number;
}

