import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { ReportsService } from 'src/app/core/services/reports.service';

@Component({
  selector: 'app-account-reports',
  templateUrl: './account-reports.component.html',
  styleUrls: ['./account-reports.component.css']
})
export class AccountReportsComponent implements OnInit {
   
  payload:any;
  Suspense:any;
  Corporate: any;
  userLoad: { session: any; username: string; subsidiaryId: any; };
  constructor(
    private reportService: ReportsService,
    private gVars:GlobalsService,
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }

  ngOnInit(): void {
    this.fetchCorpReports()
  }


  fetchCorpReports(){
    this.gVars.spinner.show()
    let newBody = this.gVars.EncryptData(JSON.stringify(this.payload))
    this.reportService.getCorpReports({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.Corporate = decryptedData.Reports
        }else{
          this.gVars.toastr.show(decryptedData.ResponseMessage)
          this.gVars.spinner.hide()
        }
      },
      err=>{
        this.gVars.toastr.error('Unable to complete that request','Taking you home')
        setTimeout(() => {
           this.gVars.goHome()
        }, 1500);
      }
    )
  }
}
