import { Component, OnInit } from '@angular/core';
import { addCustomer, editCustomer } from 'src/app/core/models/scm/onboarding.model';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomersService } from 'src/app/core/services/scm/onboarding/customers/customers.service';
import { GlobalsService } from 'src/app/core/globals/globals.service';
@Component({
  selector: 'app-confirm-details',
  templateUrl: './confirm-details.component.html',
  styleUrls: ['./confirm-details.component.scss']
})
export class ConfirmDetailsComponent implements OnInit {
  customerDetails: any;
  today = new Date();
  isSuccessModalOpen: Boolean = false;
  role: string;
  isEdited: string = "";
  dateCreated: string = "Dater Created";
  industryName: string = "";
  tierName: string = "";
  modalText: string = " New Customer created successfully"
  tiers = [];
  industries = [];
  userLoad: any;
  getRole(role: string) {
    this.role = role;
  }

  constructor(
    private crudServices: CrudService,
    private router: Router,
    private _route: ActivatedRoute,
    private customersService: CustomersService,
    private gVars: GlobalsService
  ) {
    this._route.params.subscribe(params => this.getRole(params['role']));
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url);
  }

  public getCustomerDetails() {
    this.crudServices.getCustomerDetails().subscribe({
      next: (data: any) => {
        this.customerDetails = data;
        // console.log("customerDetails:", this.customerDetails?.industryId)
      }
    })
  }

  goBackToForm() {
    if (this.isEdited == "edited") {
      this.router.navigateByUrl(`scm/onboarding/edit-form/${this.role}/${this.customerDetails?.id}`)
      this.crudServices.updateCustomerDetails(this.customerDetails);
      this.crudServices.updateEditor("returnedEdited");
    } else {
      this.router.navigateByUrl(`/scm/onboarding/add-new/${this.role}`)
    }
    this.crudServices.updateCustomerDetails(this.customerDetails);
  }

  getEditor() {
    this.crudServices.getEditor().subscribe({
      next: (data: any) => {
        this.isEdited = data;
        // console.log("editorContent:", this.isEdited)
      }
    })
  }

  toggleSuccessModal() {
    this.crudServices.updateCustomerDetails(null);
    this.crudServices.updateEditor(null);
    this.router.navigateByUrl(`/scm`)
  }

  editCustomer() {
    this.customersService.updateCustomer(this.customerDetails).subscribe({
      next: (data: any) => {
        // console.log(data);
        this.gVars.toastr.success("Customer edited successfully");
        this.router.navigateByUrl(`/scm`)
        this.crudServices.updateCustomerDetails(null);
        this.crudServices.updateEditor(null);
        this.gVars.spinner.hide();
      }, error: (err: any) => {
        // console.log(err);
        this.gVars.spinner.hide();
        this.gVars.toastr.error("Error editing customer", "Error");
        this.crudServices.updateCustomerDetails(null);
        this.crudServices.updateEditor(null);
        this.router.navigateByUrl(`/scm`)
      }
    })
  }

  addContactPerson(payload: any) {
    if (this.customerDetails?.role === "supplier") {
      // spreed items to payload
      payload = {
        ...payload,
        "maximumAnnualSpend": this.customerDetails?.maximumAnnualSpend,
        "minimumAnnualSpend": this.customerDetails?.minimumAnnualSpend,
        "bankName": this.customerDetails?.bankName,
        "accountNumber": this.customerDetails?.accountNumber,
        // "accountName": this.customerDetails?.customerName,
      }

      // console.log("payload:", payload)

      this.customersService.addSupplier(payload).subscribe({
        next: (data: any) => {
          this.isSuccessModalOpen = !this.isSuccessModalOpen;
          // console.log(data)
          this.gVars.spinner.hide();
          this.crudServices.updateCustomerDetails(null);
          this.crudServices.updateEditor(null);
          // this.router.navigateByUrl(`/scm`)
        }, error: (err: any) => {
          this.gVars.spinner.hide();
          // console.log(err)
          this.gVars.toastr.error("Error adding supplier", "Error")
          this.crudServices.updateCustomerDetails(null);
          this.crudServices.updateEditor(null);
          this.router.navigateByUrl(`/scm`)
        }
      })
    } else {
      this.customersService.addBuyer(payload).subscribe({
        next: (data: any) => {
          // console.log(data);
          this.isSuccessModalOpen = !this.isSuccessModalOpen;
          this.gVars.spinner.hide();
          // this.router.navigateByUrl(`/scm`)
          this.crudServices.updateCustomerDetails(null);
          this.crudServices.updateEditor(null);
        }, error: (err: any) => {
          // console.log(err);
          this.gVars.spinner.hide();
          this.gVars.toastr.error("Error adding buyer", "Error");
          this.crudServices.updateCustomerDetails(null);
          this.crudServices.updateEditor(null);
          this.router.navigateByUrl(`/scm`)
        }
      })
    }
  }

  addCustomer() {

    let payload: any = {
      "customerName": this.customerDetails?.customerName,
      "companyName": this.customerDetails?.companyName,
      "industryId": this.customerDetails?.industryId,
      "customerCode": this.customerDetails?.customerCode,
      "rcNumber": this.customerDetails?.rcNumber,
      "tin": this.customerDetails?.tin,
      "email": this.customerDetails?.email,
      "mobileNumber": this.customerDetails?.phoneNumber,
      "countryId": "01",
      "country": this.customerDetails?.countryId,
      "currencyCode": "NGN",
      "tierId": this.customerDetails?.tierId,
      "limits": this.customerDetails?.limits,
      "id": Number(this.customerDetails?.id),
      "maximumAnnualSpend": this.customerDetails?.maximumAnnualSpend,
      "minimumAnnualSpend": this.customerDetails?.minimumAnnualSpend,
      "bankName": this.customerDetails?.bankName,
      "accountNumber": this.customerDetails?.accountNumber,
      "accountName": this.customerDetails?.accountName,
      "session": this.userLoad?.session,
      "username": this.userLoad?.username,
      "subsidiaryId": this.userLoad?.subsidiaryId.toString(),
    }

    this.gVars.spinner.show();

    if (this.isEdited === "edited") {
      this.editCustomer();
    } else {
      this.addContactPerson(payload);
    }

  }

  public getIndustries() {
    this.customersService.getCustomerIndustries().subscribe({
      next: (data: any) => {
        this.industries = data;
        // console.log("industries:",this.industries)
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

  convertTierIdToName(id: any) {
    this.tiers.forEach((tier: any) => {
      if (tier.id === id) {
        this.tierName = tier.name;
      }
    })
  }

  convertIndustryIdToName(id: any) {
    this.industries.forEach((industry: any) => {
      // console.log("industry:", industry.id)
      if (industry.id === id) {
        this.gVars.spinner.hide();
        // console.log("industry:", industry)
        this.industryName = industry.name;
      }
    })
    // console.log("industryName:", this.industryName)
  }

  ngOnInit(): void {
    this.getCustomerDetails();
    this.getEditor();
    this.getIndustries();
    this.getTiers();
    this.gVars.spinner.show();
    setTimeout(() => {
      this.convertIndustryIdToName(this.customerDetails?.industryId);
      this.convertTierIdToName(this.customerDetails?.tierId); 
    }, 3000);

    // console.log("customerDetails:", this.customerDetails)
    if (this.customerDetails == null) {
      this.router.navigateByUrl(`/scm`)
    }
    if (this.isEdited == "edited") {
      this.dateCreated = "Date Updated"
      this.modalText = "Customer edited successfully"
    }
  }

}
