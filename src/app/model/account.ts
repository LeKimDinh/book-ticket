export interface Account{
    tai_khoan:string;
    mat_khau:string;
    ten:string;
    email:string;
    sdt: string;
    cmnd:string;
    dia_chi:string;
    thanh_pho:string;
    quan_huyen:string;
}

export interface UserAccount{
    id: number;
    cmnd: string;
    email: string;
    sdt: string;
    ten_kh: string;
    tai_khoan: string;
    mat_khau: string;
    dia_chi: string;
    quan_huyen: string;
    thanh_pho: string;
    role: string;
}