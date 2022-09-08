import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/globals/auth.guard';
import { ApprovePaymentsComponent } from './approve-payments/approve-payments.component';
import { ApproveBeneficiariesComponent } from './beneficiary/approve-beneficiaries/approve-beneficiaries.component';
import { ViewBeneficiariesComponent } from './beneficiary/view-beneficiaries/view-beneficiaries.component';
import { BulkPaymentsComponent } from './bulk-payments/bulk-payments.component';
import { ReportsComponent } from './reports/reports.component';
import { SinglePaymentComponent } from './single-payment/single-payment.component';

export const TransferRoutes:Routes = [
    { path:'single-payments', component:SinglePaymentComponent },
    { path:'bulk-payments', component:BulkPaymentsComponent },
    { path:'payment-reports', component:ReportsComponent },
    { path:'beneficiaries',component:ViewBeneficiariesComponent },
    { path:'pending-beneficiaries', component:ApproveBeneficiariesComponent },
    { path:'approve-payments',  component:ApprovePaymentsComponent },
]