import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';


import { ApprovalModalComponent } from './approve-payments/approval-modal/approval-modal.component';
import { ApproveBulkComponent } from './approve-payments/approve-bulk/approve-bulk.component';
import { ApprovePaymentsComponent } from './approve-payments/approve-payments.component';
import { ApproveSingleComponent } from './approve-payments/approve-single/approve-single.component';
import { ApproveBeneficiariesComponent } from './beneficiary/approve-beneficiaries/approve-beneficiaries.component';
import { ModalContentComponent } from './beneficiary/modal-content/modal-content.component';
import { ViewBeneficiariesComponent } from './beneficiary/view-beneficiaries/view-beneficiaries.component';
import { BulkPaymentsComponent } from './bulk-payments/bulk-payments.component';
import { BulkTableComponent } from './bulk-table/bulk-table.component';
import { BulkReportsComponent } from './reports/bulk-reports/bulk-reports.component';
import { ReportsComponent } from './reports/reports.component';
import { SingleReportsComponent } from './reports/single-reports/single-reports.component';
import { SinglePaymentComponent } from './single-payment/single-payment.component';
import { SingleTableComponent } from './single-table/single-table.component';
import { TransferRoutes } from './transfer.routes';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { CoreModule } from 'src/app/core/core.module';
import { BulkModalComponent } from './bulk-table/bulk-modal/bulk-modal.component';

import { BatchReportsComponent } from './reports/batch-reports/batch-reports.component';
import { UploadBeneficiaryComponent } from './beneficiary/upload-beneficiary/upload-beneficiary.component';
import { ReportModalComponent } from './reports/report-modal/report-modal.component';

@NgModule({
  declarations: [
    SinglePaymentComponent,UploadBeneficiaryComponent,ReportModalComponent, SingleTableComponent, BulkPaymentsComponent, BulkTableComponent, 
    ViewBeneficiariesComponent, ApproveBeneficiariesComponent, SingleReportsComponent, BulkReportsComponent, ReportsComponent, 
    ModalContentComponent, ApprovePaymentsComponent, ApproveSingleComponent, ApproveBulkComponent, ApprovalModalComponent,BulkModalComponent, BatchReportsComponent],
  imports: [
    CommonModule,
    CoreModule,
    NgxPaginationModule,
    RouterModule.forChild(TransferRoutes),
    ReactiveFormsModule,
    FormsModule,
    Ng2SearchPipeModule,
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
  ]
})
export class TransferModule { }
