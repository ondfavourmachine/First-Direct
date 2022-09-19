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
  existingCustomers: [] = [];
  keyWord: string = 'Approved';
  btnText = 'Continue';
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
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url);
  }


  getBankCode() {
    // if(!this.addCustomerForm?.value?.bankName && this.addCustomerForm?.value?.bankName !== undefined){
    this.bankCode = this.banks.find(bank => bank.bankName === this.addCustomerForm?.value?.bankName);


    // }
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
    this.customersService.getAllDefCustomers().subscribe({
      next: (data: any) => {
        //  filter all approved status customers
        this.existingCustomers = data?.data?.filter((customer: any) => customer.status === this.keyWord);
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
    if (this.addCustomerForm.valid && this.validatedBankDetails?.valid === true && this.bankCode.bankName && checker.accountName !== "") {
      this.crudServices.updateCustomerDetails(checker);
      this.router.navigate(['/scm/confirm-details'])
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
      mobileNumber: this.addCustomerForm.value.mobileNumber,
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
    if (this.bankCode.bankName && this.validatedBankDetails?.accountName !== undefined && this.validatedBankDetails?.accountName !== null) {
    }
    if (this.role === "buyer") {
      if (this.addCustomerForm.valid) {
        this.crudServices.updateCustomerDetails(customerDetails);
        this.router.navigate(['/scm/confirm-details'])

      } else {
        this.gVars.toastr.error("Please fill all required fields")

      }
    } else {
      if (this.accountName === "") {
        this.btnText = "Validating Bank Details..."
      }else {
        this.btnText = "Processing..."
      }
      setTimeout(() => {
        if (this.validatedBankDetails?.valid === true && this.bankCode.bankName) {
          // console.log("customerDetails:", customerDetails)
          this.btnText = "Continue"
          this.saveCustomerDetails(customerDetails);
          // this.crudServices.updateCustomerDetails(customerDetails);
          // this.router.navigate(['/scm/confirm-details'])

        } else {
          this.gVars.toastr.error("Please fill all required fields")

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
    this.getBanks();
    this.getExisitingCustomers();
    // console.log("addCustomerForm:", this.addCustomerForm)
  }



}
