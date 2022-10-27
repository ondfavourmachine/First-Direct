import {  Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavigationExtras, Router } from '@angular/router';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { CreateAnInvoice, InvoiceValue } from 'src/app/core/models/scm/invoices.model';
import { ABuyer, requestBodyModel } from 'src/app/core/models/scm/onboarding.model';
import { CustomersService } from 'src/app/core/services/scm/onboarding/customers/customers.service';
@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit {
  @ViewChild('primaryInvoiceDetails') primaryInvoiceDetails: NgForm;
  calculatedTax: string = '0';
  calculatedDiscount: string = '0';
  subTotal: number = 0;
  total: string = '0';
  tabNumber: number = 1;
  SearchQuery: string = '';
  SortColumn: string = '';
  PageNumber: number = 1;
  PageSize: number = 20;
   createAnInvoiceForm: Partial<CreateAnInvoice> = {};
   dataFromPreviewComp!: CreateAnInvoice;
   userLoad: Record<string, any>
   buyers: ABuyer[] = [];
  constructor(
    private router: Router,
    private customerService: CustomersService,
    private gVar: GlobalsService,
  ) {
    this.dataFromPreviewComp = this.router.getCurrentNavigation().extras.state as CreateAnInvoice;
    this.userLoad = this.gVar.checkRoute(this.gVar.router.url);
    
   }

  ngOnInit(): void {
  this.createAnInvoiceForm = {
  session: '',
  username: '',
  subsidiaryId: '',
  countryId: '',
  invoiceNo: '',
  invoiceDate: '',
  purchaseOrderNo: '',
  buyer: '',
  supplyDate: '',
  paymentDueDate: '',
  invoiceSummary: '',
  acceptedOffline: 'no',
  paymentTerms: '',
  additionalInformation: '',
  hasAttachment: '',
  tax: 0,
  discount: 0,
  miscellaneous: 0,
  createdBy: '',
  invoiceValues: [
    {
      item: '',
      invoiceNo: '',
      unitPrice: 0,
      quantity: 1,
      amount: 0
    }
  ]
}

    this.fetchBuyers();
    console.log(this.dataFromPreviewComp);
    if(this.dataFromPreviewComp &&  'invoiceNo' in this.dataFromPreviewComp) {
      this.createAnInvoiceForm = {...this.dataFromPreviewComp};
      this.calculatedTax = this.createAnInvoiceForm.calculatedTax;
      this.calculatedDiscount = this.createAnInvoiceForm.calculatedDiscount;
      this.subTotal = this.createAnInvoiceForm.subTotal;
      this.total = this.createAnInvoiceForm.totalPayable;
       this.createAnInvoiceForm.hasAttachment = this.dataFromPreviewComp.hasAttachment == 'N' ? 'no' : 'yes';
       this.createAnInvoiceForm.acceptedOffline = this.dataFromPreviewComp.acceptedOffline == 'N' ? 'no' : 'yes';
    };
}
 
  removeAnInvoice(index: number){
    this.createAnInvoiceForm.invoiceValues.splice(index, 1);
  }

  toggleTab(val: number) {
    this.tabNumber = val;
  }

  goToPreview() {
    this.createAnInvoiceForm.invoiceValues = this.createAnInvoiceForm.invoiceValues.filter(elem => elem.quantity != 0);
    this.createAnInvoiceForm.subTotal = this.subTotal;
    this.createAnInvoiceForm.totalPayable = this.total;
    this.createAnInvoiceForm.calculatedDiscount = this.calculatedDiscount;
    this.createAnInvoiceForm.calculatedTax = this.calculatedTax;
    this.createAnInvoiceForm.username = this.userLoad.username;
    this.createAnInvoiceForm.subsidiaryId = this.userLoad?.subsidiaryId.toString();
    this.createAnInvoiceForm.session = this.userLoad?.session;
    this.createAnInvoiceForm.hasAttachment = 'N';
    this.createAnInvoiceForm.acceptedOffline = 'Y';
    const data: NavigationExtras = {
      state: this.createAnInvoiceForm
    }
    this.router.navigate(['/scm/invoice/invoice-preview'], data);
  }

  goToNextPage(){
    if(this.tabNumber == 3){
      this.goToPreview();
      return; 
    }
    this.tabNumber++;
    // console.log(this.primaryInvoiceDetails);
    // console.log(this.createAnInvoiceForm);
  }

  goBack(){
    if(this.tabNumber == 0){
      this.router.navigate(['/scm/invoice/overview']);
      return;
    }
    this.tabNumber--;
  }

  goToOverview(){
    this.router.navigate(['/scm/invoice/overview']);
  }

  goToPreviousPage(){
    this.tabNumber--;
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

  addNewInvoiceValue(){
    this.calculateSubTotal();
    this.calculateTotal();
    this.createAnInvoiceForm.invoiceValues.push({
      item: '',
      invoiceNo: '',
      unitPrice: 0,
      quantity: 0,
      amount: 0
    });
    console.log(this.createAnInvoiceForm.invoiceValues);
  }

  calculateSubTotal(){
     this.subTotal = this.createAnInvoiceForm.invoiceValues
     .reduce((prev: number, curr:InvoiceValue) => prev + curr.amount,0);
  }
  convertValuesToNumbers(value: string){
    return parseInt(value.replace(/,/g, ''));
  }
  calculateTotal(){
    this.calculateSubTotal();
    this.calculatedDiscount = this.calculateDiscount(this.subTotal).toFixed(2);
    this.calculatedTax = this.calculateTax(this.subTotal).toFixed(2);
    this.total = (this.subTotal - this.convertValuesToNumbers(this.calculatedDiscount) + this.convertValuesToNumbers(this.calculatedTax) + this.createAnInvoiceForm.miscellaneous).toFixed(2);

  }

  calculateDiscount(subTotal: number): number {
    return this.createAnInvoiceForm.discount == 0 ? 0 : ((this.subTotal * this.createAnInvoiceForm.discount) / 100)
  }

  calculateTax(subTotal: number): number {
    return this.createAnInvoiceForm.tax == 0 ? 0 : ((subTotal * this.createAnInvoiceForm.tax) / 100);
  }
  calculateAmount(invoice: InvoiceValue){
    invoice.amount = invoice.unitPrice * invoice.quantity;
  }
  
}
