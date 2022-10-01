import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from './layout/layout.component';
import { OverviewComponent } from './overview/overview.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { InvoicePreviewComponent } from './invoice-preview/invoice-preview.component';
import { InvoiceUploaderComponent } from './invoice-uploader/invoice-uploader.component';
import { SendInvoiceComponent } from './send-invoice/send-invoice.component';
import { TableTabsComponent } from './table-tabs/table-tabs.component';
const routes: Routes = [

    {
        path: '', component: LayoutComponent , children: [
            {path:'', redirectTo:'overview', pathMatch: 'full'},
            {path: "overview", component: OverviewComponent},
            {path: "pages", component: TableTabsComponent}

        ],
    },
    {path:'create-invoice', component: CreateInvoiceComponent},
    {path:'invoice-preview', component: InvoicePreviewComponent},
    {path:'invoice-uploader', component: InvoiceUploaderComponent},
    {path:'send-invoice', component: SendInvoiceComponent},

]



@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class InvoiceRoutingModule { }