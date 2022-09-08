import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { userData } from 'src/app/core/models/userData.model';
import { ForeignService } from 'src/app/core/services/foreign.service';

@Component({
  selector: 'app-foreign-modal',
  templateUrl: './foreign-modal.component.html',
  styleUrls: ['./foreign-modal.component.css']
})
export class ForeignModalComponent implements OnInit,OnChanges {

  @Input() Details;
  approveForm:FormGroup
  SIList: any;
  p:any;
  PaymentData: any;
  userLoad: userData;
  charges: any;
  constructor(
    private fb:FormBuilder,
    private foreign:ForeignService,
    public gVars:GlobalsService
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
      this.Details?.mode == 'initiate' ? this.getCharges(this.Details?.Data) : '' ;
    }
    this.PaymentData = this.Details?.Data
    if(this.Details?.action === 'reject')
    {
      this.approveForm.get('rejectReason').setValidators([Validators.required])
      this.approveForm.get('approve').setValue(false)
    }
    console.log(this.Details)
  }

  ApproveForeign(data)
  {
    this.gVars.spinner.show()
   let payload = {
     ...this.userLoad,
     token:data.token,
     approveReject:this.castAction(this.Details.action),
     requestID:[
       this.PaymentData.ID
     ],
     rejectReason:data.rejectReason
   } 
   let newBody = this.gVars.EncryptData(JSON.stringify(payload))
   this.foreign.approvePayment({encryptedData:newBody}).subscribe(
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

  castStatus(data)
  {
    if(data === 'Enable')
    {
      return true;
    }
    else{
      return false
    }
  }

  InitiatePayment()
  {
    this.gVars.spinner.show()
    let newBody = this.gVars.EncryptData(JSON.stringify(this.PaymentData))
    console.log(this.PaymentData)
    console.log(newBody)
    this.foreign.makePayment({encryptedData:newBody}).subscribe(
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
              this.gVars.toastr.error(decryptedData.ResponseMessage, decryptedData.Message)
            }
            else{
              this.gVars.toastr.error(decryptedData.ResponseMessage ,decryptedData.Message)
            }
        }
      },
      err=>{
        this.gVars.spinner.hide()
        this.gVars.toastr.error('Unable to complete that','Taking you home...')
        setTimeout(() => {
          this.gVars.router.navigate(['/'])
        }, 1000);
      }
    )
  }

  viewDocument(id:number)
  {
    this.gVars.spinner.show()
    let newBody = this.gVars.EncryptData(JSON.stringify(id))
    this.foreign.downloadDoc(id).subscribe(
      res=>{
        this.gVars.spinner.hide()
        if(res)
        {
          const newBlob = new Blob([(res)], { type: 'application/pdf' });
          const downloadURL = URL.createObjectURL(newBlob);
          window.open(downloadURL);
        }
      else{
        this.gVars.toastr.error('Unable to get document')
        }
      },
      err=>{
        this.gVars.spinner.hide()
      }
    )
  }

  returnBearer(data:boolean)
  {
    if(data)
    {
      return 'Beneficiary'
    }
    else{
      return 'Corporate'
    }
  }

  getCharges(data)
  {
    // this.gVars.spinner.show()
    const chargeData = {
      currency:data.currency,
      amount:data.amount,
      chargeBeneficiary:data.chargeBeneficiary,
    } 
    return this.foreign.getCharges(chargeData).subscribe(
      res=>{
        this.gVars.spinner.hide()
         this.charges = res
      }
    )
  }

  



}