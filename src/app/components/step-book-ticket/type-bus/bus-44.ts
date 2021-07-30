import { Seat } from 'src/app/model/seats';
export function SetSeatDependencyFloor(seat: any) {
  let seats: any;
  switch (seat.slot_count) {
    case 16:
      return Bus16Seat(seat);
    case 20:
      return Bus20Seat(seat);
    case 44:
      return Bus44Seat(seat);
    default:
      return seats;
  }
}
function Bus16Seat(seat: any) {
  let listSeatOfFloor: any[] = [];
  let index = 1;
  let seats:any = {seat:[]};

  seat.list_giuong = setSeatName(seat.list_giuong);
  seats = {
    seat: [
      0,
      0,
      0,
      0,
      seat.list_giuong[0],
    ],
  };
  listSeatOfFloor.push(seats);
  for (let i = 1; i < seat.row; i++) {
    seats = {
      seat: [
        seat.list_giuong[index],
        0,
        seat.list_giuong[index + 1],
        0,
        seat.list_giuong[index + 2],
      ],
    };
    listSeatOfFloor.push(seats);
    index += seat.srow;
  }
  let seatResult = [];
  seatResult.push(listSeatOfFloor);

  return seatResult;
}

function Bus20Seat(seat: any) {
  let listSeatOfFloor1: any[] = [];
  let listSeatOfFloor2: any[] = [];

  let index = 0;
  let partSeats = seat.list_giuong.length/2;
  let seats:any = {seat:[]};

  seat.list_giuong = setSeatName(seat.list_giuong);

  for (let i = 0; i < seat.row; i++) {
    seats = {
      seat: [
        0,
        seat.list_giuong[index],
        0,
        seat.list_giuong[index + 1],
        0,
      ],
    };
    listSeatOfFloor1.push(seats)
  
    seats = {
      seat: [
        0,
        seat.list_giuong[index + partSeats],
        0,
        seat.list_giuong[index + 1 + partSeats],
        0
      ],
    };
    listSeatOfFloor2.push(seats)

    index += seat.srow;
  }
  let seatResult = [];
  seatResult.push(listSeatOfFloor1);
  seatResult.push(listSeatOfFloor2);
  return seatResult;
}

function Bus44Seat(seat: any) {
  let listSeatOfFloor1: any[] = [];
  let listSeatOfFloor2: any[] = [];

  let index = 0;
  let partSeats = seat.list_giuong.length/2;
  let seats:any = {seat:[]};

  seat.list_giuong = setSeatName(seat.list_giuong);

  for (let i = 0; i < seat.row; i++) {
    if(i<seat.row-2){
      seats = {
        seat: [
          seat.list_giuong[index],
          0,
          seat.list_giuong[index + 1],
          0,
          seat.list_giuong[index + 2],
        ],
      };
  
      listSeatOfFloor1.push(seats)
  
      seats = {
        seat: [
          seat.list_giuong[index + partSeats],
          0,
          seat.list_giuong[index + 1 + partSeats],
          0,
          seat.list_giuong[index + 2 + partSeats],
        ],
      };
  
      listSeatOfFloor2.push(seats)
    }else{
      if(i==seat.row-2){
        seats = {
          seat: [
            seat.list_giuong[index],
            0,
            0,            
            0,
            seat.list_giuong[index + 1],
          ],
        }
        listSeatOfFloor1.push(seats);
        seats = {
          seat: [
            seat.list_giuong[index + partSeats],
            0,
            0,            
            0,
            seat.list_giuong[index + 1 +partSeats],
          ],
        }
        listSeatOfFloor2.push(seats);
      }
      else{
        seats = {
          seat: [
            seat.list_giuong[index - 1],
            seat.list_giuong[index],
            seat.list_giuong[index + 1],            
            seat.list_giuong[index + 2],
            seat.list_giuong[index + 3],
          ],
        }
        listSeatOfFloor1.push(seats);
        seats = {
          seat: [
            seat.list_giuong[index + partSeats - 1],
            seat.list_giuong[index + partSeats],
            seat.list_giuong[index + 1 + partSeats],            
            seat.list_giuong[index + 2 + partSeats],
            seat.list_giuong[index + 3 +partSeats],
          ],
        }
        listSeatOfFloor2.push(seats);
      }
    }
    index += seat.srow;
  }
  let seatResult = [];
  seatResult.push(listSeatOfFloor1);
  seatResult.push(listSeatOfFloor2);
  return seatResult;
}


function setSeatName(seat:any){
  for(let i of seat){
    if(i.stt<10){
      i.name = ("A0"+i.stt);
    }
    else if(i.stt>=10&&i.stt<=22){
       i.name = ("A"+i.stt);
    }
    else if(i.stt-22<10&&i.stt-22>0){
       i.name = ("B0"+(i.stt-22));
    }
    else{
       i.name = ("B"+(i.stt-22));
    }
  }
  return seat;
}