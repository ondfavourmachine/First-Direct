import { Component, Input, OnChanges } from '@angular/core';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { RequestService } from 'src/app/core/services/request.service';

@Component({
  selector: 'app-sr-view-modal',
  templateUrl: './sr-view.component.html',
  styleUrls: ['../sr-modal.component.css']
})
export class SrViewComponent implements OnChanges {
  Info: any;
  mode: string;
  extra: any;
  userLoad: { session: any; username: string; subsidiaryId: any; };
  constructor(
    private gVars:GlobalsService,
    private requestService: RequestService
  ) { 
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
  }
  @Input() Details;
  ngOnChanges()
  {
      this.mode = this.Details?.action
      this.Info = this.Details?.data
      this.extra = this.Details?.extra
  }

  ConfirmRequest()
  {
    this.gVars.spinner.show()
    let newBody = this.gVars.EncryptData(JSON.stringify(this.Info))
    this.requestService.MakeChequeRequest({encryptedData:newBody}).subscribe(
        res=>{
          this.gVars.spinner.hide()
          let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
          {
            this.gVars.toastr.success(decryptedData.Message,decryptedData.ResponseMessage)
            setTimeout(() => {
              location.reload()
            }, 1500);
          }else{
            if(!decryptedData.Message)
            {
              this.gVars.toastr.error(decryptedData.ResponseMessage)
            }
            else{
              this.gVars.toastr.error(decryptedData.Message)
            }
          }
        },
        err=>{
          this.gVars.toastr.error('Unable to complete that action','Taking you home')
          this.gVars.takeOut()
        }
      )
  }

  StopRequest()
  {
    this.gVars.spinner.show()
    let newBody = this.gVars.EncryptData(JSON.stringify(this.Info))
    this.requestService.StopCheque({encryptedData:newBody}).subscribe(
        res=>{
          this.gVars.spinner.hide()
          let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
          if(decryptedData.Success)
          {
            this.gVars.toastr.success(decryptedData.Message,decryptedData.ResponseMessage)
            setTimeout(() => {
              location.reload()
            }, 1500);
          }else{
            if(!decryptedData.Message)
            {
              this.gVars.toastr.error(decryptedData.ResponseMessage)
            }
            else{
              this.gVars.toastr.error(decryptedData.Message)
            }
          }
        },
        err=>{
          this.gVars.toastr.error('Unable to complete that action','Taking you home')
         this.gVars.takeOut()
        }
      )
  }

  ConfirmCheque()
  {
    this.gVars.spinner.show()
    let newBody = this.gVars.EncryptData(JSON.stringify(this.Info))
    this.requestService.ConfirmCheque({encryptedData:newBody}).subscribe(
        res=>{
          this.gVars.spinner.hide()
          let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
          if(decryptedData.Success)
          {
            this.gVars.toastr.success(decryptedData.Message,decryptedData.ResponseMessage)
            setTimeout(() => {
              location.reload()
            }, 1500);
          }else{
            if(!decryptedData.Message)
            {
              this.gVars.toastr.error(decryptedData.ResponseMessage)
            }
            else{
              this.gVars.toastr.error(decryptedData.Message)
            }
          }
        },
        err=>{
          this.gVars.toastr.error('Unable to complete that action','Taking you home')
          this.gVars.goHome()
        }
      )
  }
  

}