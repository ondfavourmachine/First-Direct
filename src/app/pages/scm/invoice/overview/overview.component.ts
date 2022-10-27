import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { CreateAnInvoice } from 'src/app/core/models/scm/invoices.model';
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
isDetailsModalOpen: boolean = false;
userLoad: userData;
searchItem: string = '';
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

  toggleDetailsModal(invoice?: CreateAnInvoice) {
    // debugger;
    if(invoice){
      let newInvoice: CreateAnInvoice = {...invoice, 
        totalPayable : this.invoiceCalc.transform(invoice), 
        subTotal: this.gVars.calculateSubtotal(invoice.invoiceValues)};
      this.currentInvoiceInView = newInvoice;
      this.isDetailsModalOpen = !this.isDetailsModalOpen;
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

   closeDeleteModal(event: boolean){
    if(!event) {
      this.deleteMode = false; 
      return;
    }
    this.deleteMode = false; 
    this.toggleDetailsModal();
    this.getAllInvoices();
   }

}
