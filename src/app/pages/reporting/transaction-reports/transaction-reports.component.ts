import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { ReportsService } from 'src/app/core/services/reports.service';

@Component({
  selector: 'app-transaction-reports',
  templateUrl: './transaction-reports.component.html',
  styleUrls: ['./transaction-reports.component.css']
})
export class TransactionReportsComponent implements OnInit {

  payload:any;
  RTGS:any;
  NEFT: any;
  userLoad: { session: any; username: string; subsidiaryId: any; };
  constructor(
    private reportService: ReportsService,
    private gVars:GlobalsService,
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
      batchid: "string",
      drAccountNo: "string",
      crAccountNo: "string",
      uploader: "string",
      transactionStatus: "string"
    }
   }

   ngOnInit(): void {
    this.fetchNEFTReports(this.payload)
  }


  fetchNEFTReports(data){
    this.gVars.spinner.show()
    let newBody = this.gVars.EncryptData(JSON.stringify(data))
    this.reportService.getNEFTReports({encryptedData:newBody}).subscribe(
      res=>{
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.NEFT = decryptedData.Reports
          this.fetchRTGSReports()
        }
        else{
          this.gVars.spinner.hide()
        }
      }
    )
  }

  fetchRTGSReports()
  {
    let newBody = this.gVars.EncryptData(JSON.stringify(this.payload))
    this.reportService.getRTGSReports({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.RTGS = decryptedData.Reports
        }
      }
    )
  }

}
