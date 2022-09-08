import { Component, OnInit } from '@angular/core';
import { CustomValidators } from 'src/app/core/classess/custom-validator';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { GlobalsService } from 'src/app/core/globals/globals.service';

declare var $:any;
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  ResetPassForm: FormGroup;
  ipAddress: any;
  userLoad: { session: any; username: string; subsidiaryId: any; };
  constructor(
    private fb:FormBuilder,
    private auth: AuthService,
    private gVars: GlobalsService
  ) { 
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
  }

  ngOnInit(): void {
    this.RetrieveIp()

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
      conPassword:['', [RxwebValidators.compare({fieldName:'newPassword'}), Validators.required]]
    });
  }


  ResetPassword(data)
  {
    this.gVars.spinner.show()
    let body = {
      session:this.userLoad.session,
      username: this.userLoad.username,
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
          this.gVars.toastr.success(decryptedData.ResponseMessage, 'Please login again...')
          setTimeout(() => {
            sessionStorage.clear()
            this.gVars.router.navigate(['/auth/login'])
          }, 1500);          
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

  RetrieveIp()
  {
    this.auth.GetIp().subscribe(
      res=>{
        if(res)
        {
          this.ipAddress = res.ip 
        }else{
          this.ipAddress = '10.1.1.1';
        }
      }
    )
  }


}
