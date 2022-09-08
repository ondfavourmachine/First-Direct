import { Routes } from '@angular/router';
import { ApproveComponent } from './approve/approve.component';
import { ReportsComponent } from './reports/reports.component';
import { ServicesComponent } from './services/services.component';

export const ServiceRoutes:Routes = [
    { path:'', redirectTo:'create-instruction', pathMatch:'full'},
    { path:'create-instruction', component:ServicesComponent },
    { path:'view-report', component:ReportsComponent },
    { path:'approve-request', component:ApproveComponent },
]