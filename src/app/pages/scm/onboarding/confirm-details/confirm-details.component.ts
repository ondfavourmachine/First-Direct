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
  getRole(role: string){
    // this.crudServices.getRole().subscribe({
    //   next: (data:any) =>{
        this.role = role;
    //     // console.log(data)
    //   }
    // })
  }

  toggleSuccessModal() {
    this.crudServices.updateCustomerDetails(null);
    this.crudServices.updateEditor(null);
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
    }
    this.gVars.spinner.show();


    if (this.isEdited === "edited" ) {

      let editPayload: editCustomer = {
        id: Number(this.customerDetails?.id),
        customerName: this.customerDetails?.customerName,
        categoryId: 0,
        categoryName: "string",
        companyName: this.customerDetails?.companyName,
        customerType: "string",
        customerCode: this.customerDetails?.customerCode,
        subsidiaryCode: "string",
        industryId: this.customerDetails?.industryId,
        industryName: "string",
        email: this.customerDetails?.email,
        address1: "string",
        address2: "string",
        city: "string",
        tierName: "string",
        isActive: false,
        dateAdded: this.customerDetails?.dateAdded,
        createdBy: "string",
        bankCode: "string",
        swiftCode: "string",
        status: "string",
        rcNumber: this.customerDetails?.rcNumber,
        tin: this.customerDetails?.tin,
        phoneNumber: this.customerDetails?.phoneNumber,
        countryId: "01",
        country: this.customerDetails?.countryId,
        currencyCode: "NGN",
        tierId: this.customerDetails?.tierId,
        limits: this.customerDetails?.limits,
        maximumAnnualSpend: this.customerDetails?.maximumAnnualSpend,
        minimumAnnualSpend: this.customerDetails?.minimumAnnualSpend,
        bankName: this.customerDetails?.bankName,
        accountNumber: this.customerDetails?.accountNumber,
        accountName: this.customerDetails?.customerName,

      }

      this.customersService.updateCustomer(this.customerDetails).subscribe({
        next: (data: any) => {
          // console.log(data);
          this.gVars.toastr.success("Customer edited successfully");
          // if(data.message === "Successful"){
          this.router.navigateByUrl(`/scm`)
          this.crudServices.updateCustomerDetails(null);
          this.crudServices.updateEditor(null);
          this.gVars.spinner.hide();
          // }
        }, error: (err: any) => {
          // console.log(err);
          this.gVars.spinner.hide();
          this.gVars.toastr.error("Error editing customer", "Error");
          this.crudServices.updateCustomerDetails(null);
          this.crudServices.updateEditor(null);
          this.router.navigateByUrl(`/scm`)
        }
      })
    } else {
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

        console.log("payload:", payload)

        this.customersService.addSupplier(payload).subscribe({
          next: (data: any) => {
            this.isSuccessModalOpen = !this.isSuccessModalOpen;
            // console.log(data)
            // if(data.message === "Successful"){
            this.gVars.spinner.hide();
            this.crudServices.updateCustomerDetails(null);
            this.crudServices.updateEditor(null);
            // this.router.navigateByUrl(`/scm`)
            // }
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
            // if(data.message === "Successful"){
            this.gVars.spinner.hide();
            // this.router.navigateByUrl(`/scm`)
            this.crudServices.updateCustomerDetails(null);
            this.crudServices.updateEditor(null);
            // }
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



  }


  onCompanyNameChange($event){
    console.log($event)
  }

  constructor(
    private crudServices: CrudService,
    private router: Router,
    private _route: ActivatedRoute,
    private customersService: CustomersService,
    private gVars: GlobalsService
  ) {
    this._route.params.subscribe(params =>this.getRole(params['role']) );
  }

  public getCustomerDetails() {
    this.crudServices.getCustomerDetails().subscribe({
      next: (data: any) => {
        this.customerDetails = data;
        // console.log("customerDetails:", this.customerDetails)
      }
    })
  }

  goBackToForm() {
    this.router.navigateByUrl(`/scm/add-new/${this.customerDetails?.role}`)
    this.crudServices.updateCustomerDetails(this.customerDetails);
  }

  getEditor(){
    this.crudServices.getEditor().subscribe({
      next: (data: any) => {
        this.isEdited = data;
        // console.log("editorContent:", this.isEdited)
      }
    })
  }

  ngOnInit(): void {
    this.getCustomerDetails();
    this.getEditor();
    console.log("customerDetails:", this.customerDetails)
    if (this.customerDetails == null) {
      this.router.navigateByUrl(`/scm`)
    }

  }

}
