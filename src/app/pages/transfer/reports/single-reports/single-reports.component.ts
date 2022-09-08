import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, Input,OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { TransferService } from 'src/app/core/services/transfer.service';
import { environment } from 'src/environments/environment';
declare var $:any;
@Component({
  selector: 'app-single-reports',
  templateUrl: './single-reports.component.html',
  styleUrls: ['./single-reports.component.css']
})
export class SingleReportsComponent implements OnInit,AfterViewInit,OnChanges {
  //SingleReports: any;
  p:any;
  term:any;
  FilterForm:FormGroup;
  singleAccounts: any;
  userLoad: { session: any; username: string; subsidiaryId: any; };
  @Input() SReports;
  SingleReports:any;
  s:any
  Details: { Data: any; message: string; mode: string; };
  constructor(
    private misc: TransferService,
    private fb: FormBuilder,
    private gVars:GlobalsService,
    private excel: ExcelService,
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }

  ngOnInit(): void {
    this.FilterForm = this.fb.group({
      ...this.userLoad,
      parameter: "string",
      startDate:['',Validators.required],
      endDate: ['', Validators.required],
      reportPage: true
    })
  }

  ngAfterViewInit()
  {
    this.SingleReports = this.SReports?.Payments
  }
  ngOnChanges()
  {
    this.SingleReports = this.SReports?.Payments
   // this.SingleReports = this.SingleReports
  }

  GetSingleReports()
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad,
      reportPage:true,
      startDate:this.gVars.GetCurrentDates().startDate,
      endDate:this.gVars.GetCurrentDates().endDate
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.misc.FetchSinglePaymentReports({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.singleAccounts = decryptedData.Accounts
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

  FilterReports(data)
  {
    this.gVars.spinner.show()
    let body = {
      ...data,
      startDate: this.gVars.convertDate(data.startDate),
      endDate: this.gVars.convertDate(data.endDate)
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
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
  MapAccount(data)
  {
    if(data)
    {
      if(this.singleAccounts)
      {
        var testacc = this.singleAccounts?.filter(function (e) {
          return e?.AccountId === data;
        });
        return testacc[0]?.AccountNumber
      }else{
        return '';
      }
    }
    else{
      return '';
    }
  }

  DownloadReceipt(item)
  { 
   this.gVars.toastr.info('Generating receipt...')
   window.open(environment.devUrl.transService+'Payment/DownloadLocalSingleReceipt/'+this.userLoad.session+'/'+this.userLoad.username+'/'+item.Id, '_blank')
  }  

  refreshBatch()
  {
    this.GetSingleReports()
  }

  export()
  {
   if(this.gVars.checkData(this.SingleReports)) 
   {
     return
   }
   const exportFile = this.SingleReports.map((res) => {
    return {
      "Request Date": res.RequestDate,
      "Value Date":res.ValueDate,
      "Subsidiary Name": res.SubsidiaryName,
      "Source Account": this.MapAccount(res?.AccountId),
      "Initiator": res.Initiator,
      "Amount": res.Amount,
      "Charge": res.Charges,
      "Beneficiary Account Number": res.AccountNumber,
      "Beneficiary Name": res.BeneficiaryName,
      "Beneficiary Bank": res.BankName,
      "Narration":res.Narration,
      "Approval Status": res.ApprovalStatus,
      "Payment Status": res.PaymentStatus,
      "Payment Remark": res.PaymentRemark
    };
  });
  this.excel.exportTableElmToExcel(
    exportFile,
    "Single-Reports-" +
      new Date().toJSON().slice(0, 10).split("-").reverse().join("/")
  );
}

ViewHistory(item){
  this.gVars.spinner.show()
  this.misc.FetchApprovalHistory(this.userLoad.subsidiaryId,item?.Id).subscribe(
    (res:any)=>{
      this.gVars.spinner.hide()
      if(res?.previousApprovers.length || res.nextApprovers.length)
      {
        this.Details = {
            Data:res,
            message:'Approval History',
            mode:'approvalHistory'
          }
        $('#reportModal').modal('show')
      }
      else{
        this.gVars.toastr.error('No Information available to view')
      }
    },
    err=>{
      this.gVars.takeOut()
    }
  )
}

CancelTransaction(item)
{
  this.Details = {
    Data:item,
    message:'Cancel Transaction',
    mode:'cancelTransaction'
  }
  $('#reportModal').modal('show')
}



}
