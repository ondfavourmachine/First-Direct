import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { BeneficiaryService } from 'src/app/core/services/beneficiary';
import { TransferService } from 'src/app/core/services/transfer.service';
declare var $:any
@Component({
  selector: 'app-view-beneficiaries',
  templateUrl: './view-beneficiaries.component.html',
  styleUrls: ['./view-beneficiaries.component.css']
})
export class ViewBeneficiariesComponent implements OnInit {

  BeneficiaryList:any;
  p:any;
  term:any;
  action: any;
  Details: { action: any; subId: any; };
  BeneficiaryForm: FormGroup;
  localResponse: any;
  Amount: string;
  userLoad:{username:string, subsidiaryId:number,session:string};
  constructor(
    private benefit: BeneficiaryService,
    private fb: FormBuilder,
    public gVars:GlobalsService,
    private transfer: TransferService
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }

  ngOnInit(): void {
    this.GetBeneficiaries()
    this.BeneficiaryForm = this.fb.group({
      accountId: ['',[Validators.required]],
      accountNumber: ['', Validators.required],
      preferredName:[''],
      amount:['', Validators.required],
      paymentMethod:['',Validators.required],
      paymentType:['', Validators.required],
      bankCode:['',Validators.required],
      narration:[''],
      valueDate:['', Validators.required],
      email:['',Validators.email],
      phoneNumber:[''],
      accountName: ['']
    }) 
    this.GetLocalPayments()
  }

  GetBeneficiaries()
  {
    let body = {
      ...this.userLoad
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.benefit.FetchLocalBeneficiary({encryptedData:newBody}).subscribe(
      res=>{
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        console.log(decryptedData)
        if(decryptedData.Success)
        {
          this.BeneficiaryList = decryptedData.Beneficiaries.filter(function(e){
            return e.Status === 'ACTIVE' || e.Status === 'REJECTED';              
         })
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage, 'Taking you home...')
            setTimeout(() => {
              this.gVars.router.navigate(['/dashboard']);
            }, 1500);
        }
      },
      err=>{
        this.gVars.spinner.hide();
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        setTimeout(() => {
          this.gVars.router.navigate(['/auth/login'])
        }, 1500);
      }
    )
  }

  ActionModal(data,id)
  {
    this.Details = {
      action:data,
      subId:id
    }
    $('#addBeneficiary').modal('show')
  }
  PayBeneficiary(data)
   {
    this.minDate()
    this.BeneficiaryForm.get('bankCode').setValue(data.BankCode)
    this.BeneficiaryForm.get('accountNumber').setValue(data.AccountNumber)
    this.BeneficiaryForm.get('preferredName').setValue(data.Alias)
    this.BeneficiaryForm.get('email').setValue(data.Email)
    this.BeneficiaryForm.get('phoneNumber').setValue(data.PhoneNumber)
    this.BeneficiaryForm.get('accountName').setValue(data.AccountName)
    $('#accountNumber').attr('disabled','disabled')
    $('#accountName').attr('disabled','disabled')
    $('#payBeneficiary').modal('show')
  }
  InitiateProcess(data)
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad,
      enableMultipleDebit:false,
      request:[
        {
          accountId: Number(data.accountId),
          accountNumber: data.accountNumber,
          preferredName:data.alias,
          amount:Number(data.amount),
          paymentMethod:data.paymentMethod,
          paymentType:data.paymentType,
          bankCode:data.bankCode,
          transactionRef:this.getRef(12,36),
          saveBeneficiary:false,
          notifyCustomer:true,
          narration:data.narration,
          phoneNumber:data.phoneNumber,
          email:data.email,
          valueDate:data.valueDate
        }
      ]
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.transfer.MakeOnScreenBulk({encryptedData:newBody}).subscribe(
      res =>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.gVars.toastr.success('Payment Initiated Successfully')
          setTimeout(() => {
              window.location.reload()
          }, 1500);
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage,'Please try again')
        }
      },
      err=>{
        this.gVars.spinner.hide();
        this.gVars.toastr.error('Unable to complete that request','Redirecting...')
        setTimeout(() => {
          this.gVars.router.navigate(['/auth/login'])
        }, 1500);
      }
      
    )
  }

  getRef(len, bits) {
    bits = bits || 36;
    var outStr = "", newStr;
    while (outStr.length < len)
    {
        newStr = Math.round(Date.now() + Math.random()).toString(bits).slice(2);
        outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
    }
    return outStr.toUpperCase();
    }

  minDate()
    {
      var dtToday = new Date();
      var month:any = dtToday.getMonth() + 1;
      var day:any = dtToday.getDate();
      var year:any = dtToday.getFullYear();
      if(month < 10)
          month = '0' + month.toString();
      if(day < 10)
          day = '0' + day.toString();
      var maxDate = year + '-' + month + '-' + day; 
      $('#txtDate').attr('min', maxDate);
      this.BeneficiaryForm.get('valueDate').setValue(maxDate)
    } 
GetLocalPayments()
    {
      let body = {
        ...this.userLoad
      }
      let newBody = this.gVars.EncryptData(JSON.stringify(body))
      this.transfer.FetchLocalPayments({encryptedData:newBody}).subscribe(
        res=>{
          let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
          if(decryptedData.Success)
          {
            this.localResponse = decryptedData;
          }
        },
        err=>{
          this.gVars.toastr.error('Unable to load Accounts','Redirecting...')
          this.gVars.spinner.hide()
          setTimeout(() => {
            this.gVars.router.navigate(['/auth/login'])
                   }, 1000);
        }
      )
    }

  ClearData()
  {
    this.BeneficiaryForm.reset()
    $('input[name="method-response"]').prop('checked', false);
    $('input[name="type-response"]').prop('checked', false);
  }
  selectSource(data:any)
  {
    this.BeneficiaryForm.get('accountId').setValue(data.target.value)
  }
  selectMethod(data)
  {
    this.BeneficiaryForm.get('paymentMethod').setValue(data)
  }
  selectType(data)
  {
    this.BeneficiaryForm.get('paymentType').setValue(data)
  }
  formatCurrency_TaxableValue(event)
  {
    if(event.target.value === '')
    return
    var uy = new Intl.NumberFormat('en-US',{style: 'currency', currency:'NGN'}).format(event.target.value);
    this.Amount = uy;
  }

  UploadModal()
  {
    $('#uploadBeneficiary').modal('show')
  }
  

}
