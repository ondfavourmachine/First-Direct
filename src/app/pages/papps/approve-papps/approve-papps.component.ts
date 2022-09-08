import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { PappsService } from 'src/app/core/services/papps.service';
import { TransferService } from 'src/app/core/services/transfer.service';

declare var $:any;
@Component({
  selector: 'app-approve-papps',
  templateUrl: './approve-papps.component.html',
  styleUrls: ['./approve-papps.component.css']
})
export class ApprovePappsComponent implements OnInit {
  userLoad: { session: any; username: string; subsidiaryId: any; };
  ToApprove:any = []
  TokenForm: any;
  pageMode: string;
  message: string;
  PaymentList: any;
  tokenSerial: any;
  AccountList: any;
  p:any;
  term:any;
  Details: { action: string; Data: string; mode: string; message: string; token: any; };
  constructor(
    public gVars: GlobalsService,
    private fb: FormBuilder,
    private misc: TransferService,
    private PappsService: PappsService
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }

  ngOnInit(): void {
    this.TokenForm = this.fb.group({
      token:['',Validators.required],
      reason:['']
    });
    this.GetPappsList()
  }

  PrepareData(item)
  {
    this.ToApprove.push(item)
  }
  GetPappsList()
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad,
      reportPage:false
    }
    console.log(body, 'approve papps req')
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.PappsService.fetchPaymentList({encryptedData:newBody}).subscribe(
      res=>{
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        console.log(decryptedData)
        this.gVars.spinner.hide()
        if(decryptedData.Success)
        {
          this.PaymentList = decryptedData.Payments
          this.AccountList = decryptedData.Accounts;
          this.tokenSerial = decryptedData.TokenSerial
        }else{
          this.gVars.toastr.error(decryptedData.ResponseMessage, 'Taking you home...')
          this.gVars.goHome()
        }
      },
      err=>{
        this.gVars.spinner.hide();
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        this.gVars.goHome()
      }
    )
  }

  ApprovePayment(data)
  {
    this.gVars.spinner.show()
    let body = {
     ...this.userLoad,
      paymentId: this.ToApprove,
      batchId:null,
      token: String(this.TokenForm.value.token)
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.misc.ApproveSinglePayments({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.gVars.toastr.success(decryptedData.ResponseMessage)
          this.pageMode = 'Rate'
          this.message = 'Transaction Approved successfully'
          this.TokenForm.reset()
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage)
        }
      }
      ,err=>{
        this.gVars.spinner.hide();
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        this.gVars.goHome()
      }
    )
  }

  ParseValue(data)
  {
    return JSON.stringify(data);
  }

  RejectPayment(data)
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad,
      paymentId: this.ToApprove,
      batchId:null,
      token: String(data.token),
      rejectReason:data.reason
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.misc.ApproveSinglePayments({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.gVars.toastr.success(decryptedData.ResponseMessage)
          this.pageMode = 'Rate'
          this.message = 'Transaction Rejected Successfully'
          this.TokenForm.reset()
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage)
        }
      }
      ,err=>{
        this.gVars.spinner.hide();
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        this.gVars.goHome()
      }
    )
  }

  ApproveMore()
  {
    window.location.reload()
  }

  refreshBatch()
  {}

ShowData(data:string, action:string)
  {
    //if(this.ToApprove.length < 1) return
    this.Details = {
        action:action,
        Data:data,
        mode:'decision', 
        message:'Review Decision',
        token:this.tokenSerial
      }
    $("#foreignModal").modal('show') 
  }

castInvoice(data)
  {
    return data == true ? 'Invoice Payment' : 'Direct Payment';
  }
}
