import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitiateComponent } from './initiate/initiate.component';
import { ForeignReportsComponent } from './foreign-reports/foreign-reports.component';
import { ForeignModalComponent } from './foreign-modal/foreign-modal.component';
import { ApproveForeignComponent } from './approve-foreign/approve-foreign.component';
import { CoreModule } from 'src/app/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import { ForeignRoutes } from './foreign-routes';
import { SettlementInstructionComponent } from './settlement-instruction/settlement-instruction.component';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [InitiateComponent, ForeignReportsComponent, ForeignModalComponent, ApproveForeignComponent, SettlementInstructionComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    RouterModule.forChild(ForeignRoutes),
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
  ]
})
export class ForeignPaymentsModule { }
