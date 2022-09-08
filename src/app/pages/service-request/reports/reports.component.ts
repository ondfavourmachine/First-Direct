import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { RequestService } from 'src/app/core/services/request.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reportList:any;
  p:any;
  term:any;
  Details: { ChequeRequests: any; ChequeStops: any; ChequeConfirms: any;mode:string;};
  userLoad: { session: any; username: string; subsidiaryId: any; };
  constructor(
    private requestService: RequestService,
    public gVars: GlobalsService
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }

  ngOnInit(): void {
    this.GetReports()
  }

  GetReports()
  {
    var mytoday = new Date();
    var firstDay = new Date(mytoday.getFullYear(), mytoday.getMonth(), 1);
    var startDate = firstDay.toISOString().slice(0,10);
    var endDate =  mytoday.toISOString().slice(0,10); 
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad,
      startDate:startDate,
      endDate:endDate
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.requestService.GetReports({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.Details = {
            ChequeRequests: decryptedData.ChequeRequests,
            ChequeStops:decryptedData.ChequeStops,
            ChequeConfirms:decryptedData.ChequeConfirms,
            mode:'reports'
          }
        }else{
          this.gVars.toastr.error(decryptedData.ResponseMessage)
          setTimeout(() => {
            this.gVars.router.navigate(['/'])
          }, 1500);
        }        
      },err=>{
        this.gVars.spinner.hide()
        this.gVars.toastr.error('Unable to complete that','Taking you home...')
        this.gVars.goHome()
      }
    )
  }

  stringifyArray(item)
  {
    let accountArr = []
    item.forEach(element => {
      accountArr.push(element)
    })
    return (accountArr.toString()).replace(/[&\/\\#+()$~%.'":*?<>{}]/g, '')
  }

}