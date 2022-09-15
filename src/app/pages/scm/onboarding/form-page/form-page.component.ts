import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { addCustomer } from 'src/app/core/models/scm/onboarding.model';
import { CustomersService } from 'src/app/core/services/scm/onboarding/customers/customers.service';
import { GlobalsService } from 'src/app/core/globals/globals.service';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss']
})
export class FormPageComponent implements OnInit, AfterViewInit {

  role: string;

  public getRole() {
    this.crudServices.getRole().subscribe({
      next: (data: any) => {
        this.role = data;
        // console.log(data)
      }
    })
  }


  constructor(
    private crudServices: CrudService,
    private router: Router,
    private _route: ActivatedRoute,
    private fb: FormBuilder,
    private customersService: CustomersService,
    private gVars: GlobalsService
  ) {
    this._route.params.subscribe(params => this.role = params['role']);
    this.getRole();

  }

  public addCustomerForm: FormGroup;
  industries = [];
  country = [];
  categories = [];
  tiers = [];
  Nigeria: string = "Nigeria";
  customerDetails$:any = [];

  public getIndustries() {
    this.customersService.getCustomerIndustries().subscribe({
      next: (data: any) => {
        this.industries = data;
        // console.log("industries:",this.industries)
      }
    })
  }

  // public getCountry(){
  //   this.customersService..subscribe({
  //     next: (data:any) =>{
  //       this.country = data;
  //       console.log("country:",this.country)
  //     }
  //   })
  // }

  public getCategories() {
    this.customersService.getCustomerCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
        // console.log("categories:",this.categories)
      }
    })
  }

  public getTiers() {
    this.customersService.getCustomerTiers().subscribe({
      next: (data: any) => {
        this.tiers = data;
        // console.log("tiers:",this.tiers)
      }
    })
  }

  filterIndustries(industryId: string) {
    return this.industries.filter(industry => industry.id === industryId);
  }

  onSubmit() {
    console.log(this.addCustomerForm.value)
    const customerDetails: addCustomer = {
      customerName: this.addCustomerForm.value.customerName,
      industryId: this.addCustomerForm.value.industryId,
      customerCode: this.addCustomerForm.value.customerCode,
      tin: this.addCustomerForm.value.tin,
      rcNumber: this.addCustomerForm.value.rcNumber,
      countryId: this.addCustomerForm.value.countryId,
      email: this.addCustomerForm.value.email,
      mobileNumber: this.addCustomerForm.value.mobileNumber,
      tierId: this.addCustomerForm.value.tierId,
      limits: this.addCustomerForm.value.limits,
      role: this.role,
      companyName: this.addCustomerForm.value.companyName,
      bankName: this.addCustomerForm.value.bankName,
      accountNumber: this.addCustomerForm.value.accountNumber,
      minimumAnnualSpend: this.addCustomerForm.value.minimumAnnualSpend,
      maximumAnnualSpend: this.addCustomerForm.value.maximumAnnualSpend,
      // industryName: this.industries.filter(industry => industry.id === this.addCustomerForm.value.industryId)[0]?.name,

    }
    //  validate form
    // if(this.addCustomerForm.hasError('required')){
    //   this.crudServices.updateCustomerDetails(customerDetails);
    //   this.router.navigate(['/scm/confirm-details'])
    // } else {
    //   this.gVars.toastr.error("Please fill all required fields")
    // }

    // check if form is all filled
    if (this.addCustomerForm.valid) {
      this.crudServices.updateCustomerDetails(customerDetails);
      this.router.navigate(['/scm/confirm-details'])
    } else {
      this.gVars.toastr.error("Please fill all required fields")
    }

  }

  // afterViewInit
  ngAfterViewInit() {
    this.getRole();
    if (this.role === "") {
      this.router.navigate(['/scm'])
    }
  }

  resetForm() {
    this.crudServices.updateCustomerDetails(null);
    this.router.navigate(['/scm'])
  }

  public getCustomerDetails$() {
    this.crudServices.getCustomerDetails().subscribe({
      next: (data: any) => {
        this.customerDetails$ = data;
        console.log("customerDetails:", this.customerDetails$)
      }
    })
  }

  ngOnInit(): void {

    this.getCustomerDetails$()

    this.addCustomerForm = this.fb.group({
      // setValue of customerName from customerDetails$ array
      customerName: [this.customerDetails$?.customerName, Validators.required],
      industryId: [this.customerDetails$?.industryId, Validators.required],
      customerCode: [this.customerDetails$?.customerCode, Validators.required],
      tin: [this.customerDetails$?.tin, Validators.required],
      rcNumber: [this.customerDetails$?.rcNumber, Validators.required],
      countryId: [this.customerDetails$?.countryId, Validators.required],
      email: [this.customerDetails$?.email, Validators.required],
      mobileNumber: [this.customerDetails$?.mobileNumber, Validators.required],
      tierId: [this.customerDetails$?.tierId, Validators.required],
      limits: [this.customerDetails$?.limits, Validators.required],
      companyName: [this.customerDetails$?.companyName, Validators.required],
    })

    // if role is supplier add bank account to form
    if (this.role === "supplier") {
      this.addCustomerForm.addControl('bankName', this.fb.control(this.customerDetails$?.bankName, Validators.required));
      this.addCustomerForm.addControl('accountNumber', this.fb.control(this.customerDetails$?.accountNumber, Validators.required));
      this.addCustomerForm.addControl('minimumAnnualSpend', this.fb.control(this.customerDetails$?.minimumAnnualSpend, Validators.required));
      this.addCustomerForm.addControl('maximumAnnualSpend', this.fb.control(this.customerDetails$?.maximumAnnualSpend, Validators.required));
    }

    this.getIndustries();
    this.getCategories();
    this.getTiers();
  }

}
