import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthRoutes } from './auth.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { LoginComponent } from './login/login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { UsernameResetComponent } from './username-reset/username-reset.component';
import { SecretComponent } from './secret/secret.component';
import { AdsComponent } from './ads/ads.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { OnboardingModalComponent } from './onboarding/onboarding-modal/onboarding-modal.component';

@NgModule({
  declarations: [LoginComponent, PasswordResetComponent, UsernameResetComponent, SecretComponent, AdsComponent, OnboardingComponent, OnboardingModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule,
    RouterModule.forChild(AuthRoutes)
  ]
})
export class AuthModule { }
