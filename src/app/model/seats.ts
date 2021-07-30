export interface Seat{
    floor: number;
    row: number;
    srow:number;
    slot_count:number;
    list_giuong:seat[];   
}

export interface seat{
    stt:Int16Array;
    trang_thai:Int16Array;
    name: string;
}