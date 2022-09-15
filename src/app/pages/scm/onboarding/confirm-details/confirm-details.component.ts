import { Component, OnInit } from '@angular/core';
import { addCustomer } from 'src/app/core/models/scm/onboarding.model';
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
  customerDetails: addCustomer;
  today = new Date();
  isSuccessModalOpen: Boolean = false;

  toggleSuccessModal() {
    this.router.navigateByUrl(`/scm`)
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
      "mobileNumber": this.customerDetails?.mobileNumber,
      "countryId": "01",
      "country": this.customerDetails?.countryId,
      "currencyCode": "01",
      "tierId": this.customerDetails?.tierId,
      "limits": this.customerDetails?.limits,
    }
    this.gVars.spinner.show();

    if (this.customerDetails?.role === "supplier") {
      // spreed items to payload
      payload = {
        ...payload,
        "maximumAnnualSpend": this.customerDetails?.maximumAnnualSpend,
        "minimumAnnualSpend": this.customerDetails?.minimumAnnualSpend,
        "bankName": this.customerDetails?.bankName,
        "accountNumber": this.customerDetails?.accountNumber,
        "accountName": this.customerDetails?.customerName,
      }
      
      this.customersService.addSupplier(payload).subscribe({
        next: (data: any) => {
          this.isSuccessModalOpen = !this.isSuccessModalOpen;
          console.log(data)
          // if(data.message === "Successful"){
            this.gVars.spinner.hide();
          // }
        }, error: (err: any) => {
          console.log(err)
          this.gVars.toastr.error("Error adding supplier", "Error")
        }
      })
    } else {
      this.customersService.addBuyer(payload).subscribe({
        next: (data: any) => {
          console.log(data);
          this.isSuccessModalOpen = !this.isSuccessModalOpen;
          // if(data.message === "Successful"){
          this.gVars.spinner.hide();
          // }
        }, error: (err: any) => {
          console.log(err);
          this.gVars.toastr.error("Error adding buyer", "Error");
        }
      })

    }

    // console.log("payload:", payload)
  }

  constructor(
    private crudServices: CrudService,
    private router: Router,
    private _route: ActivatedRoute,
    private customersService: CustomersService,
    private gVars: GlobalsService
  ) { }

  public getCustomerDetails() {
    this.crudServices.getCustomerDetails().subscribe({
      next: (data: any) => {
        this.customerDetails = data;
        console.log("customerDetails:", this.customerDetails)
      }
    })
  }

  goBackToForm() {
    this.router.navigateByUrl(`/scm/add-new/${this.customerDetails?.role}`)
    this.crudServices.updateCustomerDetails(this.customerDetails);
  }
  ngOnInit(): void {
    this.getCustomerDetails();
    if (this.customerDetails == null) {
      this.router.navigateByUrl(`/scm`)
    }
  }

}
