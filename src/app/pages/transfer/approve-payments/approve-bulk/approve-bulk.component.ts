import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { TransferService } from 'src/app/core/services/transfer.service';

declare var $:any
@Component({
  selector: 'app-approve-bulk',
  templateUrl: './approve-bulk.component.html',
  styleUrls: ['./approve-bulk.component.css']
})
export class ApproveBulkComponent implements OnInit, AfterContentInit{

  TokenForm: FormGroup;
  SingleReports: any;
  AccountList: any;
  ToApprove:any = []
  pageMode= 'Token'
  BulkReports: any;
  message: string;
  RejectForm: FormGroup;
  Action: any;
  term:any;
  p:any;
  bulkMode:boolean = true
  singleList: any;
  SingleApprove: any = [];
  totalAmount:Number = 0;
  totalSingleAmount: Number = 0;
  tokenSerial: any;
  userLoad:{username:string, subsidiaryId:number,session:string};
  constructor(
    private misc: TransferService,
    private fb: FormBuilder,
    public gVars:GlobalsService
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }

  ngOnInit(): void {
    this.TokenForm = this.fb.group({
      token:['',[Validators.required, Validators.minLength(5)]],
    })
    this.RejectForm = this.fb.group({
      token:['',[Validators.required, Validators.minLength(7)]],
      reason:['',[Validators.required]]
    })
  }
  
  ngAfterContentInit()
  {
     this.gVars.spinner.show()
    this.GetBulkReports()
  }
  
  GetBulkReports()
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad,
      reportPage:false
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.misc.FetchBulkPaymentReports({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        console.log(decryptedData,'bulk')
        if(decryptedData.Success)
        {
          this.BulkReports = decryptedData;
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
      approvalList.push({batchId:element.Batchid,approve:toApprove,rejectReason:null})
    });
    return approvalList
  }

  ParseValue(data)
  {
    return JSON.stringify(data);
  }

  MarkBulk(id,data)
  {
    let isChecked = $('#bulk'+id).val()
    isChecked = JSON.parse(isChecked)
    if ($('#bulk'+id).is(":checked"))
      {
        this.ToApprove.push(isChecked)
      }
      else{
      this.ToApprove =  this.ToApprove.filter(e => e.Id != isChecked.Id);
      }
      this.totalAmount = 0
      this.ToApprove.forEach(element => {
        return this.totalAmount +=element.BulkAmount
      });
  }


  ApproveMultiBulk(data)
  {
    this.gVars.spinner.show()
    let body={
      ...this.userLoad,
      batchId: data.Batchid,
      reportPage: false
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.misc.GetBulkList({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          if(!decryptedData.Payments)
          {
            this.gVars.toastr.error(decryptedData.ResponseMessage)
            return false
          }else{
            this.singleList = decryptedData.Payments
            this.bulkMode = false
          }
        }
      },err=>{
        this.gVars.spinner.hide();
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        this.gVars.goHome()
      }
    )
  }

  ShowData(mode)
  {
    this.Action = mode
    if(this.bulkMode)
    {
           if(!this.ToApprove.length)
        {
        this.gVars.toastr.error('Please select payments to '+mode)
        return false
        }
       $('#exampleModal').modal('show')
    }
    else{
      $('#newDrop').modal('show')
    } 
  }
  
  ApproveSingleBulk(data, mode)
  {  
    this.ToApprove = []
    this.Action = mode
    $('#exampleModal').modal('show')
    this.ToApprove.push(data)
    this.totalAmount = data.BulkAmount
  }
  ApprovePayment(data)
  { 
    this.gVars.spinner.show()
    let body ={
      ...this.userLoad,
      batch: this.PrepareData(),
      token:String(data.token)
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.misc.ApproveMultipleBatch({encryptedData:newBody}).subscribe(
      res=>{
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        this.gVars.spinner.hide()
        if(decryptedData.Success)
        {
          this.gVars.toastr.success(decryptedData.ResponseMessage)
          this.pageMode = 'Rate'
          this.message = 'Transaction Completed Successfully'
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
  RejectPayment(data)
  {
    this.gVars.spinner.show()
    let body ={
      ...this.userLoad,
      batch: this.PrepareData(),
      token:String(data.token),
      rejectReason:data.reason
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.misc.ApproveMultipleBatch({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.gVars.toastr.success(decryptedData.ResponseMessage)
          this.pageMode = 'Rate'
          this.message = 'Payments rejected Successfully'
          this.RejectForm.reset()
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

  ChecKAllBoxes()
  {
    $("#checkAll").click(function(){
      $('input:checkbox').not(this).prop('checked', this.checked);
  });
  }

  
  MarkSingle(id,data)
  {
    let isChecked = $('#single'+id).val()
    isChecked = JSON.parse(isChecked)
    if ($('#single'+id).is(":checked"))
        {
          this.SingleApprove.push(isChecked)
        }
        else{
        this.SingleApprove =  this.SingleApprove.filter(e => e.Id != isChecked.Id);
        } 
        this.totalSingleAmount = 0
        this.SingleApprove.forEach(element => {
          return this.totalSingleAmount +=element.Amount
        });
    
  }

  ApproveIdBulk(data)
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad,
      paymentId: this.PrepareSingle(),
      batchId: this.SingleApprove[0].batchid,
      token: String(data.token)
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
          this.message = 'Transaction Completed Successfully'
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

  RejectIdBulk(data)
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad,
      paymentId: this.RejectSingle(),
      batchId: this.SingleApprove[0].batchid,
      token: String(data.token)
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
          this.RejectForm.reset()
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage)
        }
      }
      ,err=>{
        this.gVars.spinner.hide();
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        setTimeout(() => {
          this.gVars.router.navigate(['/auth/login']);
        }, 1500);
      }
    )
  }

  PrepareLine()
  {
  let approvalList = []
   var stuff = this.SingleApprove.forEach(element => {
      approvalList.push(element.Id)
    });
    return approvalList 
  }

  PrepareSingle()
  {
    let approvalList = []
   var stuff = this.SingleApprove.forEach(element => {
      approvalList.push({paymentId:element.Id,approve:true,rejectReason:null})
    });
    return approvalList
  }

  RejectSingle()
  {
    let approvalList = []
   var stuff = this.SingleApprove.forEach(element => {
      approvalList.push({paymentId:element.Id,approve:false,rejectReason:this.RejectForm.value.reason})
    });
    return approvalList
  }

  MapAccount(data)
  {
    if(data)
    {
      if(this.AccountList)
      {
        var testacc = this.BulkReports?.accounts?.filter(function (e) {
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


  ParseAccounts(item)
  {
    let accountArr = []
    item.forEach(element => {
      accountArr.push(this.MapAccount(element))
    })
    return (accountArr.toString()).replace(/[&\/\\#+()$~%.'":*?<>{}]/g, '')
  }
  switchBatch()
  {
    this.bulkMode = true
    this.gVars.toastr.info('Switched to Bulk Mode!')
    this.ToApprove = []
    this.SingleApprove = []
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
    this.TokenForm.reset()
    this.RejectForm.reset()
  }
}
