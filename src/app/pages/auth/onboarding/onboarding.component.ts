import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { ComponentCanDeactivate } from 'src/app/core/Guards/pending-changes.guard';
import { AuthService } from 'src/app/core/services/auth.service';

declare var $:any;
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit,ComponentCanDeactivate {
  OnboardingForm: FormGroup;
  pageStatus:string = 'Initiate';//Profile
  pageName:string = 'Subsidiary';//Subsidiary
  CompanyForm: FormGroup;
  ipAddress: any;
  ResumeForm: FormGroup;
  skills = new FormArray([]);
  items: FormArray;
  empForm: FormGroup;
  useForm: FormGroup;
  CodeForm:FormGroup;
  roles: any;
  session:'string';
  succMessage: string;
  Details: { message: any; action: any;data:string};
  mainAccount: { accountName: any; accountNumber: any; };
  isDirty:Boolean = false;

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if(this.isDirty)
      {
        return true
      }else{
        return false
      }
  }
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private auth: AuthService,
    private gVars:GlobalsService
  ) {

   }

  ngOnInit(): void {
    this.ResumeForm = this.fb.group({
      account: ['',[Validators.required,Validators.minLength(10)]]
    })
    this.CodeForm = this.fb.group({
      code: ['',[Validators.required,Validators.minLength(3)]]
    })
    this.OnboardingForm = this.fb.group({
      session:[''],
      rcNumber:[''],
      tin:[''],
      orgName:[''],
      institutionType:[''],
      users:this.fb.array([
        //this.createUser()
      ]) ,
      accounts:this.fb.array([
        //this.createAccount()
      ]) ,
      onboardingId: [''],
      validationCode:[''],
      dailyLimit:[''],
      singleLimit:[''],
      batchLimit:['']
    })
    this.fetchRoles()
  }

  ReEnterCode()
  {
    this.Details = {
      message: '',
      action:'Resend Onboarding',
      data: ''
    }
   $('#messageModal').modal('show')
  }
  ResendOnboarding()
  {
    this.Details = {
      message: '',
      action:'Resend Onboarding',
      data: ''
    }
   $('#messageModal').modal('show')
  }
EnterCode()
{
  this.Details = {
    message: `Registration completed`,
    action:'Resend Code',
    data: ''
  }
  $('#messageModal').modal('show')
}
  SubmitInput(data)
  {
    switch(data)
    {
      case'Subsidiary':
        this.pageName = 'Organization'
        this.OnboardingForm.get('tin').setValidators([Validators.required])
        this.OnboardingForm.get('institutionType').setValidators([Validators.required])
        this.OnboardingForm.updateValueAndValidity()
      break;
      case'Organization':
        this.pageName = 'Users'
        if(this.OnboardingForm.value.users.length < 1)
        {
          this.addUser()
        }
      break;
      case'Users':
        this.pageName = 'Limit'
        this.OnboardingForm.get('dailyLimit').setValidators([Validators.required])
        this.OnboardingForm.get('singleLimit').setValidators([Validators.required])
        this.OnboardingForm.get('batchLimit').setValidators([Validators.required])
        this.OnboardingForm.updateValueAndValidity()
      break;
      case'Limit':
        this.pageName = 'Review'
      break;
      case'Review':
      this.SubmitRegistration(this.OnboardingForm.value)
      break;
    }
  }
goBack(data)
  {
    switch(data)
    {
      case'Review':
        this.pageName  = 'Limit'
      break;
      case'Limit':
        this.pageName = 'Users'
      break;
      case'Users':
        this.pageName = 'Organization'
      break;
      case 'Organization':
        this.pageName = 'Subsidiary'
      break;
    }
  }

createSub():FormGroup
  {
    return this.fb.group({
      accountNumber:this.fb.array([])
    });
  }
AddMore()
{
  this.pageStatus = 'profile'
}
createUser():FormGroup
{
 return this.fb.group({
    username: ['',[Validators.required]],
    firstname: ['',[Validators.required]],
    surname:['',[Validators.required]],
    phone: ['',[Validators.required]],
    email: ['',[Validators.required,Validators.email]],
    roleId: ['',[Validators.required]],
 }) 
}

createAccount():FormGroup
{
 return this.fb.group({
    accountNumber:['',[Validators.required, Validators.minLength(10),Validators.maxLength(10)]],
    accountName:['']
 }) 
}

  
  //Add a subsidiary
addSubsidiary(): void {
    this.subsidiaries().push(this.createSub());
  }
//get the parent
subsidiaries(): FormArray {
      return this.OnboardingForm.get("subsidiaries") as FormArray
   }
//Remove subsidiary
removeSubsidiary(subIndex:number) {
      this.subsidiaries().removeAt(subIndex);
  }
//Get accounts
subAccounts(subIndex:number) : FormArray {
      return this.subsidiaries().at(subIndex).get("accountNumber") as FormArray
   }
newAccount(): FormGroup {
        return this.fb.group({
          account: ['', [Validators.minLength(10)]],
        })
   }
   addAccountNumber(subIndex:number) {
      this.subAccounts(subIndex).push(this.newAccount());
    }
     
  removeAccount(subIndex:number,accountIndex:number) {
    this.subAccounts(subIndex).removeAt(accountIndex);
  }

ValidateAccount(data,index)
{
  if(data.target.value.length > 9)
  {
    this.spinner.show()
    this.auth.ValidateAccounts(data.target.value).subscribe(
      res=>{
        this.spinner.hide()
        if(res.isValid)
        {
          this.toastr.success(res.message)
          this.accounts().controls[index].get('accountName').setValue(res.accountName)
        }
        else{
          this.accounts().controls[index].get('accountNumber').setValue('')
          this.toastr.error(res.message)
        }
      },
      err=>{
        this.toastr.error('Unable to perform that task','Please try again')
      }
    )
  }

}


removeUser(data)
{
  this.users().removeAt(data)
}
addUser()
{
  this.users().push(this.createUser());
}
users(): FormArray {
   return this.OnboardingForm.get("users") as FormArray
}

removeAccounts(data)
{
  this.accounts().removeAt(data)
}
addAccounts()
{
  this.accounts().push(this.createAccount());
}
accounts(): FormArray {
   return this.OnboardingForm.get("accounts") as FormArray
}
stringifyValue(data)
{
  return JSON.stringify(data);
}

  editField(data)
  {
    this.pageName = data
  }

  FetchReg(data)
  {
    this.spinner.show()
    this.auth.confirmAccount(data.account).subscribe(
      res=>{
        this.spinner.hide()
        if(res.isValid)
        {
          this.Details = {
            message: `Is this your email address ${res.maskedEmail}?`,
            action:'Confirm OTP',
            data: data.account
          }
        $('#messageModal').modal('show')
         this.toastr.success(res.message)
        }
        else{
          this.toastr.error(res.message)
        }        
      },
      err=>{
        this.spinner.hide()
        this.toastr.error('Unable to complete that','Please try later')
      }
    )
  }

  ValidateCode(data)
  {
    this.gVars.spinner.show()
    this.auth.validateCode(data.code).subscribe(
      res=>{
        this.gVars.spinner.hide()
        if(res.isValid)
        {
          this.session = res.session
          this.toastr.success('Code Validated Successfully')
          this.mainAccount = {
            accountName:res.accountName,
            accountNumber:res.accountNumber
          }
          this.OnboardingForm.get('orgName').setValue(res.accountName)
          this.OnboardingForm.get('onboardingId').setValue(res.onboardingId)
          this.OnboardingForm.get('validationCode').setValue(data.code)
          setTimeout(() => {
            this.pageStatus = 'Profile'
          }, 1500);
        }
        else{
          this.toastr.error(res.message)
        }
      }
      ,err=>{
        this.gVars.spinner.hide()
        this.toastr.error('Unable to complete', 'Please try later')
      }
    )
  }

  fetchRoles()
  {
    this.auth.GetRoles().subscribe(
      res=>{
        this.roles = res
      }
    )
  }

  async SubmitRegistration(data)
  {
    this.spinner.show()
   await data.accounts.push({accountNumber:this.mainAccount.accountNumber,accountName:this.mainAccount.accountName})
    data.users.forEach(element => {
      return element.roleId = Number(element.roleId)
    });
    data.session = 'string'
    data.institutionType = Number(data.institutionType)
    data.dailyLimit = Number(data.dailyLimit)
    data.singleLimit = Number(data.singleLimit)
    data.batchLimit = Number(data.batchLimit)  
    this.isDirty= true;
    //encrypt here
    let newBody = this.gVars.EncryptData(JSON.stringify(data))
    this.auth.SubmitReg({encryptedData:newBody}).subscribe(
      res=>{
        this.spinner.hide()
        //decrypt here
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.Details = {
            message: `Registration completed`,
            action:'Download Form',
            data: data.onboardingId
          }
          $('#messageModal').modal('show')
          this.toastr.success(decryptedData.ResponseMessage)
        }else{
          this.toastr.error(decryptedData.ResponseMessage)
        }
      },err=>{
        this.spinner.hide()
        this.toastr.error('Unable to complete that','Redirecting...')
        setTimeout(() => {
          this.router.navigate(['/auth/login'])
        }, 1500);
      }
    )
  }
  handleOtpRes(data)
  {
   if(data.status === 'Valid')
   {
     $('#messageModal').modal('hide')
     this.pageStatus = 'Code'
   }else if(data.status === 'Code Valid')
   {
     this.mainAccount = {
      accountName:data.accountName,
      accountNumber:data.accountNumber
    }
    $('#messageModal').modal('hide')
     this.pageStatus = 'Profile'
     this.pageName = 'Subsidiary'
     this.OnboardingForm.get('orgName').setValue(data.accountName)
     this.OnboardingForm.get('onboardingId').setValue(data.id)
     this.OnboardingForm.get('validationCode').setValue(data.code)
   }
  }

  setRole(data,index)
  {
    //this.users().value[index].get('roleId').setValue(Number(data.target.value))
    
    //this.users()[index].get('roleId').setValue(Number(data.target.value))
    this.OnboardingForm.get('users')[index].get('roleId').setValue(Number(data.target.value))
  }

  castRoleId(data)
  {
    switch(Number(data))
    {
      case 1:
        return 'ADMINISTRATOR'
      break
      case 2:
        return 'INITIATOR'
      break
      case 3:
        return 'AUTHORIZER'
      break
      case 4:
        return 'VIEWER'
      break
      case 5:
        return 'SINGLE USER'
      break
    }
  }
  
formatCurrency(event,id)
{
  var uy = new Intl.NumberFormat('en-US',{style: 'currency', currency:'NGN'}).format(event.target.value);
  $('#'+id).val(uy)
}
disableDate(){
  return false;
} 

CheckValue(event)
{
  const pat = /^-?(\d+\.?\d*)$|(\d*\.?\d+)$/
  if(!pat.test(event.target.value))
  {
    return event.target.value = '';
  }
  return
}
checkAlpha(event) {
  const pat = /^[A-Za-z]+$/
    if (!pat.test(event.target.value)) 
    {
      return event.target.value = '';
    }
  }
  checkSpace(event)
  {
    let str = event.target.value
    return event.target.value =  str.replace(/ /g, "");
  }
}
