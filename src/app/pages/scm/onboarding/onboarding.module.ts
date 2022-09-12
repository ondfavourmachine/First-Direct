import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OnboardingRoutingModule } from './onboarding-routing.module';
// import { HeaderComponent } from 'src/app/shared/components/onboarding/header/header.component';
import { LayoutComponent } from './layout/layout.component';
// import { ButtonsComponent } from 'src/app/shared/components/onboarding/buttons/buttons.component';
// import { CardComponent } from 'src/app/shared/components/onboarding/card/card.component';
// import { TableComponent } from 'src/app/shared/components/table/table.component';
import { OverviewComponent } from './overview/overview.component';
import { PagesComponent } from './pages/pages.component';
// import { CenteredModalWrapperComponent } from 'src/app/shared/components/centered-modal-wrapper/centered-modal-wrapper.component';
import { FormPageComponent } from './form-page/form-page.component';
// import { DetailsModalWrapperComponent } from 'src/app/shared/components/details-modal-wrapper/details-modal-wrapper.component';
import { EditFormPageComponent } from './edit-form-page/edit-form-page.component';
import { ConfirmDetailsComponent } from './confirm-details/confirm-details.component';
import { SharedModule } from '../shared/shared.module';
// import { HeaderComponent } from 'src/app/core/header/header.component';
import { CoreModule } from 'src/app/core/core.module';
@NgModule({
    declarations: [
        // HeaderComponent,
        LayoutComponent,
        // ButtonsComponent,
        // CardComponent,
        // TableComponent,
        OverviewComponent,
        PagesComponent,
        // CenteredModalWrapperComponent,
        FormPageComponent,
        // DetailsModalWrapperComponent,
        EditFormPageComponent,
        ConfirmDetailsComponent
    ],
    imports: [
        CommonModule,
        OnboardingRoutingModule,
        // FontAwesomeModule,
        CoreModule,
        SharedModule
        // BrowserModule
    ],
    exports: [OnboardingRoutingModule]
})

export class OnboardingModule {}