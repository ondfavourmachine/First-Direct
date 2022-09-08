import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { PagesModule } from './pages/pages.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      preventDuplicates:true
    }),
    NgxSpinnerModule,
    NgxChartsModule,
    CoreModule,
    PagesModule
  ],
  providers: [{provide: Window, useValue: window }],
  bootstrap: [AppComponent]
})
export class AppModule { }
