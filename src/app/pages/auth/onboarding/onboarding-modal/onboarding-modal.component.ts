import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { AuthService } from 'src/app/core/services/auth.service';

declare var $:any;
@Component({
  selector: 'app-onboarding-modal',
  templateUrl: './onboarding-modal.component.html',
  styleUrls: ['./onboarding-modal.component.css']
})
export class OnboardingModalComponent implements OnInit {

  @Input() Details;
  @Output() OtpValid = new EventEmitter();
  CodeForm: any;
  AccountForm: any;
  constructor(
    private authServe: AuthService,
    private gVars: GlobalsService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.CodeForm = this.fb.group({
      code: ['',[Validators.required]]
    })
    this.AccountForm = this.fb.group({
      accountNumber: ['',[Validators.required]]
    })
  }

  SendEmail()
  {
    this.gVars.spinner.show()
    this.authServe.GetOTP(this.Details?.data).subscribe(
      res=>{
        this.gVars.spinner.hide()
        if(res.isValid)
        {
          let responseData = {
            status:'Valid',
            accountNumber: res.accountNumber,
            accountName: res.accountName,
          }
          this.gVars.toastr.success('Validation Code successfully sent to your email')
          this.OtpValid.emit(responseData)
        }
        else{
          this.gVars.toastr.error(res.message)
        }
      },
      err=>{
        this.gVars.spinner.hide()
      }
    )
  }

  Cancel()
  {
    this.gVars.router.navigate(['/auth/login'])
  }
  ResendCode(data)
  {
    this.gVars.spinner.show()
    this.authServe.resendCode(data.accountNumber).subscribe(
      res=>{
        this.gVars.spinner.hide()
        if(res.isValid)
        {
          this.gVars.toastr.success(res.message)
          $('#messageModal').modal('hide')
        }
        else{
          this.gVars.toastr.error(res.message)
        }
      },
      err=>{
        this.gVars.spinner.hide()
        this.gVars.toastr.error('Unable to complete that action','taking you home...')
        setTimeout(() => {
          this.gVars.router.navigate(['/login'])
        }, 1500);
      }
    )
  }

  DownloadForm(data)
    {
      this.gVars.toastr.success('Downloading...')
      this.authServe.DownloadForm(data)
      .subscribe(
         res=>{
          this.gVars.spinner.hide()
           if(res)
           {               
            const newBlob = new Blob([(res)], { type: 'application/pdf' });
            const downloadURL = URL.createObjectURL(newBlob);
            window.open(downloadURL);
            $('#messageModal').modal('hide')
            setTimeout(() => {
              this.gVars.router.navigate(['/auth/login'])
            }, 1500);
           }
           else{
              this.gVars.toastr.error('Something went wrong')
           }
        },
        err =>{
          this.gVars.toastr.error('Unable to complete')
        setTimeout(() => {
          this.gVars.router.navigate(['/auth/login'])
        }, 1500);
        }
      )   
    }

  FetchCode(data)
  {
    this.gVars.spinner.show()
    this.authServe.validateCode(data.code).subscribe(
      res=>{
        this.gVars.spinner.hide()
        if(res.isValid)
        {
          let responseData = {
            status:'Code Valid',
            accountNumber: res.accountNumber,
            accountName: res.accountName,
            code:data.code,
            id:res.onboardingId
          }
          this.OtpValid.emit(responseData)
          this.gVars.toastr.success(res.message)
        }
        else if(res.message === 'Invalid code'){
          this.gVars.toastr.error(res.message)
          $('#messageModal').modal('hide')
        } else
        {
          this.gVars.toastr.info(res.message)
          // this.Details.
          this.Details.action = 'Resend Onboarding'
        }
      },
      err=>{
        this.gVars.spinner.hide()
        this.gVars.toastr.error('Unable to complete that action','taking you home...')
        setTimeout(() => {
          this.gVars.router.navigate(['/login'])
        }, 1500);
      }
    )
  }

}
