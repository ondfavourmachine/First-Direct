import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/globals/auth.guard';
import { RoleGuard } from 'src/app/core/Guards/role.guard';

const routes: Routes = [
    {
        path: "", redirectTo: "onboarding", pathMatch: "full"
    },
    {
        path: "onboarding",
        loadChildren: () => import('./onboarding/onboarding.module').then(m => m.OnboardingModule),
        canActivate: [AuthGuard]
    },
    {
        path: "invoice",
        loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule),
        canActivate: [AuthGuard]
    },
    {
        path: "purchase-order",
        loadChildren: () => import('./purchaseOder/purchaseOder.module').then(m => m.PurchaseOrderModule),
        canActivate: [AuthGuard]
    },


];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ScmRoutingModule { }


        
