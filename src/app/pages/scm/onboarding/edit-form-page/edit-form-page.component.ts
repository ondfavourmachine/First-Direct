import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { CustomersService } from 'src/app/core/services/scm/onboarding/customers/customers.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { addCustomer } from 'src/app/core/models/scm/onboarding.model';
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
  country = [];
  categories = [];
  tiers = [];
  Nigeria: string = "Nigeria";
  isLoaded: boolean = false;
  getRole(role: string, id: number){
    // this.crudServices.getRole().subscribe({
    //   next: (data:any) =>{
        this.role = role;
        this.id = id;
    //     // console.log(data)
    //   }
    // })
  }
  constructor(
    private router : Router,
    private crudServices: CrudService,
    private gVars: GlobalsService,
    private customersService: CustomersService,
    private _route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this._route.params.subscribe(params =>this.getRole(params['role'], params['id']) );
  }

  public editCustomerForm: FormGroup;


  continue(){
    // this.router.navigateByUrl('/dashboard/onboarding/confirm-details')
    this.router.navigate(['/dashboard/onboarding']);
  }

  onSubmit() {
    console.log(this.editCustomerForm.value);
    console.log(this.editCustomerForm.value)
    const customerDetails: addCustomer = {
      customerName: this.editCustomerForm.value.customerName,
      industryId: this.editCustomerForm.value.industryId,
      customerCode: this.editCustomerForm.value.customerCode,
      tin: this.editCustomerForm.value.tin,
      rcNumber: this.editCustomerForm.value.rcNumber,
      countryId: this.editCustomerForm.value.countryId,
      email: this.editCustomerForm.value.email,
      mobileNumber: this.editCustomerForm.value.mobileNumber,
      tierId: this.editCustomerForm.value.tierId,
      limits: this.editCustomerForm.value.limits,
      role: this.role,
      companyName: this.editCustomerForm.value.companyName,
      bankName: this.editCustomerForm.value.bankName,
      accountNumber: this.editCustomerForm.value.accountNumber,
      minimumAnnualSpend: this.editCustomerForm.value.minimumAnnualSpend,
      maximumAnnualSpend: this.editCustomerForm.value.maximumAnnualSpend,
      isEdited: true
      // industryName: this.industries.filter(industry => industry.id === this.editCustomerForm.value.industryId)[0]?.name,

    }
    //  validate form
    // if(this.editCustomerForm.hasError('required')){
    //   this.crudServices.updateCustomerDetails(customerDetails);
    //   this.router.navigate(['/scm/confirm-details'])
    // } else {
    //   this.gVars.toastr.error("Please fill all required fields")
    // }

    // check if form is all filled
    if (this.editCustomerForm.valid) {
      this.crudServices.updateCustomerDetails(customerDetails);
      this.router.navigate(['/scm/confirm-details'])
    } else {
      this.gVars.toastr.error("Please fill all required fields")
    }
  }

  getSingleCustomerDetails(){
    this.gVars.spinner.show();
    this.customersService.getCustomerById(this.id).subscribe({
      next: (data:any) =>{
        this.editCustomerDeatails = data.data;
        if(Object.keys(this.editCustomerDeatails).length > 0){
          this.editCustomerForm = this.fb.group({
            customerName: [this.editCustomerDeatails.customerName],
            rcNumber: [this.editCustomerDeatails.rcNumber],
            industryId: [this.editCustomerDeatails.industryId],
            countryId: [this.editCustomerDeatails.countryId],
            currency: ["NGN"],
            rank: ["XYZ"],
            tierId: [this.editCustomerDeatails.tierId],
            companyEmail: [this.editCustomerDeatails.companyEmail],
            mobileNumber: [this.editCustomerDeatails.mobileNumber],
            companyName: [this.editCustomerDeatails.companyName],
            customerCode: [this.editCustomerDeatails.customerCode],
            tin: [this.editCustomerDeatails.tin],
            limits: [this.editCustomerDeatails.limits],
      
          })
      
          if(this.role === 'SUPPLIER'){
            this.editCustomerForm.addControl('bankName', this.fb.control(this.editCustomerDeatails.bankName));
            this.editCustomerForm.addControl('accountNumber', this.fb.control(this.editCustomerDeatails.accountNumber));
            this.editCustomerForm.addControl('minimumAnnualSpend', this.fb.control(this.editCustomerDeatails.minimumAnnualSpend));
            this.editCustomerForm.addControl('maximumAnnualSpend', this.fb.control(this.editCustomerDeatails.maximumAnnualSpend));
          }
        }
        this.gVars.spinner.hide();
        console.log("editCustomerDeatails:",this.editCustomerDeatails)
        
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

  ngAfterViewInit(): void {

    if(this.editCustomerDeatails?.customerName !== ""){
      this.isLoaded = true;
      this.gVars.spinner.hide();
    } else {
      this.isLoaded = false;
      this.gVars.spinner.show();
    }
  }
  ngOnInit(): void {
    this.getSingleCustomerDetails();



    if (this.role === "") {
      this.router.navigate(['/scm'])
    }

    this.getCategories();
    this.getTiers();
    this.getIndustries();

  }


  }

