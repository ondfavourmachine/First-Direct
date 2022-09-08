import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { userData } from 'src/app/core/models/userData.model';
import { ExcelService } from 'src/app/core/services/excel.service';
import { TransferService } from 'src/app/core/services/transfer.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  userData:userData;
  userLoad:any
  SReports: any;
  BatchReports: any;
  BReports: any;
  
  constructor(
    private misc: TransferService,
    private gVars:GlobalsService,
    private excel: ExcelService,
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }

  ngOnInit(): void {
    this.runAll()
  }
  runAll()
  {
    this.GetBulkReports()
    this.GetSingleReports()
    // this.gVars.spinner.show()
    // Promise.all([this.GetBulkReports(),this.GetSingleReports()])
    // .then(
    //   (values) =>{
    //    this.gVars.spinner.hide()
    //   }
    // ).catch(
    //  err=>{
    //    console.log('Something went wrong',err)
    //  }
    // )
  }

  GetSingleReports()
  {
    let newBody = this.gVars.EncryptData(JSON.stringify(this.userLoad))
    this.misc.FetchSinglePaymentReports({encryptedData:newBody}).subscribe(
      res=>{
        let decryptedData  = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.SReports = decryptedData
        }
        else{
         // this.gVars.goHome(decryptedData.ResponseMessage)
        }
      },
      err=>{
        this.gVars.takeOut()
      }
    )
  }
  GetBulkReports()
  {
    let newBody = this.gVars.EncryptData(JSON.stringify(this.userLoad))
    this.misc.FetchBulkPaymentReports({encryptedData:newBody}).subscribe(
      res=>{
        let decryptedData  = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.BReports = decryptedData
        }
        else{
        //  this.gVars.goHome(decryptedData.ResponseMessage)
        }
      },
      err=>{
        this.gVars.takeOut()
      }
    )
  }
  GetBatchReports()
  {
    let newBody = this.gVars.EncryptData(JSON.stringify(this.userLoad))
    this.misc.FetchBatchPaymentReports({encryptedData:newBody}).subscribe(
      res=>{
        let decryptedData  = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.BatchReports = decryptedData
        }
        else{
         // this.gVars.goHome(decryptedData.ResponseMessage)
        }
      },
      err=>{
        this.gVars.takeOut()
      }
    )
  }



  // runReports()
  // {
  //   promise.all([this.doStuff(),this.doMostruf()])
  //   {
    
  //   }
  // }
  // doStuff()
  // {}
  // doMostruf()
  // {}

}
