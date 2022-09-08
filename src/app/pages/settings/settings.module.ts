import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertPreferencesComponent } from './alert-preferences/alert-preferences.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { SubsidiaryManagementComponent } from './subsidiary-management/subsidiary-management.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { CoreModule } from 'src/app/core/core.module';
import { SettingsRoutes } from './settings.route';
import { AccountSettingsComponent } from './account-settings/account-settings.component';



@NgModule({
  declarations: [AlertPreferencesComponent,UserManagementComponent,SubsidiaryManagementComponent,ChangePasswordComponent, AccountSettingsComponent],
  imports: [
    CommonModule,
    CoreModule,
    NgxPaginationModule,
    RouterModule.forChild(SettingsRoutes),
    ReactiveFormsModule,
    FormsModule,
    Ng2SearchPipeModule
  ]
})
export class SettingsModule { }
