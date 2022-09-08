import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { userData } from 'src/app/core/models/userData.model';
import { ForeignService } from 'src/app/core/services/foreign.service';
import { PappsService } from 'src/app/core/services/papps.service';
import { TransferService } from 'src/app/core/services/transfer.service';

@Component({
  selector: 'app-papss-modal',
  templateUrl: './papss-modal.component.html',
  styleUrls: ['./papss-modal.component.css']
})
export class PapssModalComponent implements OnInit,OnChanges {

  @Input() Details;
  approveForm:FormGroup
  SIList: any;
  p:any;
  PaymentData: any;
  userLoad: userData;
  charges: any;
  constructor(
    private fb:FormBuilder,
    public gVars:GlobalsService,
    private pappsService: PappsService,
    private misc: TransferService
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }

  ngOnInit(): void {
    this.approveForm = this.fb.group({
      token:['',[Validators.required, Validators.minLength(7)]],
      rejectReason:[''],
      approve:[true],
      batchId:'',
    })
  }
  ngAfterViewInit()
  {}
  ngOnChanges()
  {
    if(this.Details?.Data)
    {
      this.Details?.mode == 'initiate';
    }
    this.PaymentData = this.Details?.Data
    if(this.Details?.action === 'reject')
    {
      this.approveForm.get('rejectReason').setValidators([Validators.required])
      this.approveForm.get('approve').setValue(false)
    }
    console.log(this.Details)
  }


  InitiatePayment()
  {
    this.gVars.spinner.show()
    let paymentArr = []
    paymentArr.push(this.PaymentData)
    let body = {
        ...this.userLoad,
        enableMultipleDebit:false,
        request:paymentArr
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    console.log(body)
    this.pappsService.MakePAPPS({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        console.log(decryptedData)
        if(decryptedData.Success)
        {
          this.gVars.toastr.success(decryptedData.Message, decryptedData.ResponseMessage)
          setTimeout(() => {
            window.location.reload()
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
        // this.gVars.spinner.hide()
        // this.gVars.toastr.error('Unable to complete that','Taking you home...')
        // setTimeout(() => {
        //   this.gVars.router.navigate(['/'])
        // }, 1000);
      }
    )
  }
  PrepareData()
  {

  }

  ApprovePAPSS(data)
  {
    this.gVars.spinner.show() 
   let payload = {
    ...this.userLoad,
     paymentId: [{
      paymentId:this.PaymentData.Id,
      approve:this.approveForm.value.approve,
      rejectReason:this.approveForm.value.rejectReason
     }],
     batchId:null,
     token: data.token
   }
   console.log(payload)
   let newBody = this.gVars.EncryptData(JSON.stringify(payload))
   this.pappsService.ApprovePAPSS({encryptedData:newBody}).subscribe(
     res=>{
      this.gVars.spinner.hide()
      let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
      console.log(decryptedData)
      if(decryptedData.Success)
       {
         this.gVars.toastr.success(decryptedData.ResponseMessage,decryptedData.Message)
           setTimeout(() => {
         window.location.reload()
       }, 1500); 
       } else{
         this.gVars.toastr.error(decryptedData.ResponseMessage, decryptedData.Message)
       }
     },
     err=>{
       this.gVars.spinner.hide()
       this.gVars.goHome()
     }
   )
  }
  castAction(data:string)
  {
  return data === 'approve' ? true :false
  }
  castInvoice(data)
  {
    return data == true ? 'Invoice Payment' : 'Direct Payment';
  }
}