import { Component, OnInit } from '@angular/core';

import { ExcelService } from 'src/app/core/services/excel.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ReportsService } from 'src/app/core/services/reports.service';

declare var $:any;
@Component({
  selector: 'app-all-reports',
  templateUrl: './all-reports.component.html',
  styleUrls: ['./all-reports.component.css']
})
export class AllReportsComponent implements OnInit {
  FilterForm: FormGroup;
  p:any;
  term:any;
  payload: { session: any; username: string; subsidiaryId: any; paymentDateFrom: string; paymentDateTo: string; organisation: string; uploader: string; transactionType: string; transactionStatus: string; batchid: string; drAccountNo: string; crAccountNo: string; };
  AllReports: any;
  approvalHistory: any;
  userLoad: { session: any; username: string; subsidiaryId: any; };
  constructor(
    private excel: ExcelService,
    private fb: FormBuilder,
    private gVars:GlobalsService,
    private reportService: ReportsService
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
    let mytoday = new Date();
    let firstDay = new Date(mytoday.getFullYear(), mytoday.getMonth(), 1);
    let startDate = firstDay.toISOString().slice(0,10);
    let endDate =  mytoday.toISOString().slice(0,10); 
    this.payload = {
      ...this.userLoad,
      paymentDateFrom:startDate,
      paymentDateTo:endDate,
      organisation: "string",
      uploader: "string",
      transactionType: "string",
      transactionStatus: "string",
      batchid: "string",
      drAccountNo: "string",
      crAccountNo: "string"
    }
    
   }

  ngOnInit(): void {
    this.FilterForm = this.fb.group({
      ...this.userLoad,
      paymentDateFrom:['',Validators.required],
      paymentDateTo: ['', Validators.required],
      organisation: "string",
      uploader: "string",
      transactionType: "string",
      transactionStatus: "string",
      batchid: "string",
      drAccountNo: "string",
      crAccountNo: "string"
    })
    this.fetchReports(this.payload)
  }

  fetchReports(data)
  {
    this.gVars.spinner.show()
    let newBody = this.gVars.EncryptData(JSON.stringify(data))
    this.reportService.getTransReports({encryptedData:newBody}).subscribe(
      res=>{
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        this.gVars.spinner.hide()
         if(decryptedData.Success)
        {
          this.AllReports = decryptedData.Reports
        }else{
          this.gVars.toastr.show(decryptedData.ResponseMessage)
          this.gVars.spinner.hide()
        }
      },
      err=>{
        this.gVars.spinner.hide()
        this.gVars.toastr.error('Unable to complete that')
        this.gVars.takeOut()
      }
    )
  }
  filterReports(data)
  {
    let body = {
      ...data,
      paymentDateFrom: this.gVars.convertDate(data.paymentDateFrom),
      paymentDateTo: this.gVars.convertDate(data.paymentDateTo)
    }
    this.fetchReports(body)
  }

  export()
  {
   if(this.gVars.checkData(this.AllReports)) 
   {
     return
   }
    const exportFile = this.AllReports.map((res) => {
      return {
        "Payment Date": res.PaymentDate,
        "Upload Date": res.DateUpload,
        "Reference No.": res.ReferenceNo,
        "Subsidiary": res.Organisation,
        "Initiator":res.Initiator,
        "Source Account Number": res.DrAccountNo,
        "Beneficiary Account Number":res.CrAccountNo,
        "BATCH ID":res.BatchId,
        "Amount": res.Amount,
        "Charges": res.Charges,
        "Currency": res.TransactionCurrency,
        "Transaction Type":res.PaymentType,
        "Beneficiary":res.Beneficiary,
        "Narration":res.Narration,
        "Payment Method":res.PaymentMethod,
        "Payment Status":res.PaymentStatus,
        "Payment Remark":res.PaymentRemark,
        "Approval Status": res.ApprovalStatus
      };
    });
    this.excel.exportTableElmToExcel(
      exportFile,
      "Transaction-Reports-" +
        new Date().toJSON().slice(0, 10).split("-").reverse().join("/")
    );
  }
  convert() {
    if(this.gVars.checkData(this.AllReports))
    {
      return
    } 
    var doc = new jsPDF('l', 'pt', 'a4');
    doc.setFontSize(10);
    const head = [['Payment Date', 'Reference No.', 'Subsidiary', 'Initiator','Source Account No.', 
     'Beneficiary Account No.','Batch ID','Amount','Charges','Narration','Payment Type','Payment Status','Payment Method','Payment Remark','Beneficiary'] ];
    const body = this.AllReports.map((res) => {
      return [res.PaymentDate, res.ReferenceNo, res.Organisation,res.Initiator, res.DrAccountNo,
        res.CrAccountNo,res.BatchId, res.TransactionCurrency+res.Amount, res.Charges, res.Narration,res.PaymentType,res.PaymentStatus, res.PaymentMethod,res.PaymentRemark,res.Beneficiary ]
    });
    autoTable(doc, { head: head,
      body: body,
      styles: {
        fontSize: 5,
        font: "helvetica"
      }
    });
    doc.save("Transaction-Reports -" + new Date().toJSON().slice(0, 10).split("-").reverse().join("/") + ".pdf");
  }

  viewHistory(data:any)
  {
     this.approvalHistory = data.ApprovalHistory
    $('#approvalModal').modal('show')  
  }
}
