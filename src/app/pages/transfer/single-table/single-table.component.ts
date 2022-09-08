import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { TransferService } from 'src/app/core/services/transfer.service';
declare var $:any;
@Component({
  selector: 'app-single-table',
  templateUrl: './single-table.component.html',
  styleUrls: ['./single-table.component.css']
})
export class SingleTableComponent implements OnInit, AfterViewInit {
  @Input() PaymentDetails;
  isApprove:boolean = false
  p:any;
  term:any;
  multiDebit: boolean = false;
  userLoad: { session: any; username: string; subsidiaryId: any; };
  constructor(
    private transfer: TransferService,
    private gVars:GlobalsService
  ) { 
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
  }

  ngOnInit(): void {
  }
  ngAfterViewInit()
  {
  }

  removeBeneficiary(data)
  {
      this.PaymentDetails.splice((data), 1)
  }

  InitiatePayment()
  {
    this.gVars.spinner.show()
    let body = {
        ...this.userLoad,
        enableMultipleDebit:this.multiDebit,
        request:this.PaymentDetails
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.transfer.MakeOnScreenBulk({encryptedData:newBody}).subscribe(
      res =>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.gVars.toastr.success(decryptedData.ResponseMessage)
          setTimeout(() => {
            window.location.reload()
          }, 1500);         
        }
        else{
          if(decryptedData.Message === null || decryptedData.Message === '')
          {
            this.gVars.toastr.error(decryptedData.ResponseMessage)
          }
          else{
            this.gVars.toastr.error(decryptedData.Message)
          }
          this.gVars.goHome()
        }
      },
      err=>{
        this.gVars.spinner.hide()
        this.gVars.toastr.error('Unable to complete that','Redirecting...')
        this.gVars.goHome()
      }
    )
  }

  goHome()
  {
    $('#paymentSuccess').modal('toggle') 
    this.gVars.router.navigate(['/'])
  }

  MarkPayment()
  {
    let isChecked = $('#item').val()
    if ($('#enableMulti').is(":checked"))
        {
         this.multiDebit = true
        }
        else{
         this.multiDebit = false
        }
  }
}
