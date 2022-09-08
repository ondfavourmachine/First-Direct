import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { RequestService } from 'src/app/core/services/request.service';

declare var $:any
@Component({
  selector: 'app-sr-modal',
  templateUrl: './sr-modal.component.html',
  styleUrls: ['./sr-modal.component.css']
})
export class SrModalComponent implements OnInit, OnChanges {
  approveForm: any;
  userLoad: { session: any; username: string; subsidiaryId: any; };
  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private gVars:GlobalsService
  ) { 
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url) 
  }
  @Input() Decision;
  ngOnInit(): void {
    this.approveForm = this.fb.group({
      token:['',[Validators.required, Validators.minLength(7)]],
      rejectReason:[''],
      approveReject:[true],
      ...this.userLoad
    })
  }

  ngOnChanges()
  {
    if(this.Decision?.action === 'Reject')
    {
      this.approveForm.get('rejectReason').setValidators([Validators.required])
      this.approveForm.get('approveReject').setValue(false)
    }
  }


  clearForm()
  {
    this.approveForm.reset()
  }

  ApproveRequest(data)
  {
    this.gVars.spinner.show()
    let payload = {
      ...data,
      requestId:[
        this.Decision?.data.ID
      ],
      requestTypeId:this.Decision?.requestType
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(payload))
    this.requestService.ApproveCheckConfirmation({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.gVars.toastr.success(decryptedData.ResponseMessage, decryptedData.Message)
          setTimeout(() => {
            window.location.reload()
          }, 1500);
        }
        else{
          if(!decryptedData.Message)
            {
              this.gVars.toastr.error(decryptedData.ResponseMessage)
            }
            else{
              this.gVars.toastr.error(decryptedData.Message)
            }
            setTimeout(() => {
              window.location.reload()
            }, 2500);
        }
      },err=>{
        this.gVars.spinner.hide()
       this.gVars.takeOut()
      }
    )
  }

  

}