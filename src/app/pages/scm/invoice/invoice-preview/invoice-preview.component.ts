import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {NavigationExtras, Router} from '@angular/router';
import { CreateAnInvoice } from 'src/app/core/models/scm/invoices.model';
import { InvoiceService } from 'src/app/core/services/scm/invoices/invoice.service';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { userData } from 'src/app/core/models/userData.model';
@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.scss']
})
export class InvoicePreviewComponent implements OnInit {
  isSuccessModalOpen: Boolean = false;
  modalText: string = " Invooice created successfully"
  dataFromInvoiceCreation!: CreateAnInvoice;
  userLoad: userData;
  displayModifiedTotal: string = '';
  constructor(
    private router: Router,
    private location: Location,
    private gVars: GlobalsService,
    private invoiceService: InvoiceService,
  ) {
    this.dataFromInvoiceCreation = this.router.getCurrentNavigation().extras.state as CreateAnInvoice;
    this.goBack = this.goBack.bind(this);
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url);
   } 

   ngOnInit(): void {
    console.log(this.dataFromInvoiceCreation);
    this.displayModifiedTotal = formatter.format(this.dataFromInvoiceCreation.totalPayable);
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
    this.goToOverview();
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

const object: any = {
  notation: 'standard',
  minimumFractionDigits: 2,
  maximumFractionDigits: 20,
  minimumSignificantDigits: 1,
  maximumSignificantDigits: 20
}

export const formatter = new Intl.NumberFormat('en-US', object);

export const forceToTwoDecimalPlaces = (val: number): string =>{
  const formatted = formatter.format((val));
  if(formatted.includes(".")){
    const number = val.toString().split(".")[0]+ "." + formatted.split(".")[1].slice(0, 2)
    return number;
  }
  return formatted;
}
