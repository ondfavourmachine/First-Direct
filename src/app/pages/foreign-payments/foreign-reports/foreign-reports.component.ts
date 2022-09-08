import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { userData } from 'src/app/core/models/userData.model';
import { ForeignService } from 'src/app/core/services/foreign.service';

declare var $:any;
@Component({
  selector: 'app-foreign-list',
  templateUrl: './foreign-reports.component.html',
  styleUrls: ['./foreign-reports.component.css']
})
export class ForeignReportsComponent implements OnInit{
  approveForm:FormGroup
  term:any;
  p:any;
  PaymentData: any;
  userLoad: userData;
  ToApprove:any;
  FilterForm:FormGroup
  pageType: string;
    Details: { action: any; Data:string;mode:string;message:string};
    totalAmount: number;
    foreignAccounts: any;
    foreignPayments: any;
  constructor(
    private fb:FormBuilder,
    private foreign:ForeignService,
    public gVars:GlobalsService
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }

ngOnInit(): void {
    this.GetForeignList()
    this.FilterForm = this.fb.group({
        ...this.userLoad,
        startDate:['',Validators.required],
        endDate: ['', Validators.required],
        reportPage: true
    })
}

GetForeignList()
{
    this.gVars.spinner.show()
    var mytoday = new Date();
    var firstDay = new Date(mytoday.getFullYear(), mytoday.getMonth(), 1);
    var startDate = firstDay.toISOString().slice(0,10);
    var endDate =  mytoday.toISOString().slice(0,10); 
    let payload = 
    {
        ...this.userLoad,
        startDate:startDate,
        endDate:endDate,
        reportPage: true
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(payload))
    this.foreign.getList({encryptedData:newBody}).subscribe(
        res=>{
            this.gVars.spinner.hide()
            let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
            if(decryptedData.Success)
           {
               this.foreignAccounts = decryptedData.Accounts
               this.foreignPayments = decryptedData.Payments
           }
           else{
             this.gVars.goHome()
           }
        },
        err=>{
          this.gVars.takeOut()
        }
    )
}

ShowData(data:string, action:string)
{
    this.Details = {
        action:action,
        Data:data,
        mode:'', 
        message:'Review Decision'
      }
    $("#foreignModal").modal('show') 
}


refreshBatch()
{
  this.GetForeignList()
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
  this.foreign.getList({encryptedData:newBody}).subscribe(
      res=>{
          this.gVars.spinner.hide()
          let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
          {
            this.foreignPayments = decryptedData.Payments 
          }
          else{
             this.gVars.goHome()
          }
      },
      err=>{
        this.gVars.takeOut()
      }
  )
}


}