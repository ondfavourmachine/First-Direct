import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { BeneficiaryService } from 'src/app/core/services/beneficiary';

declare var $:any;

@Component({
  selector: 'app-approve-beneficiaries',
  templateUrl: './approve-beneficiaries.component.html',
  styleUrls: ['./approve-beneficiaries.component.css']
})
export class ApproveBeneficiariesComponent implements OnInit {

  
  BeneficiaryList:any;
  p:any;
  term:any;
  action: any;
  Details: { action: any; subId: any; };
  userLoad:{username:string, subsidiaryId:number,session:string};
  constructor(
    private benefit: BeneficiaryService,
    public gVars: GlobalsService
  ) { }

  ngOnInit(): void {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
    this.GetBeneficiaries()
  }


  GetBeneficiaries()
  {
    let body = {
      ...this.userLoad
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.benefit.FetchPendingBeneficiary({encryptedData:newBody}).subscribe(
      res=>{
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.BeneficiaryList = decryptedData.Beneficiaries
        }
        else{
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

  ActionModal(data,id)
  {
    this.Details = {
      action:data,
      subId:id
    }
    $('#addBeneficiary').modal('show')
  }
}
