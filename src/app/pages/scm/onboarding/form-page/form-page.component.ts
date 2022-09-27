import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { addCustomer, validateBankDetailsModel } from 'src/app/core/models/scm/onboarding.model';
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


  public addCustomerForm: FormGroup;
  industries = [];
  country = [];
  categories = [];
  tiers = [];
  banks = [];
  Nigeria: string = "Nigeria";
  customerDetails$: any = [];
  userLoad: any;
  bankCode: any;
  accountName: string = "";
  validatedBankDetails: any = [];
  existingCustomers: any = [];
  keyWord: string = 'Approved';
  btnText = 'Continue';
  isOnSubmit: boolean = false;
  companyCode: any  = [];
  constructor(
    private crudServices: CrudService,
    private router: Router,
    private _route: ActivatedRoute,
    private fb: FormBuilder,
    private customersService: CustomersService,
    private gVars: GlobalsService
  ) {
    this._route.params.subscribe(params => this.role = params['role'].toLocaleLowerCase());
    this.getRole();
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url);
  }


  getBankCode() {
    // if(!this.addCustomerForm?.value?.bankName && this.addCustomerForm?.value?.bankName !== undefined){
    this.bankCode = this.banks.find(bank => bank.bankName === this.addCustomerForm?.value?.bankName);


    // }
  }

filterCompanyCode(companyName: string){
    // filter out company code that is equal to the company name rom existing customers
    this.companyCode = this.existingCustomers.filter(customer => customer.companyName === companyName);
    // update the company code in the form
    this.addCustomerForm.patchValue({
      customerCode: this.companyCode[0]?.customerCode
    });
    // console.log("companyCode:", this.companyCode[0]?.customerCode)
    // console.log("companyCode:", this.addCustomerForm?.value?.customerCode)
    // console.log("companyCode:", this.companyCode)
}


  validateBankDeyails(code: any) {
    const payload: validateBankDetailsModel = {
      destinationBankCode: code?.bankCode,
      destinationAccount: this.addCustomerForm?.value?.accountNumber,
      session: this.userLoad?.session,
    }
    // console.log("payload:", payload)
    this.customersService.verifyBankDetails(payload).subscribe({
      next: (data: any) => {
        this.validatedBankDetails = data;
        this.accountName = this.validatedBankDetails?.accountName
        // console.log("data:", data)
        // this.btnText = 'Continue';
        this.gVars.toastr.success("Bank details validated successfully");
      }, error: (error: any) => {
        // this.btnText = 'Continue';
        this.gVars.toastr.error(error?.error?.message);
      }
    })

  }

  public getIndustries() {
    this.customersService.getCustomerIndustries().subscribe({
      next: (data: any) => {
        this.industries = data;
        // console.log("industries:",this.industries)
      }
    })
  }

  getBanks() {
    this.customersService.getAllBanks().subscribe({
      next: (data: any) => {
        this.banks = data;

        // console.log("banks:",this.banks)
      }

    })
  }



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

  getExisitingCustomers() {
    this.customersService.getPrincipalBuyers().subscribe({
      next: (data: any) => {
        this.gVars.spinner.hide();
        this.existingCustomers = data?.data;

        // console.log("existingCustomers:",this.existingCustomers.customerCode)
      }
    })
  }

  bankVerification() {
    if (this.addCustomerForm?.value?.bankName && this.addCustomerForm?.value?.accountNumber) {
      this.getBankCode();
      this.validateBankDeyails(this.bankCode);
    }
  }

  saveCustomerDetails(checker: any) {
    // console.log("checker:", checker)
    if (checker.accountName !== "") {
      this.crudServices.updateCustomerDetails(checker);
      // console.log("checker:", checker)
      this.router.navigateByUrl(`scm/onboarding/confirm-details/supplier`);
    }
  }
  onSubmit() {

    const customerDetails: addCustomer = {
      customerName: this.addCustomerForm.value.customerName,
      industryId: this.addCustomerForm.value.industryId,
      customerCode: this.addCustomerForm.value.customerCode,
      tin: this.addCustomerForm.value.tin,
      rcNumber: this.addCustomerForm.value.rcNumber,
      countryId: this.addCustomerForm.value.countryId,
      email: this.addCustomerForm.value.email,
      phoneNumber: this.addCustomerForm.value.phoneNumber,
      tierId: this.addCustomerForm.value.tierId,
      limits: this.addCustomerForm.value.limits,
      role: this.role,
      companyName: this.addCustomerForm.value.companyName,
      bankName: this.bankCode?.bankName,
      accountNumber: this.addCustomerForm.value.accountNumber,
      minimumAnnualSpend: this.addCustomerForm.value.minimumAnnualSpend,
      maximumAnnualSpend: this.addCustomerForm.value.maximumAnnualSpend,
      isEdited: false,
      accountName: this.accountName,
      // industryName: this.industries.filter(industry => industry.id === this.addCustomerForm.value.industryId)[0]?.name,

    }
    

    if (this.role !== "buyer") {
      this.bankVerification();
    }
    if (this.role === "buyer") {
      if (this.addCustomerForm.valid) {
        this.crudServices.updateCustomerDetails(customerDetails);
        this.router.navigate([`scm/onboarding/confirm-details/${this.role}`])

      } else {
        this.gVars.toastr.error("Please fill all required fields")
        this.isOnSubmit = true;
      }
    } else {
      if (this.accountName === "" && this.addCustomerForm.valid) {
        this.btnText = "Validating Bank Details..."
      } else {
        this.btnText = "Processing..."
      }
      setTimeout(() => {
        if (this.validatedBankDetails?.valid === true && this.bankCode?.bankName) {
          // console.log("customerDetails:", customerDetails)
          this.btnText = "Continue"
          this.saveCustomerDetails(customerDetails);
          // this.crudServices.updateCustomerDetails(customerDetails);
          // this.router.navigate(['/scm/confirm-details'])

        } else {
          this.gVars.toastr.error("Please fill all required fields")
          this.btnText = "Continue"

        }
      }, 3000)
    }
    // }
    // check if form is all filled
    // console.log('usserLoad:', this.userLoad)

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
        // console.log("customerDetails:", this.customerDetails$)
      }
    })
  }
  onSortChange(e) {
    // console.log("e:", e.target.value)
    this.filterCompanyCode(e.target.value)
    if(e.target.value === ""){
      this.addCustomerForm.patchValue({
        customerCode: ""
      })
    }
 }

 stateLoader(){
  if (this.existingCustomers.length < 1){
    this.gVars.spinner.show();
  }
}
  ngOnInit(): void {

    this.stateLoader();
    this.getCustomerDetails$()

    this.addCustomerForm = this.fb.group({
      // setValue of customerName from customerDetails$ array
      customerName: [this.customerDetails$?.customerName, Validators.required],
      industryId: [this.customerDetails$?.industryId, Validators.required],
      customerCode: [this.customerDetails$?.customerCode],
      tin: [this.customerDetails$?.tin, Validators.required],
      rcNumber: [this.customerDetails$?.rcNumber, Validators.required],
      countryId: [this.customerDetails$?.countryId, Validators.required],
      email: [this.customerDetails$?.email, Validators.required],
      phoneNumber: [this.customerDetails$?.phoneNumber, Validators.required],
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
    if(this.role !== "buyer"){
      this.getBanks();
    }
    this.getExisitingCustomers();
    // console.log("addCustomerForm:", this.addCustomerForm)
  }



}
