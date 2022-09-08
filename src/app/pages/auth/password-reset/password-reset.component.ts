import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomValidators } from 'src/app/core/classess/custom-validator';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalsService } from 'src/app/core/globals/globals.service';
declare var $:any;
@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  ResetForm: FormGroup;
  InitiatePassword:boolean = false;
  ResetPassForm: FormGroup;
  ipAddress: string = '10.1.1.1';
  username: string;
  constructor(
    private fb:FormBuilder,
    private gVars: GlobalsService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {
    //this.RetrieveIp()
   }

  ngOnInit(): void {
    this.checkMode()
    this.ResetForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      corpCode: ['', [Validators.required]],
    });
    this.ResetPassForm = this.fb.group({
      oldPassword: ['',[Validators.required, Validators.minLength(3)]],
      newPassword: ['', Validators.compose([
        //check if there is a number
        CustomValidators.patternValidator(/\d/,{
          hasNumber:true
        }),
        //check wether the entered password has upper case letter
        CustomValidators.patternValidator(/[A-Z]/,{
          hasCapitalCase: true
        }),
        //check if it has lower case letter
        CustomValidators.patternValidator(/[a-z]/,{
          hasSmallCase: true
        }),
        //check for special chars
          CustomValidators.patternValidator(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,{
            hasSpecialCharacters:true
          }),
          Validators.minLength(8)
      ])],
      conPassword:['', RxwebValidators.compare({fieldName:'newPassword'})]
    });
  }

  InitiateReset(data)
  {
    this.username = data.username+'@'+data.corpCode
    let body = 
      {
        username:this.username,
        ipAddress:this.ipAddress,
        MacAddress: '2C:54:91:88:C9:E3'
      } 
    this.gVars.spinner.show()
    let newBody:string = this.gVars.EncryptData(JSON.stringify(body))
    this.auth.InitiatePasswordChange({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
          if(decryptedData.Success)
          {
            this.gVars.toastr.success('Default Password sent to registered email','Kindly check your email')
            this.InitiatePassword = true;
            sessionStorage.setItem('resetSession',decryptedData.Session)
          }
          else{
            this.gVars.toastr.error(decryptedData.ResponseMessage, 'Please try again')
          }
      },
      err=>{
        this.gVars.spinner.hide()
        this.gVars.toastr.error('Unable to complete that request','Please try again')
      }
    )
  }

  ResetPassword(data)
  {
    this.gVars.spinner.show()
    let body = {
      username: this.username,
      session: sessionStorage.getItem('resetSession'),
      oldPassword: this.ResetPassForm.value.oldPassword,
      newPassword: this.ResetPassForm.value.newPassword,
      ipAddress:this.ipAddress,
      MacAddress: '2C:54:91:88:C9:E3'
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.auth.ResetPassword({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.ResetPassForm.reset();
          sessionStorage.clear()
          this.gVars.toastr.success(decryptedData.ResponseMessage, 'Redirecting to login...')
          setTimeout(() => {
            this.gVars.router.navigate(['/auth/login'])
          }, 2000);          
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage,'Please try again');
        }
      },
      err=>{
        this.gVars.spinner.hide();
        this.gVars.toastr.error('Unable to complete the request','Please try again')
      }
    )
  }

  Reveal(data:string)
  {
    let word = $('#'+data).attr("type")
    if(word == "password")
    {
      $("#"+data).attr("type","text");
    }
    else{
      $("#"+data).attr("type","password");
    }
  }
  checkMode()
  {
   if(this.route.snapshot.params['mode'])
   {
     if(sessionStorage.getItem('resetSession'))
     {
       this.gVars.toastr.info('Please enter the default password to proceed')
       this.InitiatePassword = true
       this.username = sessionStorage.getItem('username');
     }
     else
     {
       this.gVars.toastr.error('Page accessed in error','Redirecting...')
       setTimeout(() => {
         this.gVars.router.navigate(['/auth/login'])
       }, 1500);
     }
   }
  }

  
  RetrieveIp()
  {
    this.auth.GetIp().subscribe(
      res=>{
        this.ipAddress = res.ip
      }
    )
  }


}
