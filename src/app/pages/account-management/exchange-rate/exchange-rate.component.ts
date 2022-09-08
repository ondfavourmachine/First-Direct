import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { userData } from 'src/app/core/models/userData.model';
import { ManagementService } from 'src/app/core/services/management.service';

@Component({
  selector: 'app-exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.css']
})
export class ExchangeRateComponent implements OnInit {
  exchangeRates: any;
  p:any;
  userLoad:userData;
  constructor(
    private manage: ManagementService,
    private gVars: GlobalsService
  ) { 
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
  }

  ngOnInit(): void {
    this.GetRates()
  }

  GetRates()
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.manage.FetchRates({encryptedData:newBody}).subscribe(
      res =>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {//assign
         this.exchangeRates = decryptedData.ExchangeRate
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage,'Taking you home...')
          this.gVars.goHome()
        }
      },
      err=>{
        this.gVars.spinner.hide()
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        setTimeout(() => {
          this.gVars.router.navigate(['/auth/login']);
        }, 1500);
      }
    )
  }

}
