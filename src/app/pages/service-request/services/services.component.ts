import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { RequestService } from 'src/app/core/services/request.service';
import { TransferService } from 'src/app/core/services/transfer.service';
declare var $:any;
@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  requestMode: string;
  requestForm: FormGroup;
  stopForm: FormGroup;
  confirmForm: FormGroup;
  Idtype: any;
  reasons: any;
  localResponse: any;
  numberMode:string
  branches: any;
  chequeTypes: any;
  userLoad: { session: any; username: string; subsidiaryId: any; };
  Details: { action: string; data: any;extra?:any };
  Amount: string;
  constructor(
    public gVars:GlobalsService,
    private fb:FormBuilder,
    private requestService: RequestService,
    private transfer: TransferService,
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      accountId:['',Validators.required],
      noLeaves: ['',Validators.required],
      branchCode: ['',Validators.required],
      // noOfBooklet:['',[Validators.required]],
      chequeTypeId:['',[Validators.required]],
      chequeTypeName:['',[Validators.required]]
    })
    this.stopForm = this.fb.group({
      accountId: ['',Validators.required],
      stopReason: ['',Validators.required],
      chequeNumber:['',Validators.required],
      chequeForm:['',[Validators.required]],
      leafletNo:['']
    })
    this.confirmForm = this.fb.group({
      accountId: ['',Validators.required],
      chequeNumber: ['',Validators.required],
      chequeSecurityNumber: ['',Validators.required],
      chequeAmount:['',Validators.required],
      idType: ['',Validators.required],
      payeeName:['',Validators.required],
      chequeDate: ['',Validators.required]
    })
    this.GetLocalPayments()
  }

  selectType(data)
  {
    this.requestMode = data.target.value
  }

  RequestCheque(data)
  {
    let body = {
      ...this.userLoad,
      ...data,
      accountId: Number(data.accountId),
      noLeaves: Number(data.noLeaves),
      // noOfBooklet:Number(data.noOfBooklet)
    }
    this.Details = {
      action:'request',
      data:body,
      extra: {
        branch: this.filterBranch(data.branchCode)
      }
    }
    $("#serviceModal").modal('show')
  }
  filterBranch(data)
  {
    return this.branches.filter((e) => e.branchCode === data)
  }

  StopCheque(data)
  {
    let body = {
      ...this.userLoad,
      ...data,
      accountId: Number(data.accountId),
      leafletNo:
      [
        (this.numberMode === 'single') ? String(1) : String(data.leafletNo)
      ] 
    }
    this.Details = {
      action:'stop',
      data:body,
      extra:{
        reason: this.filterReason(data.stopReason)
      }
    }
    $("#serviceModal").modal('show')
  }
  filterReason(data)
  {
    return this.reasons.filter((e) => e.refCode == data)
  }

  ConfirmCheque(data)
  {
    let body = {
      ...this.userLoad,
      ...data,
      accountId: Number(data.accountId),
      chequeAmount: Number(data.chequeAmount),
      idType:Number(data.idType),
    }
    this.Details = {
      action:'confirm',
      data:body,
      extra:{
        idType: this.filterIds(data.idType)
      }
    }
    $("#serviceModal").modal('show')
  }

  filterIds(data)
  {
    return this.Idtype.filter((e) => e.id == data)
  }

  GetIdType()
  {
    this.requestService.GetIdType().subscribe(
      res=>{
        this.Idtype = res
      }
    )
  }
  GetStopReason()
  {
    this.requestService.GetStopReason().subscribe(
      res=>{
        this.reasons = res
      }
    )
  }
  GetLocalPayments()
  {
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.transfer.FetchLocalPayments({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide();
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
          this.localResponse = decryptedData;
          this.GetIdType()
          this.GetStopReason()
          this.getBranches()
          this.getChequeType()
        }
        else{
          this.gVars.toastr.error(decryptedData.ResponseMessage,'Redirecting...')
          setTimeout(() => {
            this.gVars.router.navigate(['/'])
          }, 1500);
        }
      },
      err=>{
        this.gVars.toastr.error('Unable to load Accounts','Redirecting...')
        this.gVars.spinner.hide()
        this.gVars.goHome()
      }
    )
  }

  setMissingCheque(data)
  {
    this.numberMode = data.target.value;
    this.stopForm.get('chequeForm').setValue(this.numberMode)
    if(this.numberMode == 'range')
    {
      this.stopForm.get('leafletNo').setValidators([Validators.required])
      this.stopForm.get('leafletNo').updateValueAndValidity()
    }
    else{
      this.stopForm.get('leafletNo').clearValidators()
      this.stopForm.get('leafletNo').updateValueAndValidity()
    }
   
  }

  getBranches()
  {
    this.requestService.GetBranches().subscribe(
      res=>{
        if(res)
        {
          this.branches = res
        } 
      }
    )
  }
  getChequeType()
  {
    let newBody = this.gVars.EncryptData(JSON.stringify(this.userLoad))
    this.requestService.fetchChequeTypes({encryptedData:newBody}).subscribe(
      res=>{
        if(res)
        {
          this.chequeTypes = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        }
        else{
          this.gVars.toastr.error('Unable to fetch cheque types')
        }
      },
      err=>{
        this.gVars.toastr.error('Unable to fetch cheque types')
      }
    )
  }
  selectPickup(event)
  {
    this.requestForm.get('branchCode').setValue(event.target.value)
  }
  selectCheque(data:any)
  {
    let source = JSON.parse(data.target.value)
    this.requestForm.get('chequeTypeId').setValue(source.typeIDField)
    this.requestForm.get('noLeaves').setValue(Number(source.chequeBookSizeField))
    this.requestForm.get('chequeTypeName').setValue(source.chequeTypeField)
  }

  StringifyString(data)
  {
    return JSON.stringify(data)
  }

  formatCurrency_TaxableValue(event)
  {
    var uy = new Intl.NumberFormat('en-US',{style: 'currency', currency:'NGN'}).format(event.target.value);
    this.Amount = uy;
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
  
  selectAccount(data)
  {
    let source = (data.target.value)
    this.stopForm.get('accountId').setValue(source)
    this.confirmForm.get('accountId').setValue(source)
    this.requestForm.get('accountId').setValue(source)
  }

}
