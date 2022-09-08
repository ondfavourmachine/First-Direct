import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/globals/auth.guard';
import { ApproveForeignComponent } from './approve-foreign/approve-foreign.component';
import { ForeignReportsComponent } from './foreign-reports/foreign-reports.component';
import { InitiateComponent } from './initiate/initiate.component';
import { SettlementInstructionComponent } from './settlement-instruction/settlement-instruction.component';

export const ForeignRoutes:Routes = [
    {path: '',redirectTo:'initiate', pathMatch:'full'},
    { path:'initiate', canActivate:[AuthGuard], component:InitiateComponent },
    { path:'approve', canActivate: [AuthGuard], component:ApproveForeignComponent},
    { path: 'foreign-reports', canActivate:[AuthGuard], component:ForeignReportsComponent},
    { path: 'settlement-instructions', component:SettlementInstructionComponent}
]