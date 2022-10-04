import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-oder',
  templateUrl: './create-oder.component.html',
  styleUrls: ['./create-oder.component.scss']
})
export class CreateOderComponent implements OnInit {

  tabNumber: Number = 0;
  public fom1 : FormGroup;
  public form2 : FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  toggleTab(val: Number) {
    this.tabNumber = val;
  }

 
  goToPreview() {
    this.router.navigate(['/scm/purchase-order/order-preview']);
  }
  ngOnInit(): void {
  }

}
