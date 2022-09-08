import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/globals/auth.guard';
import { RoleGuard } from 'src/app/core/Guards/role.guard';
import { AdsComponent } from './ads/ads.component';
import { LoginComponent } from './login/login.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { SecretComponent } from './secret/secret.component';
import { UsernameResetComponent } from './username-reset/username-reset.component';


export const AuthRoutes:Routes = [
    { path:'' , redirectTo:'login',  pathMatch:'full' },
    { path:'login', component:LoginComponent},
    { path:'reset-username', component:UsernameResetComponent},
    { path:'reset-password', component:PasswordResetComponent},
    { path:'reset-password/:mode', component:PasswordResetComponent},
    { path:'secret-questions/:user', canActivate:[AuthGuard],  component:SecretComponent},
    { path:'ads', canActivate:[AuthGuard], component: AdsComponent },
    { path:'onboarding', component: OnboardingComponent }
    
]