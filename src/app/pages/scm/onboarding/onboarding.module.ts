import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { OverviewComponent } from './overview/overview.component';
import { PagesComponent } from './pages/pages.component';
import { FormPageComponent } from './form-page/form-page.component';
import { EditFormPageComponent } from './edit-form-page/edit-form-page.component';
import { ConfirmDetailsComponent } from './confirm-details/confirm-details.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
    declarations: [
        LayoutComponent,
        OverviewComponent,
        PagesComponent,
        FormPageComponent,
        EditFormPageComponent,
        ConfirmDetailsComponent,
    ],
    imports: [
        CommonModule,
        OnboardingRoutingModule,
        CoreModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [OnboardingRoutingModule]
})

export class OnboardingModule {}