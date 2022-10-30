import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { ASubsidiaryInvoicesSnapshot, Attachment, CreateAnInvoice } from 'src/app/core/models/scm/invoices.model';
import { userData } from 'src/app/core/models/userData.model';
import { InvoiceService } from 'src/app/core/services/scm/invoices/invoice.service';
import { CustomersService } from 'src/app/core/services/scm/onboarding/customers/customers.service';
import { InvoiceCalculationPipe } from 'src/app/pages/scm/invoice/pipes/invoice-calculation.pipe';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
invoices: CreateAnInvoice[] = [];
upaidInvoices: number = 0;
deleteMode: boolean = false;
acceptMode: boolean = false
isDetailsModalOpen: boolean = false;
userLoad: userData;
searchItem: string = '';
invoiceSummaries: ASubsidiaryInvoicesSnapshot[] = [];
currentInvoiceInView: CreateAnInvoice;
  constructor(
    private customersService: CustomersService,
    private invoiceService: InvoiceService,
    private invoiceCalc: InvoiceCalculationPipe,
  private  gVars: GlobalsService,
  private router: Router

  ) { }


  navigate( tab: number) {
    this.router.navigate(['scm/invoice/pages']);
  }

  getInvoiceSummaries(){
    this.invoiceService.getInvoiceSummary({
        username: this.userLoad.username,
        session: this.userLoad.session,
        subsidiaryId: this.userLoad.subsidiaryId})
      .subscribe(
        val => {
          this.invoiceSummaries = val.data;
        },
        console.error
      )
  }

  toggleDetailsModal(invoice?: CreateAnInvoice) {
    // debugger;
    if(invoice){
      let newInvoice: CreateAnInvoice = {...invoice, 
        totalPayable : this.invoiceCalc.transform(invoice), 
        subTotal: this.gVars.calculateSubtotal(invoice.invoiceValues)};
      this.currentInvoiceInView = newInvoice;
      this.isDetailsModalOpen = !this.isDetailsModalOpen;
      console.log(this.currentInvoiceInView);
      return;
    }
    this.isDetailsModalOpen = !this.isDetailsModalOpen;
  }

  tableHeaders = [
  {
    name: "Date"
  },
  {
    name: "Invoice No"
  },
  {
    name: "buyer"
  },
  {
    name: "Supplier"
  },
  {
    name: "Amount"
  },
  {
    name: "Status"
  },
]

  ngOnInit(): void {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url);
    this.getAllInvoices();
    this.getInvoiceSummaries();
  }

  async downloadAsPDf(invoiceAttachments: Attachment[]){
    for(let attachment of invoiceAttachments){
      await this.downloadFile({docName: attachment.invoiceFileName, base64String: attachment.documentBase64, extension: undefined}, false);
    }
  }

  async dataUrlToFile(dataUrl: string, fileName: string, mimeType: string): Promise<File>{
    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    return new File([blob], fileName, {type: mimeType})
  }

  async downloadFile(doc: {docName: string,base64String: string, extension: string}, openInNewTab?: boolean){
    const anchor = document.createElement('a');
    const file: File = await this.dataUrlToFile(`${doc.base64String}`, doc.docName, doc.extension ? doc.extension : `application/pdf`);
    let fileURL = window.URL.createObjectURL(file);
    if(openInNewTab){
      anchor.href = fileURL;
      anchor.target = 'blank';
      anchor.click();
      return;
    }

    anchor.href = fileURL;
    anchor.download = doc.docName;
    anchor.click();
  }


  gotoSendInvoice(){
    const extraObj: NavigationExtras = {
      state: this.currentInvoiceInView
    }
    this.router.navigateByUrl('scm/invoice/send-invoice', extraObj);
  }

   getAllInvoices(){
    this.gVars.spinner.show();
    this.invoiceService.getAllSubsidiaryInvoice({
      subsidiaryId: this.userLoad.subsidiaryId,
      session: this.userLoad.session,
      username: this.userLoad.username,
      pageNumber: 1,
      pageSize: 10,
      sortColumn: '',
      filter: '',
      searchQuery: '',
      countryId: '01'
    })
    .subscribe(
      {
        next: ({data})=> {
          this.invoices = data;
          this.upaidInvoices = this.invoices.length;
          this.gVars.spinner.hide();
        },
        error: console.error
      }
    )
   }


   deletePayment(){
    // console.log(this.currentInvoiceInView);
    this.deleteMode = true;
   }
   acceptPayment(){
    // console.log(this.currentInvoiceInView);
    this.acceptMode = true;
   }

   closeDeleteModal(event: boolean){
    if(!event) {
      this.deleteMode = false; 
      return;
    }
    this.deleteMode = false; 
    this.toggleDetailsModal();
    this.getAllInvoices();
   }

   closeAcceptModal(event: boolean){
    if(!event) {
      this.acceptMode = false; 
      return;
    }
    this.acceptMode = false; 
    this.toggleDetailsModal();
    this.getAllInvoices();
   }

}
