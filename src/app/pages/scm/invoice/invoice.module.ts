import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent } from './layout/layout.component';
import { OverviewComponent } from './overview/overview.component';
import { TableTabsComponent } from './table-tabs/table-tabs.component';
import { InvoiceUploaderComponent } from './invoice-uploader/invoice-uploader.component';
import { InvoicePreviewComponent } from './invoice-preview/invoice-preview.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { SendInvoiceComponent } from './send-invoice/send-invoice.component';

@NgModule({
    declarations: [LayoutComponent, OverviewComponent, TableTabsComponent, InvoiceUploaderComponent, InvoicePreviewComponent, CreateInvoiceComponent, SendInvoiceComponent],
    imports: [
        CommonModule,
        InvoiceRoutingModule,
        CoreModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [InvoiceRoutingModule]
})

export class InvoiceModule {}

