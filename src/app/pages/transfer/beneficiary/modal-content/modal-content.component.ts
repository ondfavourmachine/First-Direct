import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { userData } from 'src/app/core/models/userData.model';
import { BeneficiaryService } from 'src/app/core/services/beneficiary';

declare var $:any;
@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.css']
})
export class ModalContentComponent implements OnInit,AfterViewInit {

  @Input() Details;
  BeneficiaryForm: FormGroup;
  BankList: any;
  TokenForm: FormGroup;
  ReasonForm: FormGroup;
  userLoad:{username:string, subsidiaryId:number,session:string};
  constructor(
    private benefit: BeneficiaryService,
    private fb: FormBuilder,
    public gVars: GlobalsService
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }

  ngOnInit(): void {
    
  }

  ngAfterViewInit()
  {
    this.BeneficiaryForm = this.fb.group({
      accountName: ['',Validators.required],
      prefferredName: [''],
      bankCode:['',[Validators.required,Validators.minLength(2)]],
      accountNumber: ['',[Validators.required,Validators.minLength(9)]],
      phone: ['',Validators.required],
      email:['', Validators.required]
    })
    this.TokenForm = this.fb.group({
      token:['',[Validators.required, Validators.minLength(7)]]
    })
    this.ReasonForm = this.fb.group({
      reason:['', [Validators.required, Validators.minLength(3)]],
      token:['',[Validators.required, Validators.minLength(7)]]
    })

    this.GetBanks()
    $('#accountName').attr('disabled','disabled')
  }

  DeleteBeneficiary()
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad,
      beneficiaryId: this.Details.subId,
      local_Foreign: true
    }
    console.log(body)
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.benefit.DeleteBeneficiary({encryptedData:newBody}).subscribe(
      res=>{
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        console.log(decryptedData)
        if(decryptedData.Success)
        {
          this.gVars.toastr.success('Beneficiary Successfully Deleted')
          //this.gVars.reloadAfter()
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage, 'Taking you home...')
          this.gVars.goHome()
        }
      },
      err=>{
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        this.gVars.takeOut()
      }
    )
  }

  AddBeneficiary(data)
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad,
      ...data,
      phone: String(data.phone),
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.benefit.AddBeneficiary({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.BeneficiaryForm.reset()
          this.gVars.toastr.success('Beneficiary Addedd Successfully')
          this.gVars.reloadAfter()
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage, 'Taking you home...')
          this.gVars.goHome()
        }
      }
      ,err=>{
        this.gVars.spinner.hide();
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        this.gVars.takeOut()
      }
    )
  }

  GetBanks()
  {
    this.benefit.GetAllBanks().subscribe(
      res=>{
        this.BankList = res
      }
      ,err=>{
        this.gVars.spinner.hide();
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        this.gVars.takeOut()
      }
    )
  }

  selectSource(data)
  {
    this.BeneficiaryForm.get('bankCode').setValue(data.target.value)
  }
  validateAccount(data)
  {
    if(data.target.value.length > 9)
    {
      let body = {
        session:this.userLoad.session,
        destinationAccount:data.target.value,
        destinationBankCode: this.BeneficiaryForm.value.bankCode
      }
      this.GetAccountValidity(body)
    }
  }

  GetAccountValidity(data)
  {
    this.gVars.spinner.show()
    let newBody = this.gVars.EncryptData(JSON.stringify(data))
    this.benefit.ValidateAccount({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Valid && decryptedData.Currency === 'NGN')
        {
            this.gVars.toastr.success('Account Number Validated Successfully')
            this.BeneficiaryForm.get('accountName').setValue(decryptedData.AccountName)
        }
        else{
          this.BeneficiaryForm.get('accountNumber').setValue('')
          this.gVars.toastr.error('Invalid Account Number','Please try again')
        }
      },
      err=>{
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        this.gVars.takeOut()
      }
    )
  }

  ApproveBeneficiary(data)
  {
    let body = {
    ...this.userLoad,
      token: String(data.token),
      approve: true,
      rejectReason:"",
      beneficiaryId: [
       this.Details.subId
      ],
      local_Foreign: true
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.benefit.ApproveBeneficiary({encryptedData:newBody}).subscribe(
      res=>{
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.gVars.toastr.success('Beneficiary Approved Successfully')
          this.gVars.reloadAfter()
        }else{
          this.gVars.toastr.error(decryptedData.ResponseMessage, 'Taking you home...')
          this.gVars.goHome()
        }
      },
      err=>{
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        this.gVars.takeOut()
      }
    )
  }

  RejectBeneficiary(data)
  {
    let body = {
      ...this.userLoad,
      token: String(data.token),
      approve: false,
      rejectReason:data.reason,
      beneficiaryId: [
       this.Details.subId
      ],
      local_Foreign: true
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.benefit.ApproveBeneficiary({encryptedData:newBody}).subscribe(
      res=>{
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.gVars.toastr.success(decryptedData.ResponseMessage)
          this.gVars.reloadAfter()
        }else{
          this.gVars.toastr.error(decryptedData.ResponseMessage, 'Taking you home...')
          this.gVars.goHome()
        }
      },
      err=>{
        this.gVars.spinner.hide();
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        this.gVars.takeOut()
      }
    )
  }
  
  ClearData()
  {
    this.BeneficiaryForm.reset()
  }

}
