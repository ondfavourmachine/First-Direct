import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit {
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
    this.router.navigate(['/scm/invoice/invoice-preview']);
  }
    ngOnInit(): void {
  }

}
