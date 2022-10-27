import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {NavigationExtras, Router} from '@angular/router';
import { CreateAnInvoice } from 'src/app/core/models/scm/invoices.model';
import { InvoiceService } from 'src/app/core/services/scm/invoices/invoice.service';
import { GlobalsService } from 'src/app/core/globals/globals.service';
@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.scss']
})
export class InvoicePreviewComponent implements OnInit {
  isSuccessModalOpen: Boolean = false;
  modalText: string = " Invooice created successfully"
  dataFromInvoiceCreation!: CreateAnInvoice;
  constructor(
    private router: Router,
    private location: Location,
    private gVars: GlobalsService,
    private invoiceService: InvoiceService,
  ) {
    this.dataFromInvoiceCreation = this.router.getCurrentNavigation().extras.state as CreateAnInvoice;
    this.goBack = this.goBack.bind(this);
   } 

   ngOnInit(): void {
    
  }
  sendInvoice() {
    delete this.dataFromInvoiceCreation.subTotal;
    delete this.dataFromInvoiceCreation.totalPayable;
    delete this.dataFromInvoiceCreation.calculatedDiscount;
    delete this.dataFromInvoiceCreation.calculatedTax;
    this.gVars.spinner.show();
    this.invoiceService.createInvoice(this.dataFromInvoiceCreation)
    .subscribe(
      val => {
        if(val.code == '00'){
          this.gVars.spinner.hide();
          this.isSuccessModalOpen = !this.isSuccessModalOpen;
          return;
        }
        this.gVars.spinner.hide();
        this.gVars.toastr.error('An error occured. Please try again');
      },
      err =>{
        this.gVars.spinner.hide();
        this.gVars.toastr.error('An error occured. Please try again');
      }
    ) 
  }

  toggleSuccessModal(){
    this.isSuccessModalOpen = !this.isSuccessModalOpen;
    setTimeout(this.goBack, 500);
  }

  triggerEdit(){   
    const data: NavigationExtras = {
      state: this.dataFromInvoiceCreation
    }
    this.router.navigate(['/scm/invoice/create-invoice'], data);
  }

  goToOverview(){
    this.router.navigate(['/scm/invoice/overview']);
  }

  goBack(){
    this.location.back();
  }



  

}
