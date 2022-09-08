import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { TransferService } from 'src/app/core/services/transfer.service';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.css']
})
export class ReportModalComponent implements OnInit,OnChanges {

  @Input() Details;
  p:any;
  previousApprovers:any;
  nextApprovers:any;
  term:any;
  TokenForm:FormGroup;
  userLoad: { session: any; username: string; subsidiaryId: any; };
  constructor(
    private misc:TransferService,
    private gVars: GlobalsService,
    private fb:FormBuilder
  ) { 
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
  }
  ngOnInit(): void {
    this.TokenForm = this.fb.group({
    })
  }
ngOnChanges()
  {
    this.previousApprovers = this.Details?.Data?.previousApprovers;
    this.nextApprovers = this.Details?.Data?.nextApprovers
  }


  CancelPayment(data)
  {   
   const body  = {
    ...this.userLoad,
    paymentId: [
      {
        paymentId: this.Details?.Data?.PaymentId,
        approve: true,
        rejectReason: "string"
      }
    ],
    batchId: this.Details?.Data?.batchId,
    token: data
    }
    const newBody = this.gVars.EncryptData(body)
    this.misc.cancelFutureSingle({encryptedData:newBody}).subscribe(
      res=>{
        const decryptedData = this.gVars.DecryptData(res)
        if(decryptedData.Success)
        {
          this.gVars.toastr.success(decryptedData.ResponseMessage)
          this.gVars.reloadAfter()
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage)
        }
      },
      err=>{
        this.gVars.takeOut()
      }
    )
  }
  
  ClearForm()
  {}
  
}
