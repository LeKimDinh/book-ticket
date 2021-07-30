import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ImageDriveService {
  constructor(private http: HttpClient) {}

   uploadImage(file: any) {
    const fd = new FormData();
    fd.append('file', file);
    return this.http
      .post<any>(`https://uploadfileimage.herokuapp.com/uploadfileimage`, fd)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
