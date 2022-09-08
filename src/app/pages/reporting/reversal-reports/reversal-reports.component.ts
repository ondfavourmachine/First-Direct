import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { userData } from 'src/app/core/models/userData.model';
import { ReportsService } from 'src/app/core/services/reports.service';

import { FormBuilder,FormGroup,Validators } from '@angular/forms';

import { ExcelService } from 'src/app/core/services/excel.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reversal-reports',
  templateUrl: './reversal-reports.component.html',
  styleUrls: ['./reversal-reports.component.css']
})
export class ReversalReportsComponent implements OnInit {

  ReversalReports:any = [];
  FilterForm: FormGroup;
  p:any;
  term:any;
  userLoad: { session: any; username: string; subsidiaryId: any; };
  constructor(
    public gVars:GlobalsService,
    private reportService: ReportsService,
    private excel: ExcelService,
    private fb: FormBuilder,
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }

  ngOnInit(): void {
    this.FilterForm = this.fb.group({
      parameter: "string",
      startDate:['',Validators.required],
      endDate: ['', Validators.required],
      reportPage: true
    })
    const userLoad = 
    {
     ...this.userLoad,
    parameter: "string",
    startDate: this.gVars.GetCurrentDates().startDate,
    endDate: this.gVars.GetCurrentDates().endDate,
    reportPage: true
    }
    this.fetchReports(userLoad)
  }


  fetchReports(data)
  {
    this.gVars.spinner.show()
    const newBody = this.gVars.EncryptData(JSON.stringify(data))
    this.reportService.getReversalReports({encryptedData:newBody}).subscribe(
      res=>{
        const decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        this.gVars.spinner.hide()
         if(decryptedData.length)
        {
          this.ReversalReports = decryptedData
        }else{
          this.gVars.toastr.error('No data available to display')
        }
      },
      err=>{
        this.gVars.takeOut()
      }
    )
  }
  filterReports(data)
  {
    let body = {
      ...data,
      startDate: this.gVars.convertDate(data.endDate),
      endDate: this.gVars.convertDate(data.endDate),
      reportPage:true,
      parameter:"string"
    }
    this.fetchReports(body)
  }

  export()
  {
   if(this.gVars.checkData(this.ReversalReports)) 
   {
     return
   }
    const exportFile = this.ReversalReports.map((res) => {
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
    if(this.gVars.checkData(this.ReversalReports))
    {
      return
    } 
    var doc = new jsPDF('l', 'pt', 'a4');
    doc.setFontSize(10);
    const head = [['Payment Date', 'Reference No.', 'Subsidiary', 'Initiator','Source Account No.', 
     'Beneficiary Account No.','Batch ID','Amount','Charges','Narration','Payment Type','Payment Status','Payment Method','Payment Remark','Beneficiary'] ];
    const body = this.ReversalReports.map((res) => {
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
    doc.save("Reversal-Reports -" + new Date().toJSON().slice(0, 10).split("-").reverse().join("/") + ".pdf");
  }
}
