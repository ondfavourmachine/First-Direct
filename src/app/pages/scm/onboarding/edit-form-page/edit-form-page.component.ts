import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { CustomersService } from 'src/app/core/services/scm/onboarding/customers/customers.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { addCustomer, editCustomer, userRoleModel, validateBankDetailsModel } from 'src/app/core/models/scm/onboarding.model';
@Component({
  selector: 'app-edit-form-page',
  templateUrl: './edit-form-page.component.html',
  styleUrls: ['./edit-form-page.component.scss']
})
export class EditFormPageComponent implements OnInit, AfterViewInit {

  role: string;
  id: number;
  editCustomerDeatails: any = [];
  industries = [];
  countries = [
    { id: "01", name: 'Nigeria' },
  ];
  banks = [];
  categories = [];
  tiers = [];
  Nigeria: string = "Nigeria";
  isLoaded: boolean = false;
  bankCode: any;
  userLoad: any;
  accountName: string = "";
  validatedBankDetails: any = [];
  btnText: string = "Save";
  returnedData: any = [];
  isEdited: string = "";
  isAccountDetailsChanged: boolean = false;
  getRole(role: string, id: number) {
    // this.crudServices.getRole().subscribe({
    //   next: (data:any) =>{
    this.role = role;
    this.id = id;
    //     // console.log(data)
    //   }
    // })
  }

  loader() {
    if (this.editCustomerDeatails?.customerName === undefined && this.editCustomerDeatails?.customerName === null && this.editCustomerDeatails?.customerName === '') {
      this.isLoaded = false;
      this.gVars.spinner.show();
    } else {
      this.isLoaded = true;
      this.gVars.spinner.hide();
    }
  }
  constructor(
    private router: Router,
    private crudServices: CrudService,
    private gVars: GlobalsService,
    private customersService: CustomersService,
    private _route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this._route.params.subscribe(params => this.getRole(params['role'], params['id']));
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url);
  }

  public editCustomerForm: FormGroup;


  continue() {
    // this.router.navigateByUrl('/dashboard/onboarding/confirm-details')
    this.router.navigate(['/dashboard/onboarding']);
  }

  getBankCode() {
    // if(!this.addCustomerForm?.value?.bankName && this.addCustomerForm?.value?.bankName !== undefined){
    this.bankCode = this.banks.find(bank => bank.bankName === this.editCustomerForm?.value?.bankName);


    // }
  }

  getBanks() {
    this.customersService.getAllBanks().subscribe({
      next: (data: any) => {
        this.banks = data;

        // console.log("banks:",this.banks)
      }

    })
  }

  getBankBranches(e) {
    //  console.log("val", e.target.value)
    this.isAccountDetailsChanged = true;
  }

  onAccountNumberChange(e) {
    //  console.log("val", e.target.value)
    this.isAccountDetailsChanged = true;
  }

  checkIfAccountDetailsChanged() {
    if (this.isAccountDetailsChanged) {
      this.bankVerification();
      this.btnText = "Validating Bank Details..."
    } else {
      this.bankVerification();
    }
  }

  validateBankDeyails(code: any) {

    this.btnText = "Validating Bank Details..."
    const payload: validateBankDetailsModel = {
      destinationBankCode: code?.bankCode,
      destinationAccount: this.editCustomerForm?.value?.accountNumber,
      session: this.userLoad?.session,
    }
    // console.log("payload:", payload)
    this.customersService.verifyBankDetails(payload).subscribe({
      next: (data: any) => {
        this.validatedBankDetails = data;
        this.accountName = this.validatedBankDetails?.accountName
        // console.log("data:", data)
        // this.btnText = 'Continue';
        if (this.validatedBankDetails?.valid === false) {
          this.gVars.toastr.error("Incorrect Account Details")
          this.btnText = 'Save';
        } else {
          this.gVars.toastr.success("Bank details validated successfully");
          this.btnText = 'Preview';
        }
      }, error: (error: any) => {
        // this.btnText = 'Continue';
        this.gVars.toastr.error(error?.error?.message);
      }
    })

  }

  bankVerification() {
    this.isAccountDetailsChanged = false;
    if (this.editCustomerForm?.value?.bankName && this.editCustomerForm?.value?.accountNumber) {
      this.getBankCode();
      this.validateBankDeyails(this.bankCode);
    }
  }

  onSubmit() {
    // console.log(this.editCustomerForm.value);
    // console.log(this.editCustomerForm.value)

    const userRole: userRoleModel = {
      "session": this.userLoad?.session,
      "username": this.userLoad?.username,
      "subsidiaryId": this.userLoad?.subsidiaryId.toString(),
    }
    const acctPayLoad: any = {
      accountName: this.accountName
    }

    // if editCustomerForm is touched spread the values to the editCustomerdetails object
    if (this.editCustomerForm.touched) {
      this.editCustomerDeatails = {
        ...this.editCustomerDeatails,
        ...this.editCustomerForm.value,
        ...acctPayLoad,
        ...userRole
      }
    }
    // console.log("new",this.editCustomerDeatails)
    // check if form is all filled
    if (this.role !== 'SUPPLIER') {
      if (this.editCustomerForm.valid) {
        this.crudServices.updateCustomerDetails(this.editCustomerDeatails);
        this.crudServices.updateEditor("edited");
        this.router.navigate([`scm/onboarding/confirm-details/${this.role}`])
      } else {
        this.gVars.toastr.error("Please fill all required fields")
      }
    } else {
      this.bankVerification();
      if (this.editCustomerForm.valid && this.accountName !== "" && this.validatedBankDetails?.valid === true && this.isAccountDetailsChanged === false) {
        this.btnText = "Continue"
        this.crudServices.updateCustomerDetails(this.editCustomerDeatails);
        this.crudServices.updateEditor("edited");
        this.router.navigate([`scm/onboarding/confirm-details/${this.role}`])
      } else {
        // this.gVars.toastr.error("Please fill all required fields")
        // this.btnText = "Continue"
      }
    }
  }

  getEditor() {
    this.crudServices.getEditor().subscribe({
      next: (data: any) => {
        this.isEdited = data;
        // console.log("editorContent:", this.isEdited)
      }
    })
  }

  getSingleCustomerDetails() {
    this.gVars.spinner.show();
    this.customersService.getCustomerById(this.id).subscribe({
      next: (data: any) => {
        if (this.isEdited === "returnedEdited") {
          this.editCustomerDeatails = this.returnedData;
        } else {
          this.editCustomerDeatails = data.data;
        }
        if (Object.keys(this.editCustomerDeatails).length > 0) {
          this.editCustomerForm = this.fb.group({
            customerName: [this.editCustomerDeatails.customerName],
            rcNumber: [this.editCustomerDeatails.rcNumber],
            industryId: [this.editCustomerDeatails.industryId],
            countryId: [this.editCustomerDeatails.countryId],
            currency: [this.editCustomerDeatails.currencyCode],
            rank: ["XYZ"],
            tierId: [this.editCustomerDeatails.tierId],
            email: [this.editCustomerDeatails.email],
            phoneNumber: [this.editCustomerDeatails.phoneNumber],
            companyName: [this.editCustomerDeatails.companyName],
            customerCode: [this.editCustomerDeatails.customerCode],
            tin: [this.editCustomerDeatails.tin],
            limits: [this.editCustomerDeatails.limits],
            bankName: [this.editCustomerDeatails.bankName],
            accountNumber: [this.editCustomerDeatails.accountNumber],
            minimumAnnualSpend: [this.editCustomerDeatails.minimumAnnualSpend],
            maximumAnnualSpend: [this.editCustomerDeatails.maximumAnnualSpend],
          })
        }
        this.loader();
        // console.log("editCustomerDeatails:",this.editCustomerDeatails)

      }
    })
  }

  getReturnCustomerDetails() {
    this.crudServices.getCustomerDetails().subscribe({
      next: (data: any) => {
        this.returnedData = data;
        // console.log("returnedData:",this.returnedData)
      }
    })
  }

  resetForm() {
    this.crudServices.updateCustomerDetails(null);
    this.router.navigate(['/scm'])
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


  public getIndustries() {
    this.customersService.getCustomerIndustries().subscribe({
      next: (data: any) => {
        this.industries = data;
        // console.log("industries:",this.industries)
      }
    })
  }


  ngAfterViewInit(): void { }


  ngOnInit(): void {
    this.getSingleCustomerDetails();

    if (this.role === "") {
      this.router.navigate(['/scm'])
    }

    this.getCategories();
    this.getTiers();
    this.getIndustries();
    this.getBanks();
    this.getEditor();
    this.getReturnCustomerDetails();

  }


}

