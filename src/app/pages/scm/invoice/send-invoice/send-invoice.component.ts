import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { CreateAnInvoice } from 'src/app/core/models/scm/invoices.model';
import { ABuyer, requestBodyModel } from 'src/app/core/models/scm/onboarding.model';
import { userData } from 'src/app/core/models/userData.model';
import { InvoiceService } from 'src/app/core/services/scm/invoices/invoice.service';
import { CustomersService } from 'src/app/core/services/scm/onboarding/customers/customers.service';

@Component({
  selector: 'app-send-invoice',
  templateUrl: './send-invoice.component.html',
  styleUrls: ['./send-invoice.component.css']
})
export class SendInvoiceComponent implements OnInit {
  isSuccessModalOpen: Boolean = false;
  userLoad: userData;
  SearchQuery: string = '';
  SortColumn: string = '';
  PageNumber: number = 1;
  PageSize: number = 20;
  modalText: string = " Invooice sent successfully";
  buyers: ABuyer[] = [];
  invoice!: CreateAnInvoice;
  buyerSelected: string = '';
  constructor(
    private router: Router,
    private gVars: GlobalsService,
    private customerService: CustomersService,
    private invoiceService: InvoiceService,
    private location: Location,
  ) { 
    this.invoice = router.getCurrentNavigation().extras.state as CreateAnInvoice;
    console.log(this.invoice);
  } 

  toggleSuccessModal() {
    this.isSuccessModalOpen = !this.isSuccessModalOpen;
    return this.isSuccessModalOpen;
  }
  ngOnInit(): void {
    // const {invoice} = this.activatedRoute.snapshot.
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url);
    this.fetchBuyers();
  }

  fetchBuyers(){
    const req: requestBodyModel = {
      "searchQuery": this.SearchQuery,
      "sortColumn": this.SortColumn,
      "pageNumber": this.PageNumber,
      "pageSize": this.PageSize,
      "session": this.userLoad?.session,
      "username": this.userLoad?.username,
      "subsidiaryId": this.userLoad?.subsidiaryId.toString(),
      "countryId": "01"
    }
    this.customerService.getBuyers(req).subscribe(
      ({data}) =>  this.buyers = data,
      console.error
    )
  }

  cancel(){
    this.location.back();
  }


  shareThisInvoice(){
    this.gVars.spinner.show();
    this.invoiceService.shareInvoice({
      session: this.userLoad?.session,
      username: this.userLoad?.username,
      subsidiaryId: this.userLoad?.subsidiaryId.toString(),
      countryId: 1,
      invoiceNo: this.invoice.invoiceNo,
      invoiceStatus: this.invoice.invoiceStatus
    }).subscribe(
      val => {
        console.log(val),
        this.gVars.spinner.hide();
        const done = this.toggleSuccessModal();
        if(!done)this.location.back();  
      },
      err => console.log(err)
    )
  }


}


// const instanceOfSendInvoice = new SendInvoiceComponent()