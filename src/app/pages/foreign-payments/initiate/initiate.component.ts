import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { userData } from 'src/app/core/models/userData.model';
import { ForeignService } from 'src/app/core/services/foreign.service';
declare var $:any
@Component({
  selector: 'app-initiate',
  templateUrl: './initiate.component.html',
  styleUrls: ['./initiate.component.css']
})
export class InitiateComponent implements OnInit, OnDestroy {
  ForeignForm: FormGroup;
  localResponse: any;
  pageName:string = '1'
  beneficiaryType:string;
  currency:string;
  Amount: string = '0';
  hasIntermediary:boolean  = false;
  saveIntermediaryBank: boolean = false;
  chargeBeneficiary: boolean = false;
  saveBeneficiary: boolean = false;
  isOthers:boolean = true;
  sheet: any;
  selectedBeneficiary: any;
  Details: {Data:any, message:any, mode:string, charge:any}
  submitted: boolean = false;
  userLoad: userData;
  rvCur:string= '';
  isUSD:boolean = false;
  BeneficaryBanks:[];
  SwiftCodes:[];
  notOnList: boolean = false;
  constructor(
    public gVars: GlobalsService,
    private  foreign: ForeignService,
    private fb: FormBuilder
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }

  ngOnInit(): void {
    this.GetForeignPayments()
    this.ForeignForm = this.fb.group({
      accountId: ['', Validators.required],
      receivingBank:['',[Validators.required, Validators.minLength(3)]],
      accountNumber:['',[Validators.required]],
      amount:['',[Validators.required]],
      beneficiary:['',[Validators.required,Validators.minLength(3)]],
      beneficiaryAddress:['',[Validators.required]],
      intermediaryBankName:[''],
      intermediaryBankAddress:[''],
      intermediarySortCode:[''],
      intermediarySwiftCode:[''],
      intermediaryAccountNumber:[''],
      purposeOfPayment:['',[Validators.required]],
      sortCode:['',[Validators.required,Validators.minLength(3)]],
      swiftCode:['',[Validators.required,Validators.minLength(3)]],
      docExtension:['',[Validators.required]],
      docByteArray:['',[Validators.required]],
      currency:[''],
      country:[''],
      countryCode:[''],
      purposeDescription:['',[Validators.minLength(3),Validators.required]]
    })
    this.gVars.toastr.info('Please note that you assume responsibility for the data provided on this transaction.FirstBank will not be held liable for any loss incurred as a result of incorrect data provided','',{
      disableTimeOut:true,
    })
  }
  ngOnDestroy(): void {
    this.gVars.toastr.clear()
  }
  get f() { return this.ForeignForm.controls; }
  GetForeignPayments()
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad 
    }
    console.log(body)
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.foreign.GetForeignPayments({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        console.log(decryptedData)
        if(decryptedData.Success)
        {
         this.localResponse = decryptedData 
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage,'Redirecting...')
        //  this.gVars.goHome()
        }
      }
    )
  }

  selectSource(data)
  {
    const parsedSource =  JSON.parse(data.target.value)
    this.currency = parsedSource.Currency
    this.ForeignForm.get('accountId').setValue(parsedSource.AccountId)
    this.ForeignForm.get('currency').setValue(parsedSource.Currency)
    if(parsedSource.Currency == 'GBP' || parsedSource.Currency == 'EUR')
    {
      this.isUSD = false
    }
    else{
      this.isUSD  =  true
    }
  }

  SelectCountry(data)
  {
    this.gVars.spinner.show()
    setTimeout(() => {
      this.gVars.spinner.hide()
    }, 1500);
    const parsedSource =  JSON.parse(data.target.value)
    //this.currency = parsedSource.Currency
    this.ForeignForm.get('country').setValue(parsedSource.Value)
    this.ForeignForm.get('countryCode').setValue(parsedSource.Id)
    this.BeneficaryBanks = this.localResponse.BankList.filter(e => e.BankCode ===  parsedSource.Value)
    $('#swiftSelection').prop('selectedIndex',0);
  }
  SelectBank(data)
  {
    const parsedSource =  JSON.parse(data.target.value)
    console.log(parsedSource)
    this.ForeignForm.get('receivingBank').setValue(parsedSource.BankName)
    if(parsedSource.BankName == 'FIRST BANK NIGERIA PLC')
    {
      this.newBeneficiaryBank(parsedSource.BankName)
    }
    this.fetchBIC(parsedSource.BankName)
    this.ForeignForm.get('swiftCode').setValue('')
  }
  fetchBIC(institutionName)
  {
    this.gVars.spinner.show()
    let country = (this.ForeignForm.get('country').value)
    let data = {
      country:country,
      institutionName: institutionName
    }
    this.foreign.getBIC(data).subscribe(
      (res:any)=>{
        this.gVars.spinner.hide()
        if(res)
        {
          this.SwiftCodes= res
        }
      },
      err=>{
        this.gVars.spinner.hide()
        this.gVars.toastr.error('Unable to fetch BIC')
      }
    )
  }
  SelectSwift(data)
  {
    const parsedSource =  JSON.parse(data.target.value)
    
    if(parsedSource == 'notOnList')
    {
      this.ForeignForm.get('swiftCode').setValue('')
      this.notOnList = true
      return
    }
    this.notOnList = false
    this.ForeignForm.get('swiftCode').setValue(parsedSource.unQ_BANK_IDENTIFIER)
    this.ForeignForm.get('beneficiaryAddress').setValue(parsedSource?.addresS_1 )
  }

  StringifyString(data)
  {
    return JSON.stringify(data)
  }
  setBeneficiary(data)
  {
    this.beneficiaryType = data
  }

  selectPurpose(data)
  {
    const parsedPurp = JSON.parse(data.target.value)
    this.ForeignForm.get('purposeOfPayment').setValue(parsedPurp.ID)
  }

  newBeneficiaryBank(data)
  {
    //const parsedBank = JSON.parse(data.target.value)
    let payload = {
      session:this.userLoad.session,
      destinationAccount:this.ForeignForm.get('accountNumber').value,
      destinationBankCode:'011152303'
    }
    if(data === 'FIRST BANK NIGERIA PLC')
    {
     return this.validateAccountNumber(payload)
    }
    this.isOthers = !this.isOthers
    this.rvCur = ''
  }
  validateAccountNumber(data:any,bankName?:string)
  {
    this.gVars.spinner.show()
    let newBody = this.gVars.EncryptData(JSON.stringify(data))
    this.foreign.validateAccount({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        console.log(decryptedData)
        if(decryptedData.Valid)
        {
          if(decryptedData.Currency !== this.currency)
          {
            this.gVars.toastr.error('Cross currency not allowed')

            setTimeout(() => {
              this.ForeignForm.get('accountNumber').setValue('')
              $('#inlineFormCustomSelect').prop('selectedIndex',0);
            }, 900);
          }else{
            this.gVars.toastr.success(decryptedData.ResponseMessage)
            this.ForeignForm.get('beneficiary').setValue(decryptedData.AccountName)
           // this.ForeignForm.get('receivingBank').setValue(bankName)
            this.rvCur = res.currency
          }          
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage)
          this.ForeignForm.get('accountNumber').setValue('')
          $('#inlineFormCustomSelect').prop('selectedIndex',0);
        }
      }
    )
  }
 

  formatCurrency(event)
  {
    var uy = new Intl.NumberFormat('en-US',{style: 'currency', currency:this.currency}).format(event.target.value);
    this.Amount = uy;
  }

  extraChecks(data)
  {
    switch(data)
    {
      case 'intermediary':
            return this.hasIntermediary = !this.hasIntermediary
        break;
      case 'saveIntermediary':
            return this.saveIntermediaryBank = !this.saveIntermediaryBank
        break
      case 'saveBeneficiary':
            return this.saveBeneficiary = !this.saveBeneficiary
        break
      case 'chargeBeneficiary':
            return this.chargeBeneficiary = !this.chargeBeneficiary
        break
    }
  }

 makeForeignPayment(data)
  {
    console.log(this.ForeignForm.value)
    this.submitted = true;
    // stop here if form is invalid
    if (this.ForeignForm.invalid) {
     this.gVars.toastr.error('Invalid form fields')
        return;
    }
    if(Number(data.amount) <= 0 || isNaN(data.amount))
    {
      this.gVars.toastr.error('Please input a valid amount')
      this.gVars.spinner.hide()
      return
    }
    data.amount = Number(data.amount)
    let body = {
      ...this.userLoad,
      ...data,
      hasIntermediary:this.hasIntermediary,
      saveBeneficiary: this.saveBeneficiary,
      saveIntermediaryBank: this.saveIntermediaryBank,
      chargeBeneficiary: this.checkChargeBearer(this.chargeBeneficiary),
      transactionRef: this.gVars.getRef(18,36)
    }
    this.Details = {
      Data:body,
      message:'Review Initiation',
      mode:'initiate',
      charge:'this.getCharges(data)'
    }
    console.log(body)
    $('#foreignModal').modal('show')
  }

  checkChargeBearer(data:boolean)
  {
    if(!this.isUSD)
    {
      return true
    }
    else{
       return data
    }
  }
  selectBeneficiary(data)
  {
    const parsedBeneficiary = JSON.parse(data.target.value)
    if(parsedBeneficiary.BANK_NAME == 'FIRST BANK NIGERIA PLC')
    {
        if(parsedBeneficiary.Currency !== this.currency) {
          this.gVars.toastr.error('Cross currency is not allowed','Please select matching currency')
          return
        }
    }
   
    this.selectedBeneficiary = parsedBeneficiary
    this.ForeignForm.get('accountNumber').setValue(parsedBeneficiary.ACCOUNT_IBAN)
    this.ForeignForm.get('beneficiaryAddress').setValue(parsedBeneficiary.BENEFICIARY_ADDRESS)
    this.ForeignForm.get('beneficiary').setValue(parsedBeneficiary.BENEFICIARY_NAME)
    this.ForeignForm.get('swiftCode').setValue(parsedBeneficiary.SWIFTCODE)
    this.ForeignForm.get('sortCode').setValue(parsedBeneficiary.ROUTING_SORTCODE)
    this.ForeignForm.get('receivingBank').setValue(parsedBeneficiary.BANK_NAME)
  }

  handleUpload(event)
  {
    let accepted = 
    [
      'application/pdf',
    ]
   
    if(event.target.files[0].size > 5000000)
    {
      this.gVars.toastr.error('File is too large, try again')
      return
    }
    if(!accepted.includes(event.target.files[0].type))
    {
      this.gVars.toastr.error('Invalid File')
      return
    } 
    var reader = new FileReader()
    reader.readAsDataURL(event.target.files[0])
    this.sheet = event.target.files[0].name
    const file = event.target.files[0];
    let fileToBase64 = (filename, filepath) => {
      return new Promise(resolve => {
        var file = new File([filename], filepath);
        var reader = new FileReader(); // Read file content on file loaded event
        reader.onload = function(event) {
          resolve(event.target.result);
        };
        reader.readAsDataURL(file);
      });
    };
    fileToBase64(file,file).then(result => {
      // get file extension
      const news = result
      let fileExtension = /[.]/.exec(file.name)
        ? /[^.]+$/.exec(file.name)
        : undefined;
      const docByteArray = (<string>news).split(",")[1]; // file
      this.ForeignForm.get('docByteArray').setValue(docByteArray);
      this.ForeignForm.get('docExtension').setValue(fileExtension[0])
   });
  }

  selectIntermediary(event)
  {
    if(event.target.value === 'Others')
    {
      return
    }
    const parsedBeneficiary = JSON.parse(event.target.value)
    this.ForeignForm.get('intermediaryAccountNumber').setValue(parsedBeneficiary.AccountNumber)
    this.ForeignForm.get('intermediaryBankAddress').setValue(parsedBeneficiary.BankAddress)
    this.ForeignForm.get('intermediaryBankName').setValue(parsedBeneficiary.BankName)
    this.ForeignForm.get('intermediarySwiftCode').setValue(parsedBeneficiary.SwiftCode)
    this.ForeignForm.get('intermediarySortCode').setValue(parsedBeneficiary.SortCode)
  }
  getCharges(data)
  {
    const chargeData = {
      currency:data.currency,
      amount:data.amount,
      chargeBeneficiary:data.chargeBeneficiary,
    } 
    return this.foreign.getCharges(chargeData).subscribe(
      res=>{
         res
       //return this.charge = res
      }
    )
  }


}