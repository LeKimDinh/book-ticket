export interface LogIn{
    tai_khoan:string;
    mat_khau: string;    
}

export interface Customer{
    id:number;
    ten_khach_hang: string;
    email: string;
    discount: number;
    Token: string;
    Roles: [];
}

export interface CustomerInfor{
    id:Int16Array;
    taiKhoan:string;
    tenKh:string;
    email:string;
    sdt:string;
    cmnd:string;
    diaChi:string;
    thanhPho:string;
    quanHuyen:string;
    status:Int16Array;
    diemTichLuy:number;
    discount:Int16Array;
    tongDiem:Int16Array;
    updatedAtFormatVN: Date;
}

export interface UpdateCustomer{
    id:Int16Array;
    email:string;
    ten:string;
    sdt:string;
    cmnd:string;
    dia_chi:string;
    thanh_pho:string;
    quan_huyen:string;
}

export interface ExportCustomer{
    diem_xuong: string;
    ma_ve: string;
    so_dien_thoai: string;
    ten_khach_hang:string;
    vi_tri_giuong: Seat[];
}

export interface Seat{
    id:string;
    stt: string;
    ten: string;
    id_ve: string;
    dia_chi: string;
    noi_xuong: string;
}