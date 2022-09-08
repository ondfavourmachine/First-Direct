import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { SettingsService } from 'src/app/core/services/settings.service';
declare var $:any
@Component({
  selector: 'app-subsidiary-management',
  templateUrl: './subsidiary-management.component.html',
  styleUrls: ['./subsidiary-management.component.css']
})
export class SubsidiaryManagementComponent implements OnInit {
  SubsidiaryList: any;
  amount:any;
  userLoad: { session: any; username: string; subsidiaryId: any; };
  constructor(
    private settings: SettingsService,
    private gVars: GlobalsService
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }

  ngOnInit(): void {
    this.FetchSubsidiaries()
  }

  FetchSubsidiaries()
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.settings.GetSubsidiaries({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
           this.SubsidiaryList = decryptedData.Subsidiaries
        }else{
          this.gVars.toastr.error(decryptedData.ResponseMessage, 'Taking you home...')
          this.gVars.goHome()
        }       
      }
      ,err=>{
        this.gVars.toastr.error('Unable to perform that task','Redirecting...')
        this.gVars.spinner.hide()
        this.gVars.goHome()
      }
    )
  }
  
  UpdateLimit(item, count)
  {
    this.gVars.spinner.show()
    let val = $('#limit'+count).val()
    let body = {
      ...this.userLoad,
      id: item.subsidiaryId,
      active: true,
      newLimit: Number(val)
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.settings.UpdateDailyLimit({encryptedData:newBody}).subscribe(
      res=>{
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
            this.gVars.toastr.error(decryptedData.ResponseMessage, 'Taking you home...')
            this.gVars.goHome()
          }
      },
      err=>{
        this.gVars.toastr.error('Unable to perform that task','Redirecting...')
        this.gVars.spinner.hide()
        this.gVars.goHome()
      }
    )
  }

  allowEdit(data)
  {
    $('#limit'+data).removeAttr('disabled');
  }
  preferenceChange(data)
  {
    let status  = !data.status
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad,
      preferenceId: data.id,
      active: status
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.settings.SubsidairyStatus({encryptedData:newBody}).subscribe(
      res=>{      
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {    
          this.gVars.toastr.success(decryptedData.ResponseMessage)
          this.FetchSubsidiaries()
          this.gVars.goHome()
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
