import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  UserForm: FormGroup;
  UserList: any;
  p:any;
  term:any;
  UserRoles: any;
  userLoad: { session: any; username: string; subsidiaryId: any; };
  constructor(
    private fb: FormBuilder,
    private gVars:GlobalsService,
    private settings: SettingsService
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }

  ngOnInit(): void {
    this.UserForm = this.fb.group({
      newUsername: ['',[Validators.required, Validators.minLength(3)]],
      firstname: ['',[Validators.required, Validators.minLength(3)]],
      surname: ['',[Validators.required, Validators.minLength(3)]],
      phone: ['',[Validators.required, Validators.minLength(7)]],
      email: ['',[Validators.required,Validators.email, Validators.minLength(3)]],
      roleId: ['',[Validators.required]]
    })
    this.FetchUsers()
  }


  FetchUsers()
  {
    this.gVars.spinner.show()
    let body = {
     ...this.userLoad
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.settings.GetUsers({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.UserList = decryptedData.Users
          this.FetchRoles()
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage, 'Taking you home...')
          setTimeout(() => {
            this.gVars.router.navigate(['/dashboard'])
          }, 1500);
        }
      }
      ,err=>{
        this.gVars.toastr.error('Unable to perform that task','Redirecting...')
        this.gVars.spinner.hide()
        setTimeout(() => {
          this.gVars.router.navigate(['/auth/login'])
        }, 1500);
      }
    )
  }

  FetchRoles()
  {
    this.settings.GetUserRoles().subscribe(
      res=>{
         if(res)
         {
           this.UserRoles = res
         }
      }
    )
  }


  AddUser(data)
  {
    this.gVars.spinner.show()
    data.session = (JSON.parse(sessionStorage.getItem('userData'))).Session
    data.username = sessionStorage.getItem('username')
    data.subsidiaryId = (JSON.parse(sessionStorage.getItem('activeSub'))).SubsidiaryId
    data.roleId = Number(data.roleId)
    let newBody = this.gVars.EncryptData(JSON.stringify(data))
    this.settings.CreateNewUser({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.gVars.toastr.success(decryptedData.ResponseMessage,'Refreshing')
          this.UserForm.reset()
          this.FetchUsers()
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage, 'Taking you home...')
          setTimeout(() => {
            this.gVars.router.navigate(['/dashboard'])
          }, 1500);
        }
      },err=>{
        this.gVars.toastr.error('Unable to perform that task','Redirecting...')
        this.gVars.spinner.hide()
        setTimeout(() => {
          this.gVars.router.navigate(['/auth/login'])
        }, 1500);
      }
    )
  }

  ChangeStatus(data)
  {
    this.gVars.spinner.show()
    let body = {
      session:(JSON.parse(sessionStorage.getItem('userData'))).Session,
      username: sessionStorage.getItem('username'),
      subsidiaryId:(JSON.parse(sessionStorage.getItem('activeSub'))).SubsidiaryId,
      id: data.id,
      active: this.CastActive(data.status),
      activate: this.CastActive(data.status),
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.settings.ChangeUserStatus({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.gVars.toastr.success(decryptedData.ResponseMessage)
          this.FetchUsers()
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage, 'Taking you home...')
          setTimeout(() => {
            this.gVars.router.navigate(['/dashboard'])
          }, 1500);
        }
      },err=>{
        this.gVars.toastr.error('Unable to perform that task','Redirecting...')
        this.gVars.spinner.hide()
        setTimeout(() => {
          this.gVars.router.navigate(['/auth/login'])
        }, 1500);
      }
    )
  }
  CastStatus(data)
  { 
    return data === 1 ? 'Disable' : 'Enable'
  }
  CastActive(data)
  {
    return data === 1 ? false : true;
  }

}
