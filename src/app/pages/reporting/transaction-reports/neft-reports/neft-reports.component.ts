import { Component, Input, OnInit } from '@angular/core';

import { ExcelService } from 'src/app/core/services/excel.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReportsService } from 'src/app/core/services/reports.service';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-neft-reports',
  templateUrl: './neft-reports.component.html',
  styleUrls: ['./neft-reports.component.css']
})
export class NeftReportsComponent implements OnInit {

  p:any;
  term:any;
  @Input() NEFT;
  FilterForm: FormGroup;
  payload: { session: any; username: string; subsidiaryId: any; startDate: string; endDate: string; batchid: string; drAccountNo: string; crAccountNo: string; uploader: string; transactionStatus: string; };
  userLoad: { session: any; username: string; subsidiaryId: any; };
  constructor(
    private excel:ExcelService,
    private fb: FormBuilder,
    private gVars:GlobalsService,
    private reportService: ReportsService
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
    let mytoday = new Date();
    let firstDay = new Date(mytoday.getFullYear(), mytoday.getMonth(), 3);
    let startDate = firstDay.toISOString().slice(0,10);
    let endDate =  mytoday.toISOString().slice(0,10); 
    this.payload = {
      ...this.userLoad,
      startDate:startDate,
      endDate:endDate,
      batchid: "string",
      drAccountNo: "string",
      crAccountNo: "string",
      uploader: "string",
      transactionStatus: "string"
    }
   }

  ngOnInit(): void {
    this.FilterForm = this.fb.group({
      ...this.userLoad,
      startDate:['',Validators.required],
      endDate: ['', Validators.required],
      batchid: "string",
      drAccountNo: "string",
      crAccountNo: "string",
      uploader: "string",
      transactionStatus: "string"
    })
    this.fetchNEFTReports(this.payload)
  }

  fetchNEFTReports(data){
    this.gVars.spinner.show()
    let newBody = this.gVars.EncryptData(JSON.stringify(data))
    this.reportService.getNEFTReports({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.NEFT = decryptedData.Reports
        }
        else{
          this.gVars.spinner.hide()
        }
      }
    )
  }

  export()
  {
    this.gVars.checkData(this.NEFT)
    const exportFile = this.NEFT.map((res) => {
      return {
        "Payment Date": res.PaymentDate,
        "Transaction Date":res.TransactionDate,
        "Reference No.": res.ReferenceNo,
        "Organisation": res.Organisation,
        "Initiator":res.Initiator,
        "Debit Account Number": res.DrAccountNo,
        "Credit Account Number":res.CrAccountNo,
        "Credit Account Name":res.CrAccountName,
        "Amount": res.Amount,
        "Charges": res.Charges,
        "Batch ID": res.BatchID,
        "Narration":res.Narration,
        "Transaction Status": res.TransactionStatus,
      };
    });
    this.excel.exportTableElmToExcel(
      exportFile,
      "NEFT-Report-" +
        new Date().toJSON().slice(0, 10).split("-").reverse().join("/")
    );
  }
  convert() {
    this.gVars.checkData(this.NEFT)
    var doc = new jsPDF('l', 'pt', 'a4');
    doc.setFontSize(10);
    const head = [['Payment Date', 'Reference No.', 'Organisation','Initiator', 'Source Account No.', 
     'Beneficiary Account Number', 'Beneficiary Account Name', 'Amount','Charges','Batch ID','Narration','Transaction Date','Transaction Status'] ];
    const body = this.NEFT.map((res, index) => {
      return [res.PaymentDate, res.ReferenceNo, res.Organisation,res.Initiator, res.DrAccountNo,
        res.CrAccountNo, res.CrAccountName, res.Amount, res.Charges,res.BatchID, res.Narration, res.TransactionDate, res.TransactionStatus ]
    });
    autoTable(doc, { head: head,
      body: body,
      styles: {
        fontSize: 5,
        font: "helvetica"
      }
    });
    doc.save("NEFT-Report -" + new Date().toJSON().slice(0, 10).split("-").reverse().join("/") + ".pdf");
  }


  FilterReports(data)
  {
    this.gVars.spinner.show()
    let body = {
      ...data,
      startDate: this.gVars.convertDate(data.startDate),
      endDate: this.gVars.convertDate(data.endDate)
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.reportService.getNEFTReports({encryptedData:newBody}).subscribe(
      res=>{
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        this.gVars.spinner.hide()
        if(decryptedData.Success)
        {
          this.NEFT = decryptedData.Reports
        }else{
          this.gVars.toastr.error(decryptedData.ResponseMessage, 'Taking you home...')
          this.gVars.goHome()
        }
      },
      err=>{
        this.gVars.spinner.hide();
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        this.gVars.takeOut()
      }
    )
  }

}
