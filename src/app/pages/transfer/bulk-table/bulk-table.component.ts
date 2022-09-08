import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { TransferService } from 'src/app/core/services/transfer.service';
import { environment } from 'src/environments/environment';
declare var $:any
@Component({
  selector: 'app-bulk-table',
  templateUrl: './bulk-table.component.html',
  styleUrls: ['./bulk-table.component.css']
})
export class BulkTableComponent implements OnInit,AfterViewInit, OnDestroy {
  bulkReports: any;
  p:any;
  term:any;
  toApprove: any;
  toInitiate:any = []
  batchId: any;
  intervalId: any;
  Details:{data:any,batch:string};
  userLoad: { session: any; username: string; subsidiaryId: any; };
  constructor(
    private transfer: TransferService,
    public gVars:GlobalsService
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }

  ngOnInit(): void {
    //this.getBulkReports()
  }

  ngAfterViewInit()
  { 
    this.getBulkReports()
    setTimeout(() => {
      this.gVars.toastr.info('Refreshing table','Please wait',{
        timeOut:15000,
      })
      this.getBulkReports()
    }, 10000);
    this.setInterval()
  }

  ngOnDestroy()
  {
    clearInterval(this.intervalId)
  }
  getBulkReports()
  {
    let body = {
      ...this.userLoad
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.transfer.BulkReport({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(!decryptedData.Success)
        {
         return false;
        }
        else{
           this.bulkReports = decryptedData.Reports
        }
      }
    )
  }
  setInterval()
  {
    this.gVars.toastr.info('Refreshing processing table...')
   this.intervalId =  setInterval(() =>{
      this.getBulkReports()
    },30000)
  }
 
  InitiateTransaction(data)
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad,
      batchId:String(data),
      initiateAll:true
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.transfer.InitiateBatch({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success){         
          this.gVars.toastr.success(decryptedData.ResponseMessage)
          setTimeout(() => {
            window.location.reload()
          }, 1500);         
        }
        else{
          if(decryptedData.Message == "" || decryptedData.Message == null) 
          {
            this.gVars.toastr.success(decryptedData.ResponseMessage);
          }
          else{
            this.gVars.toastr.success(decryptedData.Message);
          }
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
  DownloadValid(data)
  {
    let body = {
      ...this.userLoad,
      batchId:String(data),
    }
    window.open(`${environment.devUrl.transService}Payment/DownloadBatchValid/${body.session}/${body.username}/${body.subsidiaryId}/${body.batchId}`, '_blank')
    return
  }
  DownloadInvalid(data)
  {
    let body = {
     ...this.userLoad,
      batchId:String(data),
    }
    window.open(`${environment.devUrl.transService}Payment/DownloadBatchInvalid/${body.session}/${body.username}/${body.subsidiaryId}/${body.batchId}`, '_blank')
    return 
  }
  DownloadAll(data)
  {
    let body = {
     ...this.userLoad,
      batchId:String(data),
    } 
    window.open(`${environment.devUrl.transService}Payment/DownloadBatchAll/${body.session}/${body.username}/${body.subsidiaryId}/${body.batchId}`, '_blank')
    return
  }
  DownloadMisMatch(data)
  {
    let body = {
      ...this.userLoad,
      batchId:String(data),
    } 
    window.open(`${environment.devUrl.transService}Payment/DownloadBatchMismatch/${body.session}/${body.username}/${body.subsidiaryId}/${body.batchId}`, '_blank')
    return
  }

refreshBatch()
{
  this.gVars.spinner.show()
  this.getBulkReports()
}
ViewTransaction(data)
{
  this.gVars.spinner.show()
  this.batchId = data;
  let body = {
    ...this.userLoad,
    batchId:String(data),
  }
  let newBody = this.gVars.EncryptData(JSON.stringify(body))
  this.transfer.ViewBatchValid({encryptedData:newBody}).subscribe(
    res=>{
      this.gVars.spinner.hide()
      let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
      if(decryptedData.Success)
      { 
        if(decryptedData.batchDetails)
        {
          this.gVars.toastr.success(decryptedData.ResponseMessage)
          $('#exampleModal').modal('show')
          this.toApprove = decryptedData.batchDetails
        }
        else{
          this.gVars.toastr.info('Transaction already initiated')
        }       
      }
      else{
        this.gVars.toastr.error(decryptedData.ResponseMessage)
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

MarkBulk(count, item)
{
  let isChecked = $('#bulk'+count).val()
  isChecked = JSON.parse(isChecked)
  if ($('#bulk'+count).is(":checked"))
    {
      this.toInitiate.push(isChecked)
      return 
    }
    else{
    this.toInitiate =  this.toInitiate.filter(e => e.Id != isChecked.Id);
    }
}

ParseValue(data)
{
  return JSON.stringify(data);
}

InitiateItems()
{
  this.gVars.spinner.show()
  let body = {
    ...this.userLoad,
    batchId:String(this.batchId),
    initiateAll:false,
    lineId:this.PrepareLine()
  }
  let newBody = this.gVars.EncryptData(JSON.stringify(body))
  this.transfer.InitiateBatch({encryptedData:newBody}).subscribe(
    res=>{
      this.gVars.spinner.hide()
      let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
      if(decryptedData.Success){
        this.gVars.toastr.success(decryptedData.ResponseMessage)
        setTimeout(() => {
          window.location.reload()
        }, 1500);
      }
      else{
        this.gVars.toastr.error(decryptedData.ResponseMessage,'Please try again later')
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

PrepareLine()
{
  let approvalList = []
   var stuff = this.toInitiate.forEach(element => {
      approvalList.push(element.Id)
    });
    return approvalList 
}

DeleteBatch(data)
{
  this.gVars.spinner.show()
  let body = {
    ...this.userLoad,
    batchId:String(data),
  }
  this.transfer.DeleteBatch(body).subscribe(
    res=>{
      this.gVars.spinner.hide()
      if(res.success){
        this.gVars.toastr.success(res.responseMessage)
        setTimeout(() => {
          window.location.reload()
        }, 1500);
      }
      else{
        this.gVars.toastr.error(res.responseMessage,'Please try again later')
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

ReturnSub(a,b)
{
  return a - b
}
ViewMisMatch(data)
{ 
  this.gVars.spinner.show()
  let body = {
    ...this.userLoad,
    batchId:String(data),
  }
  let newBody = this.gVars.EncryptData(JSON.stringify(body))
  this.transfer.ViewNameMisMatch({encryptedData:newBody}).subscribe(
    res=>{
      this.gVars.spinner.hide()
      let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
      if(decryptedData.batchDetails.length)
      {
        this.Details = 
        {
          data: decryptedData.batchDetails,
          batch: String(data)
        } 
        $('#misMatchModal').modal('show')
      }else{
        this.gVars.toastr.error(decryptedData.ResponseMessage)
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
}
