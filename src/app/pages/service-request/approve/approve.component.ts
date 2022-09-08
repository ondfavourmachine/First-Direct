import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { RequestService } from 'src/app/core/services/request.service';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css']
})
export class ApproveComponent implements OnInit {
  pendingList:any;
  p:any;
  term:any;
  Details: {ChequeRequests:any,ChequeStops:any,ChequeConfirms:any, mode:string}
  userLoad: { session: any; username: string; subsidiaryId: any; };
  constructor(
    private requestService: RequestService,
    public gVars: GlobalsService,
  ) { 
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
  }

  ngOnInit(): void {
    this.GetPending()
  }

  GetPending()
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.requestService.GetPending({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.Details = {
            ChequeRequests: decryptedData.ChequeRequests,
            ChequeStops:decryptedData.ChequeStops,
            ChequeConfirms:decryptedData.ChequeConfirms,
            mode:'pending'
          }
        }else{
          this.gVars.toastr.error(decryptedData.ResponseMessage)
          this.gVars.goHome()
        }        
      },err=>{
        this.gVars.spinner.hide()
        this.gVars.toastr.error('Unable to complete that','Taking you home...')
        this.gVars.goHome()
      }
    )
  }

}