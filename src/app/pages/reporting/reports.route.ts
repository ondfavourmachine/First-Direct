import { Routes } from "@angular/router"
import { AccountReportsComponent } from "./account-reports/account-reports.component"
import { AllReportsComponent } from "./all-reports/all-reports.component"
import { ReversalReportsComponent } from "./reversal-reports/reversal-reports.component"
import { NeftReportsComponent } from "./transaction-reports/neft-reports/neft-reports.component"
import { RtgsReportsComponent } from "./transaction-reports/rtgs-reports/rtgs-reports.component"
import { UploadReportsComponent } from "./upload-reports/upload-reports.component"

export const ReportRoutes:Routes = [

    { path:'', redirectTo:'account-reports', pathMatch:'full'},
    { path:'neft-reports', component:NeftReportsComponent },
    { path:'rtgs-reports', component:RtgsReportsComponent },
    { path:'account-reports', component:AccountReportsComponent }, 
    { path:'upload-reports', component:UploadReportsComponent }, 
    { path:'all-transactions', component:AllReportsComponent },
    { path:'reversal-reports', component:ReversalReportsComponent },              
]