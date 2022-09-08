import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { TransferService } from 'src/app/core/services/transfer.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-batch-reports',
  templateUrl: './batch-reports.component.html',
  styleUrls: ['./batch-reports.component.css']
})
export class BatchReportsComponent implements OnInit {
  @Input() BatchReports;
  p:any;
  term:any;
  FilterForm: FormGroup;
  bulkMode: boolean = true;
  singleList: any;
  singleAccounts: any;
  userLoad: { session: any; username: string; subsidiaryId: any; };
  constructor(
    private misc: TransferService,
    private fb: FormBuilder,
    public gVars: GlobalsService
  ) { }

  ngOnInit(): void {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
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
    //this.GetBatchReports()
  }

  GetBatchReports()
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad,
      reportPage:true,
      startDate:this.gVars.GetCurrentDates().startDate,
      endDate:this.gVars.GetCurrentDates().endDate
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.misc.FetchBatchPaymentReports({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        console.log(decryptedData)
        if(decryptedData.Success)
        {
          this.BatchReports = decryptedData.Payments
          this.singleAccounts = decryptedData.Accounts
        }else{
          this.gVars.toastr.error(decryptedData.ResponseMessage, 'Taking you home...')
            setTimeout(() => {
              this.gVars.router.navigate(['/dashboard']);
            }, 1500);
        }
      },
      err=>{
        this.gVars.spinner.hide();
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        setTimeout(() => {
          this.gVars.router.navigate(['/auth/login']);
        }, 1500);
      }
    )
  }

  FilterReports(data)
  {
    this.gVars.spinner.show()
    let body = {
      ...data,
      startDate: this.convertDate(data.startDate),
      endDate: this.convertDate(data.endDate)
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.misc.FetchBatchPaymentReports({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.BatchReports = decryptedData.Payments
        }else{
          this.gVars.toastr.error(decryptedData.ResponseMessage, 'Taking you home...')
            setTimeout(() => {
              this.gVars.router.navigate(['/dashboard']);
            }, 1500);
        }
      },
      err=>{
        this.gVars.spinner.hide();
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        setTimeout(() => {
          this.gVars.router.navigate(['/auth/login']);
        }, 1500);
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
    this.misc.GetH2HList({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          if(!decryptedData.Payments)
          {
            this.gVars.toastr.error('You are not authorized to perform this task','Please contact your admin')
            return false
          }else{
            this.singleList = decryptedData.Payments
            this.bulkMode = false
          }
        }
      },err=>{
        this.gVars.spinner.hide();
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        setTimeout(() => {
          this.gVars.router.navigate(['/auth/login']);
        }, 1500);
      }
    )
  }
  switchBatch()
  {
    this.bulkMode = true
  }
  MapAccount(data)
  {
    var testacc = this.singleAccounts?.filter(function (e) {
      return e?.AccountId === data;
    });
    return testacc[0]?.AccountNumber
  }

  refreshBatch()
  {
    this.GetBatchReports()
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
  convertDate(data)
  {
    var dtToday = new Date(data);
    var month:any = dtToday.getMonth() + 1;
    var day:any = dtToday.getDate();
    var year:any = dtToday.getFullYear();
    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();
    var formattedDate = year + '-' + month + '-' + day; 
    return formattedDate
  }

}