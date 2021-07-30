export interface BusRouter{
    id:Int16Array;
    picture:string;
    diem_di_id:Int16Array;
    diem_toi_id:Int16Array;
    khoang_cach:Int16Array;
    gia_ca:number;
    start_date: string;
    finish_date: string;
}

export interface BusRouterPopular{
    id: Int16Array;
    ben_xe_di: string;
    ben_xe_toi: string;
    gia_ca:string;
    khoang_cach: string;
    khoang_thoi_gian: Int16Array;
    hinh_anh:string;
}

export interface BusSchedule{
    id:Int16Array;
    ben_xe_di:string;
    ben_xe_di_id: Int16Array;
    ben_xe_toi: string;
    ben_xe_toi_id: Int16Array;
    gia_ca:Int16Array;
    khoang_cach:Int16Array;
    khoang_thoi_gian:Int16Array;
    trang_thai:number;
}

export interface BusRouterInfor{
    id:Int16Array;
    diem_di:string;
    diem_di_id: string;
    diem_toi: string;
    diem_toi_id: string;
    gia_ca:Int16Array;
    khoang_cach:Int16Array;
    khoang_thoi_gian:Int16Array;
    status:Int16Array;
}

export interface BusRouterRequest{
    diem_di_id: number;
    diem_toi_id: number;
    khoang_cach: number;
    gia_ca: number;
    thoi_gian_hanh_trinh: string;
}
