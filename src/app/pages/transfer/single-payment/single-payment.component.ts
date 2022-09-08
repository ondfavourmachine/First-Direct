import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { BeneficiaryService } from 'src/app/core/services/beneficiary';
import { TransferService } from 'src/app/core/services/transfer.service';
declare var $:any;
@Component({
  selector: 'app-single-payment',
  templateUrl: './single-payment.component.html',
  styleUrls: ['./single-payment.component.css']
})
export class SinglePaymentComponent implements OnInit {
  localResponse: any;
  SingleForm: FormGroup;
  beneficiaryType:string;
  BeneficiaryList = []
  availableAcc: any;
  p:any;
  term:any
  addBeneficiaryDetails: boolean;
  submitted: boolean = false;
  charge: any;
  selectedBen: any;
  Amount: string;
  payApproved: boolean = false;
  bsValue:Date;
  datePickerValue: Date = new Date();
  minDate: Date;
  userLoad:{username:string, subsidiaryId:number,session:string};
  constructor(
    private fb: FormBuilder,
    private transfer: TransferService,
    private benefit: BeneficiaryService,
    private gVars:GlobalsService
  ) {
    this.minDate = new Date();
    this.bsValue = new Date()
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }

  ngOnInit(): void {

    this.SingleForm = this.fb.group({
      narration:[''],
      paymentType:['', Validators.required],
      valueDate:[this.bsValue, Validators.required],
      paymentMethod: ['', Validators.required],
      accountId: ['',[Validators.required] ],
      amount:['',Validators.required],
      saveBeneficiary:[false],
      bankCode:['', Validators.required],
      accountNumber:['',Validators.required],
      transactionRef:[''],
      notifyCustomer:[true],
      alias:[''],
      phoneNumber:[''],
      email:[''],
      beneficiary:[''],
      beneficiaryName:[''],
      accountName: [''],
      sourceAccount:[''],
      bankName:[''],
    })
    this.GetLocalPayments()
    // $('[data-toggle="tooltip"]').tooltip()
    this.payApproved = JSON.parse(this.gVars.DecryptData(sessionStorage.getItem('scribbl'))).PayOnlyApprovedBeneficiaries
  }
 get f() { return this.SingleForm.controls; }
  GetLocalPayments()
  {
    this.gVars.spinner.show()
    let newBody = this.gVars.EncryptData(JSON.stringify(this.userLoad))
    this.transfer.FetchLocalPayments({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide();
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.localResponse = decryptedData;
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage,'Redirecting...')
          this.gVars.goHome()
        }
      },
      err=>{
        this.gVars.toastr.error('Unable to load Accounts','Redirecting...')
        this.gVars.spinner.hide()
        this.gVars.goHome();
      }
    )
  }
  getRef(len, bits) {
    let str = new Date()
    let num=  Math.floor(100000000 + Math.random() * 900000000);
    bits = bits || 36;
    var outStr = "", newStr;
    while (outStr.length < len)
    {
        newStr = Math.round(Date.now() + Math.random()).toString(bits).slice(2);
        outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
    }
    return 'FDD20'+num+outStr.toUpperCase()+str.getFullYear()+''+str.getHours()+''+str.getMinutes()+''+str.getSeconds();
    }

  setBeneficiary(data)
    {
      this.beneficiaryType = data;
      if(data === 'self')
      {
       this.getMyAccounts() 
      }
    }
  getMyAccounts()
  {
    var account = this.SingleForm.value.accountId;
      //remove selected, just 1 element
    var transAccounts = this.localResponse.Accounts.filter(function (e) {
      return e.AccountId != account;
    });
    this.availableAcc = transAccounts;
  }

  AddBeneficiary(data)
    {
      this.submitted = true;
        // stop here if form is invalid
        if (this.SingleForm.invalid) {
         this.gVars.toastr.error('Invalid form fields')
            return;
        }
        if(Number(data.amount) <= 0 || isNaN(data.amount))
        {
          this.gVars.toastr.error('Please input a valid amount')
          this.gVars.spinner.hide()
          return
        }
      this.gVars.spinner.show()
      this.ReturnCharge(data)
      setTimeout(() => {
                let body = {
              accountId: Number(data.accountId),
              accountNumber: data.accountNumber,
              preferredName:data.alias,
              amount:Number(data.amount),
              paymentMethod:data.paymentMethod,
              paymentType:data.paymentType,
              bankCode:data.bankCode,
              transactionRef:this.getRef(12,36),
              saveBeneficiary:data.saveBeneficiary,
              notifyCustomer:true,
              narration:data.narration,
              phoneNumber:data.phoneNumber,
              email:data.email,
              valueDate:data.valueDate,
              sourceAccount:data.sourceAccount,
              bankName:data.bankName,
              charges:this.charge
        }    
        if(this.BeneficiaryList.length > 10)
        {
          this.gVars.toastr.error('You cannot add more than 10 Beneficiaries','Kindly use bulk payments')
          return
        }
      this.convertDate(body.valueDate)
      this.BeneficiaryList.push(body)
      this.SingleForm.reset()
      this.submitted = false
      this.selectedBen = null
      $('input[name="method-response"]').prop('checked', false);
      $('input[name="type-response"]').prop('checked', false);
      $('input[name="radio-beneficiary"]').prop('checked', false);
      $('#sourceAcc').prop('selectedIndex',0);
      this.beneficiaryType = ''
      this.SingleForm.get('saveBeneficiary').setValue(false)
      this.gVars.toastr.success('Transaction added to Queue')
      }, 1500);

    }

    selectBeneficiary(data)
    {
      let parsedUser  = JSON.parse(data.target.value)
      this.SingleForm.get('bankName').setValue(parsedUser.BankName)
      this.SingleForm.get('bankCode').setValue(parsedUser.BankCode);
      this.SingleForm.get('accountNumber').setValue(parsedUser.AccountNumber)
      this.SingleForm.get('alias').setValue(parsedUser.Alias)
      this.SingleForm.get('email').setValue(parsedUser.Email)
      this.SingleForm.get('phoneNumber').setValue(parsedUser.PhoneNumber)    
      this.selectedBen = parsedUser
    }
    selfBeneficiary(data)
    {
      let parsedUser  = JSON.parse(data.target.value)
      this.SingleForm.get('bankName').setValue('First Bank');
      this.SingleForm.get('bankCode').setValue('011');
      this.SingleForm.get('accountNumber').setValue(parsedUser.AccountNumber)
      this.SingleForm.get('alias').setValue(parsedUser.AccountName)
    }
    newBeneficiaryBank(data)
    {
      let parsedUser  = JSON.parse(data.target.value)
      this.SingleForm.get('bankName').setValue(parsedUser.BankName)
      this.SingleForm.get('bankCode').setValue(parsedUser.BankCode);
      this.validateAccount(this.SingleForm.value.accountNumber)
      //this.SingleForm.get('accountNumber').setValue(parsedUser.accountNumber)
    }
    selectSource(data:any)
    {
      let source = JSON.parse(data.target.value)
      this.SingleForm.get('accountId').setValue(source.AccountId)
      this.SingleForm.get('sourceAccount').setValue(source.AccountNumber)
    }
    selectMethod(data)
    {
      this.SingleForm.get('paymentMethod').setValue(data)
    }
    selectType(data)
    {
      this.SingleForm.get('paymentType').setValue(data)
    }

    StringifyString(data)
    {
      return JSON.stringify(data)
    }
    SaveBeneficiary()
    {
      if ($('#saveBene').is(":checked"))
          {
           this.SingleForm.get('saveBeneficiary').setValue(true)
          }
          else{
            this.SingleForm.get('saveBeneficiary').setValue(false)
          }
    }


    validateAccount(data)
    {
      {
        let body = {
          session:this.userLoad.session,
          destinationAccount:data,
          destinationBankCode: this.SingleForm.value.bankCode
        }
        this.GetAccountValidity(body)
      }
    }

    validateWatch(data)
    {
      let value:string = data.target.value
      if(value.length > 9)
      {
        if(this.SingleForm.value.bankCode)
        {
          let body = {
            session:this.userLoad.session,
            destinationAccount:value,
            destinationBankCode: this.SingleForm.value.bankCode
          }
          this.GetAccountValidity(body)
        }
        
      }
    }
  
    convertDate(data)
    {
      var dtToday = new Date(data);
      var month:any = dtToday.getMonth() + 1;
      var day:any = dtToday.getDate();
      var year:any = dtToday.getFullYear();
      if(month < 10)
          month = '0' + month.toString();
      if(day < 10)
          day = '0' + day.toString();
      var formattedDate = year + '-' + month + '-' + day; 
      return formattedDate
    }
  
   async GetAccountValidity(data)
    {
      this.gVars.spinner.show()
      let newBody = this.gVars.EncryptData(JSON.stringify(data))
      await this.benefit.ValidateAccount({encryptedData:newBody}).subscribe(
        res=>{
          this.gVars.spinner.hide()
          let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
          if(decryptedData.Valid && decryptedData.Currency === 'NGN')
          {
            this.gVars.toastr.success('Account Number Validated Successfully')
            this.SingleForm.get('accountName').setValue(decryptedData.AccountName)
            $('#accountName').attr('disabled','disabled')
          }
          else{
            this.SingleForm.get('accountNumber').setValue('')
            this.SingleForm.get('accountName').setValue('')
            this.SingleForm.get('beneficiaryName').setValue('')
            this.gVars.toastr.error('Invalid Account Number','Please try again')
          }
        },
        err=>{
          this.gVars.spinner.hide();
          this.gVars.toastr.error('Unable to complete that request','Redirecting...')
          setTimeout(() => {
            this.gVars.router.navigate(['/auth/login']);
          }, 1500);
        }
      )
    }

    ResetForm()
    {
      this.SingleForm.reset()  
      this.submitted = false
      this.selectedBen = null
      $('input[name="method-response"]').prop('checked', false);
     $('input[name="type-response"]').prop('checked', false);
     $('input[name="radio-beneficiary"]').prop('checked', false);
     $('input[name="radio-charge"]').prop('checked', false);
     $('#sourceAcc').prop('selectedIndex',0);
    }
    
    
    ReturnCharge(data)
    {
      let body = {
        ...this.userLoad,
        bankCode:data.bankCode,
        accountNumber: data.accountNumber,
        amount: Number(data.amount),
        paymentMethod: data.paymentMethod,
        paymentType: data.paymentType,
      }
      let newBody = this.gVars.EncryptData(JSON.stringify(body))
      this.transfer.getCharges({encryptedData:newBody}).subscribe(
        res=>{
          this.gVars.spinner.hide()
          let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
          if(decryptedData.Success)
          {
            this.charge = decryptedData.Charges
          }
          else{
            this.gVars.toastr.error('Unable to retrieve charges')
            this.gVars.goHome()
          }       
        }
      )
    }

formatCurrency_TaxableValue(event)
  {
    if(event.target.value === '')
    return
    var uy = new Intl.NumberFormat('en-US',{style: 'currency', currency:'NGN'}).format(event.target.value);
    this.Amount = uy;
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
}
