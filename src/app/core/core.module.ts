import { NgModule } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { HeaderComponent } from "./header/header.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { RouterModule } from "@angular/router";
import { SkeletonLoaderComponent } from "./shared/skeleton-loader/skeleton-loader.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DynamicFormQuestionComponent } from "./shared/dynamic-form-question/dynamic-form-question.component";
import { ConfirmationComponent } from "./shared/confirmation/confirmation.component";
import { SearchFilterPipe } from "./classess/search-files.filter";
import { SummaryComponent } from "./shared/summary/summary.component";
import { NgxCurrencyModule } from "ngx-currency";
import { NgIdleKeepaliveModule } from "@ng-idle/keepalive";
import { TokenInterceptor } from "./interceptor/interceptor";
import { GenericModalComponent } from "./components/modals/generic-modal/generic-modal.component";
import { InvoiceCalculationPipe } from '../invoice-calculation.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    SkeletonLoaderComponent,
    DynamicFormQuestionComponent,
    ConfirmationComponent,
    SummaryComponent,
    SearchFilterPipe,
    GenericModalComponent,
    InvoiceCalculationPipe,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgIdleKeepaliveModule.forRoot(),
    NgxCurrencyModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    SkeletonLoaderComponent,
    ConfirmationComponent,
    SummaryComponent,
    SearchFilterPipe,
    InvoiceCalculationPipe,
    GenericModalComponent,
  ],
  providers:[
    {
      provide:HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi:true
    },
    CurrencyPipe
  ],
})
export class CoreModule {}
