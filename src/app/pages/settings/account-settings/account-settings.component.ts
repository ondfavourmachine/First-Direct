import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { userData } from 'src/app/core/models/userData.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {

  hideBalance:boolean;
  userLoad: { session: any; username: string; subsidiaryId: any; };
  constructor(
    public gVars: GlobalsService,
    private changeService: SettingsService,
    private userService: DashboardService
  ) {  
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
  }

  ngOnInit(): void {
    this.GetAccounts(this.userLoad)
  }

  GetAccounts(data)
  {
    const newBody = this.gVars.EncryptData(JSON.stringify(data)) 
    this.userService.FetchAccounts({encryptedData:newBody}).subscribe(
      res=>{
        const decryptedData  =  JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.hideBalance = decryptedData.MaskAccountBalance
        }
      }
      ,errr=>{
        
      }
    )
  }

  preferenceChange()
  {
    this.gVars.spinner.show()
    const body = {
      ...this.userLoad
    }
    const newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.changeService.ChangeMask({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        const decryptedData  = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          sessionStorage.removeItem('isMasked')
          this.gVars.toastr.success(decryptedData.ResponseMessage, decryptedData.Message)
          this.hideBalance = !this.hideBalance
          const newStatus = this.gVars.EncryptData(this.hideBalance.toString())
          sessionStorage.setItem('isMasked', newStatus)
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage, decryptedData.Message)
        }
      },
      err=>{
        this.gVars.takeOut()
      }
    )
  }

}
