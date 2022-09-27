import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PurchaseOrderRoutingModule} from './purchaseOder-routing.nodule';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent } from './layout/layout.component';
import { CreateOderComponent } from './create-oder/create-oder.component';
import { OderPreviewComponent } from './oder-preview/oder-preview.component';
import { OverviewComponent } from './overview/overview.component';
import { TableTabsComponent } from './table-tabs/table-tabs.component';
import { OderFileUploaderComponent } from './oder-file-uploader/oder-file-uploader.component';
import { SendOrderComponent } from './send-order/send-order.component';



@NgModule({
    declarations: [LayoutComponent, CreateOderComponent, OderPreviewComponent, OverviewComponent, TableTabsComponent, OderFileUploaderComponent, SendOrderComponent],
    imports: [
        CommonModule,
        PurchaseOrderRoutingModule,
        CoreModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [PurchaseOrderRoutingModule]
})

export class PurchaseOrderModule {}