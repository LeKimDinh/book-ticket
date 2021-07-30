import { BaseServiceService } from '@baseService/base-service.service';
import { NgModule } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { InforCustomerComponent } from './components/step-book-ticket/infor-customer/infor-customer.component';
import { PaymentComponent } from './components/pay/payment/payment.component';
import { PaypallComponent } from './components/pay/components/paypall/paypall.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ListScheduleComponent } from './components/schedule/list-schedule/list-schedule.component';
import { DetailScheduleComponent } from './components/schedule/detail-schedule/detail-schedule.component';
import { PolicyComponent } from './components/policy/policy.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { LoginComponent } from './components/login-signup/login/login.component';
import { SignupComponent } from './components/login-signup/signup/signup.component';
import { TicketBookingHistoryComponent } from './components/user/ticket-booking-history/ticket-booking-history.component';
import { InforIndividualComponent } from './components/user/infor-individual/infor-individual.component';
import { InforAccountComponent } from './components/user/infor-account/infor-account.component';
import { DashboardComponent } from './components/admin/shared/dashboard/dashboard.component';
import { HomeAdminComponent } from './components/admin/components/home-admin/home-admin.component';
import { AccountManagementComponent } from './components/admin/components/account-management/account-management.component';
import { BusStationComponent } from './components/admin/components/bus-station/bus-station.component';
import { BusRouteComponent } from './components/admin/components/bus-route/bus-route.component';
import { BusTypeComponent } from './components/admin/components/bus-type/bus-type.component';

import { SelectSeatsComponent } from './components/step-book-ticket/select-seats-one-way/select-seats.component';
import { SelectSeatsTwoWayComponent } from './components/step-book-ticket/select-seats-two-way/select-seats-two-way.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SuccessComponent } from './shared/notification/success/success.component';
import { ToastrModule } from 'ngx-toastr';
import { AwardPointComponent } from './components/user/award-point/award-point.component';
import { VnpayComponent } from './components/pay/components/vnpay/vnpay.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { VnpayService } from './services/vnpay/vnpay.service';
import { SelectRouteComponent } from './components/step-book-ticket/select-route/select-route.component';
import { ExportFileComponent } from './components/admin/components/export-file/export-file.component';
import { ExportExcelService } from './services/export-excel/export-excel.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { ImageDriveService } from './services/image-drive/image-drive.service';
import { ChartService } from './services/chart/chart.service';
import { ZaloPayService } from './services/zalo-pay/zalo-pay.service';
import { ZalopayComponent } from './components/pay/components/zalopay/zalopay.component';
import { LoadingComponent } from './shared/loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SelectSeatsComponent,
    InforCustomerComponent,
    PaymentComponent,
    PaypallComponent,
    FooterComponent,
    ListScheduleComponent,
    DetailScheduleComponent,
    PolicyComponent,
    InvoiceComponent,
    LoginComponent,
    SignupComponent,
    SelectSeatsTwoWayComponent,
    TicketBookingHistoryComponent,
    InforIndividualComponent,
    InforAccountComponent,
    DashboardComponent,
    HomeAdminComponent,
    AccountManagementComponent,
    BusStationComponent,
    BusRouteComponent,
    BusTypeComponent,
    SuccessComponent,
    AwardPointComponent,
    VnpayComponent,
    SelectRouteComponent,
    ExportFileComponent,
    ZalopayComponent,
    LoadingComponent,

  ],
  imports: [
    NgxPaginationModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ChartsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgxPayPalModule
    
  ],
  providers: [
    ChartService,
    ImageDriveService,
    BaseServiceService,
    VnpayService,
    ExportExcelService,
    ZaloPayService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
