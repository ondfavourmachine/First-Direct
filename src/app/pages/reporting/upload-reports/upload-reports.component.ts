import { Component, OnInit } from '@angular/core';

import { ExcelService } from 'src/app/core/services/excel.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ReportsService } from 'src/app/core/services/reports.service';
declare var $:any;

@Component({
  selector: 'app-upload-reports',
  templateUrl: './upload-reports.component.html',
  styleUrls: ['./upload-reports.component.css']
})
export class UploadReportsComponent implements OnInit {
  payload: { session: any; username: string; subsidiaryId: any; startDate: string; endDate: string;uploader:string;organisation:string };
  FilterForm: FormGroup;
  p:any;
  term:any;
  Uploads:any
  batchDetails: any;
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
      startDate:startDate,
      endDate:endDate,
      uploader:'string',
      organisation:'string'
    }
   }

  ngOnInit(): void {
    this.FilterForm = this.fb.group({
      ...this.userLoad,
      startDate:['',Validators.required],
      endDate: ['', Validators.required],
      uploader:'string',
      organisation:'string'
    })
    this.fetchReports(this.payload)
  }

  fetchReports(data)
  {
    this.gVars.spinner.show()
    let newBody = this.gVars.EncryptData(JSON.stringify(data))
    this.reportService.getUploadReports({encryptedData:newBody}).subscribe(
      res=>{
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        this.gVars.spinner.hide()
        if(decryptedData.Success)
        {
          this.Uploads = decryptedData.Reports
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage, 'Taking you home...')
          this.gVars.goHome()
        }
      },
      err=>{
        this.gVars.toastr.error('Unable to complete that')
        this.gVars.spinner.hide()
        this.gVars.takeOut()
      }
    )
  }
  filterReports(data)
  {
    let body = {
      ...data,
      startDate: this.gVars.convertDate(data.startDate),
      endDate: this.gVars.convertDate(data.endDate)
    }
    this.fetchReports(body)
  }


  export()
  {
   if(this.gVars.checkData(this.Uploads))
   {
    return
    } 
    const exportFile = this.Uploads.map((res) => {
      return {
        "Processed Date":res.ProcessedDate,
        "Created Date":res.DateCreated,
        "Transaction Count": res.TransactionCount,
        "Pending Count":res.PendingCount,
        "Total Amount":res.TotalAmount,
        "Batch ID": res.BatchID,
        "Subsidiary":res.Organisation,
        "Initiator":res.Initiator
      };
    });
    this.excel.exportTableElmToExcel(
      exportFile,
      "Upload-Report-" +
        new Date().toJSON().slice(0, 10).split("-").reverse().join("/")
    );
  }
  convert() {
    if(this.gVars.checkData(this.Uploads))
    {
      return
    } 
    var doc = new jsPDF('l', 'pt', 'a4');
    doc.setFontSize(10);
    const head = [['Processed Date', 'Created Date', 'Transaction Count', 'Pending Count', 
     'Total Amount', 'Batch ID', 'Subsidiary','Initiator'] ];
    const body = this.Uploads.map((res) => {
      return [res.ProcessedDate, res.DateCreated, res.TransactionCount, res.PendingCount,
        res.TotalAmount, res.BatchID, res.Organisation,res.Initiator ]
    });
    autoTable(doc, { head: head,
      body: body,
      styles: {
        fontSize: 5,
        font: "helvetica"
      }
    });
    doc.save("Upload-Report -" + new Date().toJSON().slice(0, 10).split("-").reverse().join("/") + ".pdf");
  }
  viewBatch(data:any)
  {
   let payload =  {
      session:this.payload.session,
      username:this.payload.username,
      subsidiaryId:this.payload.subsidiaryId,
      batchID: data.BatchID
    }
    this.gVars.spinner.show()
    let newBody = this.gVars.EncryptData(JSON.stringify(payload))
    this.reportService.getBatchDetails({encryptedData:newBody}).subscribe(
      res=>{
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        this.gVars.spinner.hide()
        if(decryptedData.Success)
        {
        this.batchDetails = decryptedData.BatchDetails
        $('#batchDetailsModal').modal('show')
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage)
        }
      }
    )
   
  }


}
