import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { ReportRoutes } from './reports.route';
import { NeftReportsComponent } from './transaction-reports/neft-reports/neft-reports.component';
import { RtgsReportsComponent } from './transaction-reports/rtgs-reports/rtgs-reports.component';
import { TransactionReportsComponent } from './transaction-reports/transaction-reports.component';
import { AccountReportsComponent } from './account-reports/account-reports.component';
import { SuspenseReportsComponent } from './account-reports/suspense-reports/suspense-reports.component';
import { CorporateAccountReportsComponent } from './account-reports/account-reports/account-reports.component';
import { UploadReportsComponent } from './upload-reports/upload-reports.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AllReportsComponent } from './all-reports/all-reports.component';
import { ReversalReportsComponent } from './reversal-reports/reversal-reports.component';
@NgModule({
  declarations: [NeftReportsComponent, RtgsReportsComponent, 
    TransactionReportsComponent, AccountReportsComponent,
    CorporateAccountReportsComponent, SuspenseReportsComponent, UploadReportsComponent, AllReportsComponent, ReversalReportsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(ReportRoutes),
    CoreModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    TooltipModule.forRoot(),
    BsDatepickerModule.forRoot()
  ]
})
export class ReportsModule { }

