export interface Ticket{
    id_tuyen_xe: Int16Array;
    gio_chay: Int16Array;
    gio_ket_thuc: Int16Array;
    sdt: string;
    email: string;
    date: string;
    gia_ve: number;
    slot: [];

    id:Int16Array;
    ngay_chay:string;
    count:Int16Array;
    code:string;
    ben_di:string;
    ben_toi:string;
    ngay_dat:string;
    ngay_thanh_toan:string;
    trang_thai:any;
}

export interface TicketTwoWay{
    gio_chay: Int16Array;
    gio_ket_thuc: Int16Array;
    id_tuyen_xe: Int16Array;
    date: string;
    gia_ve: Int16Array;
    slot: [];

    gio_chay2: Int16Array;
    gio_ket_thuc2: Int16Array;
    id_tuyen_xe2: Int16Array;
    date2: string;
    gia_ve2: Int16Array;
    slot2: [];

    sdt: string;
    email: string;
}

export interface TicketRevenue{
    time: string;
    total_amount: number;
    total_ticket: number;
}