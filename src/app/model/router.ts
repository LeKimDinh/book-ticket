export interface Router{
    id:Int16Array;
    ben_xe_di_id:Int16Array;
    ben_xe_di:string;
    ben_xe_toi_id:Int16Array;
    ben_xe_toi:string;
    gia_ca:Float32Array;
    khoang_cach:Float32Array;
    khoang_thoi_gian:Float32Array;
    trang_thai:Int16Array;
}

export interface RevenueRouterInfor{
    id_tuyen_xe: Int16Array;
    percent: string;
    total_amount: number;
    total_ticket: number;
    tuyen_xe_name: string;
    year: string;
}

export interface RouterForExport{
    id: Int16Array;
    id_tuyen_xe: Int16Array;
    gio_chay: string;
    so_luong_ve: Int16Array;
    tuyen_xe_name: string;
}