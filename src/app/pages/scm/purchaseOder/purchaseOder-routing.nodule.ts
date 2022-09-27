import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { OverviewComponent } from './overview/overview.component';
import { CreateOderComponent } from './create-oder/create-oder.component';


const routes: Routes = [
    {
        path: '', component: LayoutComponent, children: [
            { path: '', redirectTo: 'overview', pathMatch: 'full' },
            { path: "overview", component: OverviewComponent },
        ],
    }
    , { path: 'create-oder', component: CreateOderComponent },
    
]



@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]

})  

export class PurchaseOrderRoutingModule { }