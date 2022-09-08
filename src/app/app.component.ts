import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FirstDirect 2.0';
  routeName:any;
  showHeader:boolean = true;
  constructor(private router:Router)
  {
   this.routeName = window.location.pathname;
   if(this.routeName.includes('login') || this.routeName.includes('onboarding'))
   {
     this.showHeader = false;
   }
  }


}
