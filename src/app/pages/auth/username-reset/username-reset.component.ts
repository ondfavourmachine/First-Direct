import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-username-reset',
  templateUrl: './username-reset.component.html',
  styleUrls: ['./username-reset.component.css']
})
export class UsernameResetComponent implements OnInit {
  ResetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth:AuthService,
    private gVars:GlobalsService
  ) { }

  ngOnInit(): void {
    this.ResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
    })
  }

  RetrieveUsername(data)
  {
    this.gVars.spinner.show()
    let newBody = this.gVars.EncryptData(JSON.stringify(data))
    this.auth.RetrieveUsername({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.gVars.toastr.success('Username has been sent to your registered email!')
          this.ResetForm.reset()
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage,'Please try again')
          this.ResetForm.reset()
        }
      },
      err=>{
        this.gVars.spinner.hide()
        this.gVars.toastr.error('Unable to perform that action','Please try again')
      }
    )
  }

}
