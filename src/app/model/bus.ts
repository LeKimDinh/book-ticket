export interface Bus{
    ten_xe:string;
    hang_xe:string;
    tuyen_san_sang_id:string;
    tuyen_off_id:string;
    gio_chay:string;
    diem_di_id: string;
    diem_toi_id: string;
}

export interface BusManagement{
    id:number;
    tenXe:string;
    hangXe: string;
    
}

export interface BusType{
    floor:number;
    gioChay:string;
    gioChayDouble:number;
    hangXe: string;
    id:Int16Array;
    row:number;
    slotCount: number;
    srow: number;
    tenXe: string;
    trangThai: number;
    tuyenOffId: number;
    tuyenSanSangId: Int16Array;
    diem_di: string;
    diem_di_id: number;
    diem_toi: string;
    diem_toi_id: number;
    block_forever: boolean;
}