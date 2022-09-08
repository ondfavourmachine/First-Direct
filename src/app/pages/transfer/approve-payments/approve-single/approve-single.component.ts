import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { TransferService } from 'src/app/core/services/transfer.service';
declare var $:any


@Component({
  selector: 'app-approve-single',
  templateUrl: './approve-single.component.html',
  styleUrls: ['./approve-single.component.css']
})
export class ApproveSingleComponent implements OnInit, AfterViewInit {
  TokenForm: FormGroup;
  SingleReports: any;
  AccountList: any;
  ToApprove:any = []
  pageMode= 'Token'
  Action: any;
  RejectForm: FormGroup;
  p:any;
  term:any;
  message: string;
  totalAmount:Number = 0;
  tokenSerial: any;
  userLoad:{username:string, subsidiaryId:number,session:string};
  constructor(
    private misc: TransferService,
    public gVars: GlobalsService,
    private fb: FormBuilder
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }

  ngOnInit(): void {
    this.TokenForm = this.fb.group({
      token:['',Validators.required],
    });
    this.RejectForm = this.fb.group({
      token:['',[Validators.required, Validators.minLength(7)]],
      reason:['',[Validators.required]]
    })
  }

  ngAfterViewInit()
  {
    this.GetSingleReports()
  }

  GetSingleReports()
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad,
      reportPage:false
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.misc.FetchSinglePaymentReports({encryptedData:newBody}).subscribe(
      res=>{
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        console.log(decryptedData)
        this.gVars.spinner.hide()
        if(decryptedData.Success)
        {
          this.SingleReports = decryptedData.Payments
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
  

  FilterReports(data)
  {
    this.gVars.spinner.show()
    let newBody = this.gVars.EncryptData(JSON.stringify(data))
    this.misc.FetchSinglePaymentReports({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.SingleReports = decryptedData.Payments
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

  MarkPayment(id,data)
  {
    let isChecked = $('#item'+id).val()
    isChecked = JSON.parse(isChecked)
    if ($('#item'+id).is(":checked"))
        {
          this.ToApprove.push(isChecked)
        }
        else{
         this.ToApprove =  this.ToApprove.filter(e => e.Id != isChecked.Id);
        }
        this.totalAmount = 0
        this.ToApprove.forEach(element => {
          return this.totalAmount +=element.Amount
        });
  }

  maskToken(item)
  {
     return (String(item).replace(/.(?=.{4})/g, "#"));
  } 

  PrepareData()
  {
    let toApprove = true
    if(this.Action === 'Reject')
    {
      toApprove = false
    }
    let approvalList = []
   var stuff = this.ToApprove.forEach(element => {
     approvalList.push({paymentId:element.Id,approve:toApprove})
    });
    return approvalList
  }
  ShowData(mode)
  {
    if(this.ToApprove.length > 0)
    {
       this.Action = mode
    $('#approveTransaction').modal('show')
    }
    else{
      this.gVars.toastr.error('Please select payments to '+mode)
    }
   
  }

  ApprovePayment(data)
  {
    this.gVars.spinner.show()
    let body = {
     ...this.userLoad,
      paymentId: this.PrepareData(),
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
      paymentId: this.PrepareData(),
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

  MapAccount(data)
  {
    if(data)
    {
      if(this.AccountList)
      {
        var testacc = this.AccountList?.filter(function (e) {
          return e.AccountId === data;
        });
        return testacc[0]?.AccountNumber
      }else{
        return '';
      }
    }else{
      return '';
    }
  }
  
  AvailableBalance(data)
  {
    var testacc = this.AccountList.filter(function (e) {
      return e.AccountId === data;
    });
    return testacc[0].AccountNumber
  }

  feedBack(data)
  {
    $('.f-im').not("."+data).addClass("grayScale")
    $('.res-message').show();
  }
  ReloadPage()
  {
    window.location.reload()
  }
  ClearForm()
  {
    this.TokenForm.reset();
    this.RejectForm.reset()
  }
}
