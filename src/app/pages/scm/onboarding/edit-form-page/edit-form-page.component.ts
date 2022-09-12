import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-edit-form-page',
  templateUrl: './edit-form-page.component.html',
  styleUrls: ['./edit-form-page.component.scss']
})
export class EditFormPageComponent implements OnInit {

  constructor(
    private router : Router
  ) { }

  continue(){
    // this.router.navigateByUrl('/dashboard/onboarding/confirm-details')
    this.router.navigate(['/dashboard/onboarding'])
  }
  ngOnInit(): void {
  }

}
