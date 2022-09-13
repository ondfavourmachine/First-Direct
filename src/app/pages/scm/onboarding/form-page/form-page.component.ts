import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { addCustomer } from 'src/app/core/models/scm/onboarding.model';
@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss']
})
export class FormPageComponent implements OnInit {

  role: string = "";
  constructor(
    private crudServices: CrudService,
   private router : Router,
   private _route : ActivatedRoute,
    private fb: FormBuilder
  ) {
    this._route.params.subscribe(params => this.role = params['role']);
   }

   public addCustomerForm : FormGroup;

  

  public getRole(){
    this.crudServices.getRole().subscribe({
      next: (data:any) =>{
        this.role = data;
        console.log(data)
      }
    })
  }
  
  onSubmit(){
    console.log(this.addCustomerForm.value)
    const customerDetails: addCustomer = {
      customerName: this.addCustomerForm.value.customerName,
      industryId: this.addCustomerForm.value.industyId,
      companyNumber: this.addCustomerForm.value.companyNumber,
      customerCode: this.addCustomerForm.value.customerCode,
      tin: this.addCustomerForm.value.tin,
      rcNumber: this.addCustomerForm.value.rcNumber,
      countryId: this.addCustomerForm.value.countryId,
      email: this.addCustomerForm.value.email,
      mobileNumber: this.addCustomerForm.value.mobileNumber,
      tierId: this.addCustomerForm.value.tierId,
      limits: this.addCustomerForm.value.limits,
      role: this.role
    }
    this.crudServices.updateCustomerDetails(customerDetails);
    this.router.navigate(['/scm/confirm-details'])
  }
  ngOnInit(): void {

    this.addCustomerForm = this.fb.group({
      customerName: ['', Validators.required],
      industryId: ['', Validators.required],
      companyNumber: ['', Validators.required],
      customerCode: ['', Validators.required],
      tin: ['', Validators.required],
      rcNumber: ['', Validators.required],
      countryId: ['', Validators.required],
      email: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      tierId: ['', Validators.required],
      limits: ['', Validators.required],
    })

  }

}
