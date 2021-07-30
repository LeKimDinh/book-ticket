import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeAdminComponent } from './components/admin/components/home-admin/home-admin.component';
import { DashboardComponent } from './components/admin/shared/dashboard/dashboard.component';

import { HomeComponent } from './components/home/home.component';
import { InforCustomerComponent } from './components/step-book-ticket/infor-customer/infor-customer.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { PaypallComponent } from './components/pay/components/paypall/paypall.component';
import { PaymentComponent } from './components/pay/payment/payment.component';
import { PolicyComponent } from './components/policy/policy.component';
import { DetailScheduleComponent } from './components/schedule/detail-schedule/detail-schedule.component';
import { ListScheduleComponent } from './components/schedule/list-schedule/list-schedule.component';
import { SelectSeatsComponent } from './components/step-book-ticket/select-seats-one-way/select-seats.component';
import { SelectSeatsTwoWayComponent } from './components/step-book-ticket/select-seats-two-way/select-seats-two-way.component';
import { AwardPointComponent } from './components/user/award-point/award-point.component';
import { InforAccountComponent } from './components/user/infor-account/infor-account.component';
import { InforIndividualComponent } from './components/user/infor-individual/infor-individual.component';
import { TicketBookingHistoryComponent } from './components/user/ticket-booking-history/ticket-booking-history.component';
import { SelectRouteComponent } from './components/step-book-ticket/select-route/select-route.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'select-route/:id', component: SelectRouteComponent },
  { path: 'select-seats', component: SelectSeatsComponent },
  { path: 'select-seats-two-way', component: SelectSeatsTwoWayComponent },
  {
    path: 'infor-customer',
    component: InforCustomerComponent,
  },
  {
    path: 'confirm-infor/:email',
    component: PaymentComponent,
    data: {
      isPay: true,
    },
  },
  {
    path: 'success/:email',
    component: PaymentComponent,
    data: { isSuccess: true },
  },
  { path: 'paypall/:email', component: PaypallComponent },
  { path: 'schedule', component: ListScheduleComponent },
  { path: 'schedule/detail/:id', component: DetailScheduleComponent },
  { path: 'policy', component: PolicyComponent },
  { path: 'invoice', component: InvoiceComponent },
  { path: 'infor-account/:email', component: InforAccountComponent },
  { path: 'infor-individual/:email', component: InforIndividualComponent },
  {
    path: 'ticket-booking-history/:email',
    component: TicketBookingHistoryComponent,
  },
  { path: 'point-award/:email', component: AwardPointComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
