export function onCompareDate(date1: string, date2: string) {
    let date_1 = new Date(date1);
    let date_2 = new Date(date2);

    if(date_1.getFullYear()>=date_2.getFullYear()){
        if(date_1.getMonth()>=date_2.getMonth()){
            if(date_1.getDate()>date_2.getDate()){
                return true;
            }
        }
    }

    return false;
}


