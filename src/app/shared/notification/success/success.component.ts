import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

  

  constructor(private toastr: ToastrService) { 
   
  }

  ngOnInit(): void {
  }

  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }


}
