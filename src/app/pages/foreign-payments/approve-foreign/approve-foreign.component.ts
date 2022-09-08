import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { userData } from 'src/app/core/models/userData.model';
import { ForeignService } from 'src/app/core/services/foreign.service';

declare var $:any;
@Component({
  selector: 'app-foreign-list',
  templateUrl: './approve-foreign.component.html',
  styleUrls: ['./approve-foreign.component.css']
})
export class ApproveForeignComponent implements OnInit, OnDestroy{

//   @Input() Details;
  approveForm:FormGroup
  term:any;
  p:any;
  PaymentData: any;
  userLoad: userData
  foreignList: any;
  ToApprove:any;
  FilterForm:FormGroup
  pageType: string;
    Details: { action: any; Data:string;mode:string;message:string,token?:string};
    totalAmount: number;
    foreignPayments: any;
    foreignAccounts: any;
  token: string;

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
        parameter: "string",
        startDate:['',Validators.required],
        endDate: ['', Validators.required],
        reportPage: false
    })
    this.gVars.toastr.info('Please note that you assume responsibility for the data provided on this transaction.    FirstBank will not be held liable for any loss incurred as a result of incorrect data provided','',{
      disableTimeOut:true,
    })
}
ngOnDestroy(): void {
  this.gVars.toastr.clear()
}

GetForeignList()
{
    this.gVars.spinner.show()
    let payload = 
    {
        ...this.userLoad,
        reportPage: false
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(payload))
    this.foreign.getList({encryptedData:newBody}).subscribe(
        res=>{
            this.gVars.spinner.hide()
            let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
            if(decryptedData.Success)
            {
               this.foreignPayments = decryptedData.Payments
               this.foreignAccounts = decryptedData.Accounts
               this.token = decryptedData.TokenSerial
           }
        }
    )
}

ShowData(data:string, action:string)
{
    //if(this.ToApprove.length < 1) return
    this.Details = {
        action:action,
        Data:data,
        mode:'decision', 
        message:'Review Decision',
        token:this.token
      }
    $("#foreignModal").modal('show') 
}
ParseValue(data:any)
{

}

refreshBatch()
{
  this.GetForeignList()
}
launchModal(data)
{}

}