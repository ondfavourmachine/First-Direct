import { Routes } from '@angular/router';
import { AuthGuard } from './core/globals/auth.guard';
import { AdsComponent } from './pages/auth/ads/ads.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RoleGuard } from './core/Guards/role.guard';


export const AppRoutes:Routes = [
    
    { path:'' , redirectTo:'dashboard', pathMatch:'full' },
    { path:'login' , redirectTo:'auth', pathMatch:'full' },
    {
      path: 'auth',
      canActivate:[RoleGuard],
      loadChildren:()=> import('./pages/auth/auth.module').then(m=>m.AuthModule)
    },
    { path:'ads',canActivate:[AuthGuard], component:AdsComponent },
    { path:'dashboard', canActivate:[AuthGuard], component:DashboardComponent},
 
    { path: 'account-management',
      canActivate:[AuthGuard],
      loadChildren:()=> import('./pages/account-management/account-management.module').then(m=>m.AccountManagementModule)
    },
    { path: 'scm',
      canActivate:[AuthGuard],
      loadChildren:()=> import('./pages/scm/onboarding/onboarding.module').then(m=>m.OnboardingModule)
    },
    {
      path:'settings',
      canActivate:[AuthGuard],
      loadChildren:()=> import('./pages/settings/settings.module').then(m=>m.SettingsModule)
    },
    {
      path: 'transfer-services',
      canActivate:[AuthGuard],
      loadChildren:()=> import('./pages/transfer/transfer.module').then(m=>m.TransferModule)
    },
    {
      path: 'reports',
      canActivate:[AuthGuard],
      loadChildren:()=> import('./pages/reporting/reports.module').then(m=>m.ReportsModule)
    },
    {
      path: 'services',
      canActivate:[AuthGuard],
      loadChildren:()=> import('./pages/service-request/service-request.module').then(m=>m.ServiceChargeModule)
    },
    {
      path: 'foreign-payments',
      canActivate:[AuthGuard],
      loadChildren:()=> import('./pages/foreign-payments/foreign-payments.module').then(m=>m.ForeignPaymentsModule)
    },
    
    //create routes above this. 404 page coming soon
    { path: '**', redirectTo: 'auth' }
]
