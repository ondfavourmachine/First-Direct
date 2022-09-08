import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { AccountsComponent } from './accounts/accounts.component';
import { ExchangeRateComponent } from './exchange-rate/exchange-rate.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AuthGuard } from 'src/app/core/globals/auth.guard';

const Routes:Routes = [
  { path:'account-center', canActivate:[AuthGuard], component:AccountsComponent},
  { path:'exchange-rate', canActivate:[AuthGuard], component:ExchangeRateComponent},
]

@NgModule({
  declarations: [AccountsComponent, ExchangeRateComponent],
  imports: [
    CommonModule,
    CoreModule,
    NgxPaginationModule,
    RouterModule.forChild(Routes),
    ReactiveFormsModule,
    FormsModule,
    Ng2SearchPipeModule,
    BsDatepickerModule.forRoot(),
    TooltipModule
  ]
})
export class AccountManagementModule { }
