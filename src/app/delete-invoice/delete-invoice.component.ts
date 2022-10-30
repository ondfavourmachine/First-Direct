import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { GlobalsService } from '../core/globals/globals.service';
import { CreateAnInvoice } from '../core/models/scm/invoices.model';
import { userData } from '../core/models/userData.model';

import { InvoiceService } from '../core/services/scm/invoices/invoice.service';

@Component({
  selector: 'app-delete-invoice',
  templateUrl: './delete-invoice.component.html',
  styleUrls: ['./delete-invoice.component.css']
})
export class DeleteInvoiceComponent implements OnInit {
  @Output() closeDelete = new EventEmitter<boolean>();
  @Output() closeAccept = new EventEmitter<boolean>();
  @Input() invoice: CreateAnInvoice;
  @Input() isAccepting: boolean = false;
  @Input() isRejecting: boolean = false;
  type: 'password' | 'text' = 'text';
  password = '';
  userLoad: userData;
  constructor(
    private gVars: GlobalsService,
    private invoiceService: InvoiceService
  ) { }

  ngOnInit(): void {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url);
  }


  close(){
    this.closeDelete.emit(false);
  }

  closeAcceptBtn(){
    this.closeAccept.emit(false);
  }

  deleteInvoice(event: Event){
    this.gVars.spinner.show();
    this.invoiceService.deleteInvoice({
      subsidiaryId: this.userLoad.subsidiaryId,
      username: this.userLoad.username,
      session: this.userLoad.session,
      invoiceNo: this.invoice.invoiceNo,
    }).subscribe(
       {
        next: ({code, message}) => {
          if(code != '00'){
            this.gVars.spinner.hide();
             this.closeDelete.emit(false);
             this.gVars.toastr.error(message)
            return;
          }
          this.gVars.spinner.hide();
          this.closeDelete.emit(true);
        },
        error:()=>{
          this.gVars.spinner.hide();
             this.closeDelete.emit(false);
             this.gVars.toastr.error('An error occurred, kindly contact admin')
        }
       }
    )
  }

  acceptInvoice(event:Event){
    this.gVars.spinner.show();
    this.invoiceService.acceptInvoice({
      subsidiaryId: this.userLoad.subsidiaryId,
      username: this.userLoad.username,
      session: this.userLoad.session,
      invoiceNo: this.invoice.invoiceNo,
    }).subscribe(
       {
        next: ({code, message}) => {
          if(code != '00'){
            this.gVars.spinner.hide();
             this.closeAccept.emit(false);
             this.gVars.toastr.error(message)
            return;
          }
          this.gVars.spinner.hide();
          this.closeAccept.emit(true);
        },
        error:()=>{
          this.gVars.spinner.hide();
             this.closeAccept.emit(false);
             this.gVars.toastr.error('An error occurred, kindly contact admin')
        }
       }
    )
  }
}
