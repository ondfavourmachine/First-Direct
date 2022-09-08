import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { userData } from 'src/app/core/models/userData.model';
import { BeneficiaryService } from 'src/app/core/services/beneficiary';
import { PappsService } from 'src/app/core/services/papps.service';

declare var $:any;
@Component({
  selector: 'app-papps',
  templateUrl: './papps.component.html',
  styleUrls: ['./papps.component.css']
})
export class PappsComponent implements OnInit {
  bsValue:any;
  minDate:any;
  userLoad:userData;
  PappsForm:FormGroup;
  localResponse: any;
  submitted:boolean;
  PaymentMethod:[];
  Amount:any;
  PappsBank: any;
  currency:any = '';
  charge: any;
  rate: any;
  Details:any;
  amount: any;
  sourceAmount: any;
  rateDescription: any;
  selectedCountry:any = null;
  transactionType: any;
  invoiceType:any;
  isInvoicePayment:boolean;
  rateBody: any;
  chargeBody: any;
  sourceAccountDetails: any;
  constructor(
    private fb: FormBuilder,
    private pappsService: PappsService,
    private benefit: BeneficiaryService,
    private gVars:GlobalsService
  ) {
    this.minDate = new Date();
    this.bsValue = new Date()
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }
  ngOnInit(): void {
    this.GetLocalAccounts(this.userLoad)
    this.PappsForm = this.fb.group({
      sourceAccount:['',Validators.required],
      bankCode:['',Validators.required],
      accountNumber:['',Validators.required],
      paymentMethod:[5],
      beneficiaryBank:['',Validators.required],
      accountName:['',Validators.required],
      sourceAmount:['',Validators.required],
      narration:[''],
      notifyCustomer:[true],
      paymentType:[3],
      saveBeneficiary:[false],
      beneficiaryName:[''],
      mFormReferenceNo:[''],
      trnxType:[''],
      invoiceType:['', Validators.required],
      tradeBackType:['']
    })
    this.fetchPAPSS()
  }

 get f() { return this.PappsForm.controls; }

  selectPaymentType(data)
  {
    this.transactionType = data.target.value
    if(this.transactionType == 'others'){
      this.PappsForm.get('tradeBackType').setValue(null)
    }
    this.PappsForm.get('trnxType').setValue(this.transactionType)
  }
  selectInvoiceType(data)
  {
    this.invoiceType = data.target.value
    this.PappsForm.get('invoiceType').setValue(this.invoiceType)
    console.log('payment', this.invoiceType)
    console.log(this.PappsForm.value)
    if(data.target.value == 'Invoice Payment')
    {
      this.isInvoicePayment =  true
      this.currency = this.selectedCountry.currencyCode
    }
    else{
      this.isInvoicePayment = false
      this.currency = 'NGN'
    }
  }
 

  GetLocalAccounts(data:userData)
  {
    const newBody = this.gVars.EncryptData(JSON.stringify(data))
    this.pappsService.FetchLocalPayments({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide();
        const decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.localResponse = decryptedData;      
          this.PaymentMethod = decryptedData?.PaymentMethod.filter((e)=>{
            return  e.Value === 'PAPSS'
          })
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

  selectSource(data:any)
  {
    const source = JSON.parse(data.target.value)
    this.PappsForm.get('accountId').setValue(source.AccountId)
    this.PappsForm.get('sourceAccount').setValue(source.AccountNumber)
  }
  setSourceAccount(data){
    let value:string = data.target.value
    if(value.length > 9)
    {
      this.gVars.spinner.show()
      let body = {
        session:this.userLoad.session,
        destinationAccount:value,
        destinationBankCode:'011'
      }
      let newBody = this.gVars.EncryptData(JSON.stringify(body))
      this.benefit.ValidateAccount({encryptedData:newBody}).subscribe(
          res=>{
            this.gVars.spinner.hide()
            const decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
            if(decryptedData.Valid && decryptedData.Currency == 'NGN')
            {
              console.log(decryptedData)
              this.sourceAccountDetails = decryptedData
              this.gVars.toastr.success(decryptedData.ResponseMessage, decryptedData.message)
              this.PappsForm.get('sourceAccount').setValue(value)
            console.log(this.PappsForm.value) 
            }
            else{
              this.PappsForm.get('sourceAccount').setValue(null)
              this.gVars.toastr.error('Invalid account', decryptedData.ResponseMessage)
            }
          },
          err=>{
            this.gVars.spinner.hide()
            this.gVars.toastr.error('Unable to complete that request')
          }
      )
    }
  }

  InitiateForm(data:any)
  {
    console.log(data)
    this.submitted = true;
    // stop here if form is invalid
    if (this.PappsForm.invalid) {
     this.gVars.toastr.error('Invalid form fields')
        return;
    }
    if(Number(data.sourceAmount) <= 0 || isNaN(data.sourceAmount))
    {
      this.gVars.toastr.error('Please input a valid amount')
      return
    }
    this.gVars.spinner.show()
    this.getPappsRates(data)
  }

  ExtraData(data)
  {
    this.gVars.spinner.show()
    let body = {
      amount:String(data),
      invoice: this.isInvoicePayment,
      destinationNipCode:this.PappsForm.value.bankCode,
      sourceNipCode:"999011"   
    }
    console.log(body)
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.pappsService.fetchRate({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        console.log(decryptedData)
        if(decryptedData)
        {

          this.rateBody = decryptedData.rateEnquiry
          //this.ReturnCharge(decryptedData.rateEnquiry.sourceAmount, data,decryptedData.rateEnquiry.destinationAmount)
          //this.amount = decryptedData.rateEnquiry.sourceAmount;
          // this.rate = decryptedData.rateEnquiry.rate
          // this.rateDescription = decryptedData.rateEnquiry.description
          //  this.ReturnCharge(this.rate)
         // this.submitData(data,this.amount,decryptedData.rateEnquiry.destinationAmount)
        }
        else{
          this.amount= 0
          this.PappsForm.get('sourceAmount').setValue(null)
          this.gVars.spinner.hide()
          this.gVars.toastr.error('Error fetching rates')
        }
      }
    )
  }

  submitData(data:any)
  {
   let body = {
          ...data,
          accountId:2,
          transactionRef:this.getRef(12,36),
          valueDate:this.gVars.convertDate(new Date()),
          vat:this.chargeBody?.VAT,
          charges:this.chargeBody?.BankFee + this.chargeBody?.PapssFee,
          sourceAmount: this.rateBody?.sourceAmount,
          destinationAmount:Number(this.rateBody?.destinationAmount),
          currency:this.currency,
          rateDescription:this.rateBody?.description,
          currencyCode: this.selectedCountry.currencyCode,
          countryCode: this.selectedCountry.countryCode,
          rate:this.rateBody?.rate,
          isInvoicePayment:this.isInvoicePayment
        } 
      this.Details = {
        Data:body,
        message:'Review Initiation',
        mode:'initiate',
      }
    $('#reviewModal').modal('show')
  }
 
  validateWatch(data)
  {
    let value:string = data.target.value
    if(value.length > 9)
    {
      if(this.PappsForm.value.bankCode)
      {
        let body = {
          session:this.userLoad.session,
          destinationAccount:value,
          destinationBankCode: this.PappsForm.value.bankCode
        }
        this.GetAccountValidity(body)
      } 
    }
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
  StringifyString(data)
  {
    return JSON.stringify(data)
  }
  selectMethod(data)
  {
    console.log(data)
    this.PappsForm.get('paymentMethod').setValue(data)
  }

  selectBank(data){
   
    this.selectedCountry = JSON.parse(data.target.value)
     console.log(this.selectedCountry)
      this.PappsForm.get('beneficiaryBank').setValue(this.selectedCountry.name)
      this.PappsForm.get('bankCode').setValue(this.selectedCountry.nipCode);
      this.currency = this.selectedCountry.currencyCode
      this.validateAccount(this.PappsForm.value.accountNumber)
  }
  formatCurrency_TaxableValue(event:any)
  {
    if(event.target.value === '')
    return
    var uy = new Intl.NumberFormat('en-US',{style: 'currency', currency:this.currency}).format(event.target.value);
    this.Amount = uy;
    this.ExtraData(event.target.value)
  }

  getPappsRates(data)
  {
    let body = {
      amount:this.isInvoicePayment? this.rateBody?.destinationAmount : this.rateBody?.sourceAmount ,
      currency:this.currency  
    }
    console.log(body)
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.pappsService.fetchChargesPapps({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        console.log(decryptedData)
        this.chargeBody = decryptedData;
        this.submitData(data)
      },
      err=>{
         this.gVars.toastr.error('Unable to fetch rates') 
      }
    )
  }
  fetchPAPSS()
  {
    this.pappsService.fetchPappsBank().subscribe(
      res=>{
        this.PappsBank = res
      }
    )
  }

  validateAccount(data)
  {
    {
      let body = {
        session:this.userLoad.session,
        destinationAccount:data,
        destinationBankCode: this.PappsForm.value.bankCode
      }
      console.log(body)
      this.GetAccountValidity(body)
    }
  }
  async GetAccountValidity(data)
  {
    this.gVars.spinner.show()
    let newBody = this.gVars.EncryptData(JSON.stringify(data))
      this.benefit.ValidateAccount({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        console.log(decryptedData)
        if(decryptedData.Valid)
        {
          this.gVars.toastr.success('Account Number Validated Successfully')
          this.PappsForm.get('accountName').setValue(decryptedData.AccountName)
          this.PappsForm.get('beneficiaryName').setValue(decryptedData.BeneficiaryName)
          $('#accountName').attr('disabled','disabled')
        }
        else{
          this.PappsForm.get('accountNumber').setValue('')
          this.PappsForm.get('accountName').setValue('')
          this.PappsForm.get('beneficiaryName').setValue('')
          this.gVars.toastr.error('Invalid Account Number','Please try again')
          this.selectedCountry = null
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
    this.PappsForm.reset()  
    this.submitted = false
   // this.selectedBen = null
    $('input[name="method-response"]').prop('checked', false);
   $('input[name="radio-beneficiary"]').prop('checked', false);
   $('input[name="radio-charge"]').prop('checked', false);
   $('#sourceAcc').prop('selectedIndex',0);
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
  InvoicePaymentToggle()
  {
    if ($('#saveBene').is(":checked"))
    {
     this.PappsForm.get('isInvoicePayment').setValue(true)
    }
    else{
      this.PappsForm.get('isInvoicePayment').setValue(false)
    }
  }


  
}
