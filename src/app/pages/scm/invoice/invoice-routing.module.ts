import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from './layout/layout.component';
import { OverviewComponent } from './overview/overview.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';

const routes: Routes = [

    {
        path: '', component: LayoutComponent , children: [
            {path:'', redirectTo:'overview', pathMatch: 'full'},
            {path: "overview", component: OverviewComponent},
        ],
    },
    {path:'create-invoice', component: CreateInvoiceComponent},

]



@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class InvoiceRoutingModule { }