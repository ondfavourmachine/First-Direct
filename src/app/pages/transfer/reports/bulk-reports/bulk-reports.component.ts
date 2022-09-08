import { AfterViewInit, Component, Input, OnChanges, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { TransferService } from 'src/app/core/services/transfer.service';
import { environment } from 'src/environments/environment';
declare var $:any;
@Component({
  selector: 'app-bulk-reports',
  templateUrl: './bulk-reports.component.html',
  styleUrls: ['./bulk-reports.component.css']
})
export class BulkReportsComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() BReports;
  p:any;
  term:any;
  b:any;
  FilterForm: FormGroup;
  bulkMode: boolean = true;
  singleList: any;
  singleAccounts: any;
  BulkReports:any;
  userLoad: { session: any; username: string; subsidiaryId: any; };
  Details: { Data: any; message: string; mode: string; };
  constructor(
    private misc: TransferService,
    private fb: FormBuilder,
    public gVars: GlobalsService
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
    //this.GetBulkReports()
  }
  ngOnChanges()
  {
    this.BulkReports = this.BReports?.Payments
  }

  GetBulkReports()
  {
    this.gVars.spinner.show()
    let body = {
     ...this.userLoad,
      reportPage:true,
      startDate:this.gVars.GetCurrentDates().startDate,
      endDate:this.gVars.GetCurrentDates().endDate
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.misc.FetchBulkPaymentReports({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.BulkReports = decryptedData.Payments;
          this.singleAccounts = decryptedData.Accounts
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
    this.misc.FetchBulkPaymentReports({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.BulkReports = decryptedData.Payments
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
  view(data)
  {
    this.gVars.spinner.show()
    let body={
      ...this.userLoad,
      batchId: data.Batchid,
      reportPage: true
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.misc.GetBulkList({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        console.log(decryptedData)
        if(decryptedData.Success)
        {
          if(!decryptedData.Payments)
          {
            this.gVars.toastr.error(decryptedData.ResponseMessage,'Please contact your admin')
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
  switchBatch()
  {
    this.bulkMode = true
  }
  MapAccount(data)
  {
    if(data)
    {
      if(this.singleAccounts)
      {
        var testacc = this.singleAccounts?.filter(function (e) {
          return e.AccountId === data;
        });
        return testacc[0]?.AccountNumber
      }
    }
    else{
      return '';
    }
  }

  refreshBatch()
  {
    this.GetBulkReports()
  }

  DownloadReceipt(item)
  { 
   this.gVars.toastr.info('Generating receipt...')
   window.open(environment.devUrl.transService+'Payment/DownloadLocalBulkReceipt/'+this.userLoad.session+'/'+this.userLoad.username+'/'+item.Batchid, '_blank')
  } 

  DownloadSingleReceipt(item)
  { 
   this.gVars.toastr.info('Generating receipt...')
   window.open(environment.devUrl.transService+'Payment/DownloadLocalSingleReceipt/'+this.userLoad.session+'/'+this.userLoad.username+'/'+item.Id, '_blank')
  }  
  
  DownloadReport(item)
  { 
   this.gVars.toastr.info('Generating report...')
   window.open(environment.devUrl.transService+'Payment/DownloadLocalPaymentBulkReport/'+this.userLoad.session+'/'+this.userLoad.username+'/'+item.Batchid, '_blank')
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
          $('#reportModal2').modal('show')
        }
        else{
          this.gVars.toastr.error('Unable to fetch the details')
        }
      },
      err=>{
        this.gVars.takeOut()
      }
    )
   
  }
}
