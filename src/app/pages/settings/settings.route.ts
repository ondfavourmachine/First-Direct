import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/globals/auth.guard';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AlertPreferencesComponent } from './alert-preferences/alert-preferences.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SubsidiaryManagementComponent } from './subsidiary-management/subsidiary-management.component';
import { UserManagementComponent } from './user-management/user-management.component';

export const SettingsRoutes:Routes = [
    { path:'alert-preferences', component:AlertPreferencesComponent },
    { path:'user-management', component:UserManagementComponent },
    { path:'subsidiary-management', component:SubsidiaryManagementComponent },
    { path:'change-password', component:ChangePasswordComponent },
    { path:'accounts-settings', component:AccountSettingsComponent },
]