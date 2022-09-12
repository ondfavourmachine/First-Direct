import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from './layout/layout.component';
import { OverviewComponent } from './overview/overview.component';
import { PagesComponent } from './pages/pages.component';
import {FormPageComponent} from './form-page/form-page.component';
import { EditFormPageComponent } from './edit-form-page/edit-form-page.component';
import { ConfirmDetailsComponent } from './confirm-details/confirm-details.component';
const routes: Routes = [
    {
        path: '', component: LayoutComponent , children: [
            {path:'', redirectTo:'overview', pathMatch: 'full'},
            {path: "overview", component: OverviewComponent},
            {path:'pages', component:PagesComponent},
            
        ],
    },
    {path:'add-new/:role', component: FormPageComponent},
    {path: 'edit-form', component: EditFormPageComponent},
    {path: 'confirm-details', component: ConfirmDetailsComponent}

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class OnboardingRoutingModule {}