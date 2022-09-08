import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesComponent } from './services/services.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { ApproveComponent } from './approve/approve.component';
import { ReportsComponent } from './reports/reports.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PendingRequestsComponent } from './approve/pending-requests/pending-requests.component';
import { SrModalComponent } from './sr-modal/sr-modal.component';
import { PendingStopsComponent } from './approve/pending-stops/pending-stops.component';
import { PendingConfirmationsComponent } from './approve/pending-confirmations/pending-confirmations.component';
import { SrViewComponent } from './sr-modal/sr-view/sr-view.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { ServiceRoutes } from './service.routes';
@NgModule({
  declarations: [ServicesComponent,SrViewComponent,PendingConfirmationsComponent, ApproveComponent, ReportsComponent,PendingRequestsComponent,PendingStopsComponent, SrModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(ServiceRoutes),
    CoreModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    BsDatepickerModule.forRoot()
  ]
})
export class ServiceChargeModule { }