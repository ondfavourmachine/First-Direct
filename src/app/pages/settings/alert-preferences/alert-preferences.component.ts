import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'app-alert-preferences',
  templateUrl: './alert-preferences.component.html',
  styleUrls: ['./alert-preferences.component.css']
})
export class AlertPreferencesComponent implements OnInit {
  alertPreferences: any;
  userLoad: { session: any; username: string; subsidiaryId: any; };
  constructor(
    private settings: SettingsService,
    private gVars:GlobalsService
  ) { 
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
  }

  ngOnInit(): void {
    this.FetchPreferences()
  }

  FetchPreferences()
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad
    }
    let newBody:string = this.gVars.EncryptData(JSON.stringify(body))
    this.settings.GetAlertPreferences({encryptedDate:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.alertPreferences = decryptedData.alerts
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage, 'Taking you home...')
          setTimeout(() => {
            this.gVars.router.navigate(['/dashboard'])
          }, 1500);
        }
      },
      err=>{
        this.gVars.toastr.error('Unable to perform that task','Redirecting...')
        this.gVars.spinner.hide()
        this.gVars.goHome()
      }
    )
  }

  preferenceChange(data)
  {
    let status  = !data.Status
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad,
      preferenceId: data.Id,
      status: status
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.settings.ChangeAlertPreference({encryptedData:newBody}).subscribe(
      res=>{
        let decryptedData  = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.gVars.spinner.hide()
          this.gVars.toastr.success(decryptedData.ResponseMessage)
          this.FetchPreferences()
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage)
        }
      },
      err=>{
        this.gVars.toastr.error('Unable to perform that task','Redirecting...')
        this.gVars.spinner.hide()
        this.gVars.goHome()
      }
    )
  }
}
