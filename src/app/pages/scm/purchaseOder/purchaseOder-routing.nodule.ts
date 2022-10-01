import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { OverviewComponent } from './overview/overview.component';
import { CreateOderComponent } from './create-oder/create-oder.component';
import { OderPreviewComponent } from './oder-preview/oder-preview.component';
import { OderFileUploaderComponent } from './oder-file-uploader/oder-file-uploader.component';
import { SendOrderComponent } from './send-order/send-order.component';
import { TableTabsComponent } from './table-tabs/table-tabs.component';


const routes: Routes = [
    {
        path: '', component: LayoutComponent, children: [
            { path: '', redirectTo: 'overview', pathMatch: 'full' },
            { path: "overview", component: OverviewComponent },
            { path: "pages", component: TableTabsComponent }
        ],
    }
    , { path: 'create-order', component: CreateOderComponent },
    { path: 'oder-preview', component: OderPreviewComponent },
    { path: 'oder-file-uploader', component: OderFileUploaderComponent },
    { path: 'send-order', component: SendOrderComponent },


]



@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]

})  

export class PurchaseOrderRoutingModule { }