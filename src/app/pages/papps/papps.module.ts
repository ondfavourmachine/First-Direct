import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PappsComponent } from './papps/papps.component';
import { ApprovePappsComponent } from './approve-papps/approve-papps.component';
import { PappsReportComponent } from './papps-report/papps-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CoreModule } from 'src/app/core/core.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { PapssModalComponent } from './papss-modal/papss-modal.component';

const routes:Routes= [
  {
    path:'initiate-papps', component:PappsComponent
  },
  {
    path:'approve-papps',component:ApprovePappsComponent
  },
  {
    path:'papps-reports', component: PappsReportComponent
  }
]

@NgModule({
  declarations: [PappsComponent, ApprovePappsComponent,PappsReportComponent, PappsComponent, PapssModalComponent],
  imports: [
    CommonModule,
    CoreModule,
    NgxPaginationModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    Ng2SearchPipeModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class PappsModule { }
