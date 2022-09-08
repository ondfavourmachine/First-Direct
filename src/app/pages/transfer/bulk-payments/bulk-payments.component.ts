import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { TransferService } from 'src/app/core/services/transfer.service';

declare var $: any;
@Component({
  selector: 'app-bulk-payments',
  templateUrl: './bulk-payments.component.html',
  styleUrls: ['./bulk-payments.component.css']
})
export class BulkPaymentsComponent implements OnInit {
  paymentMethods: any;
  sheet: any;
  BulkPaymentForm: FormGroup;
  paymentTypes: any;
  submitted:boolean = false;
  bsValue:Date;
  minDate: Date;
  userLoad:{username:string, subsidiaryId:number,session:string};
  constructor(
    private fb: FormBuilder,
    private transfer: TransferService,
    public gVars: GlobalsService
  ) { 
    this.minDate = new Date();
    this.bsValue = new Date()
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
  }

  ngOnInit(): void {
    // this.getPaymentMethod()
    // this.GetPaymentTypes()
    this.BulkPaymentForm  = this.fb.group({
      narration: ['',],
      paymentMethod: ['',Validators.required],
      document:['',Validators.required],
      valueDate: [this.bsValue,Validators.required],
      filename: [''],
      docExtension: ['',Validators.required],
      paymentType:['', Validators.required],
      validateRecords:[false],
      multipleDebits:[false],
      saveBeneficiary:[false]
    })
  }

  get f() { return this.BulkPaymentForm.controls; }
  getPaymentMethod()
  {
    this.gVars.spinner.show()
    this.transfer.GetPaymentMethod().subscribe(
      res=>{
        this.gVars.spinner.hide()
        if(res)
        {
           this.paymentMethods = res
        }
        else{
          this.gVars.toastr.error(res.responseMessage,'Taking you home...')
          this.gVars.goHome()
        }       
      },
      err=>{
        this.gVars.spinner.hide()
        this.gVars.toastr.error('Unable to fetch Payment Methods','Taking you home...')
        this.gVars.goHome()
      }
    )
  }

  handleUpload(event)
  {
    let accepted = 
    [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]
   
    if(event.target.files[0].size > 5000000)
    {
      this.gVars.toastr.error('File is too large, try again')
      
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
    this.gVars.fileToBase64(file,file).then(result => {
      // get file extension
      const news = result
      let fileExtension = /[.]/.exec(file.name)
        ? /[^.]+$/.exec(file.name)
        : undefined;
      const docByteArray = (<string>news).split(",")[1]; // file
      this.BulkPaymentForm.get('document').setValue(docByteArray);
      this.BulkPaymentForm.get('docExtension').setValue(fileExtension[0])
   });
  }

  selectMethod(data)
  {
    this.BulkPaymentForm.get('paymentMethod').setValue(data)
  }
  selectType(data)
  {
    this.BulkPaymentForm.get('paymentType').setValue(data)
  }
  ProcessDocument(data)
  {
    this.submitted = true;
        // stop here if form is invalid
        if (this.BulkPaymentForm.invalid) {
         this.gVars.toastr.error('Invalid form fields')
            return;
        }
    this.gVars.spinner.show()
    let body = {
      ...this.userLoad,
      ...data,
      fileRef: this.gVars.GenerateRef(12, 36),
      filename:this.sheet
    }
    let payload = {
      ...body,
      valueDate:this.gVars.convertDate(body.valueDate)
    }
    setTimeout(() => {
      this.transfer.InitiateBulk(payload).subscribe(
        res=>{
          this.gVars.spinner.hide()
          if(res.success)
          {
            this.gVars.toastr.success('File Uploaded Successfully','Kindly wait for processing')
            this.BulkPaymentForm.reset();
            this.sheet = ''
            this.submitted = false
            $('input[name="radio-group"]').prop('checked', false);
            setTimeout(() => {
              window.location.reload()
            }, 1500);
          }
          else{
            this.gVars.toastr.error(res.responseMessage,'Please try again')
            this.gVars.goHome()
          }
        },
        err=>{
          this.gVars.spinner.hide()
          this.gVars.toastr.error('Unable to complete that request','Taking you home...')
          this.gVars.goHome()
        }
      )
    }, 2500);
    
  }

  GetPaymentTypes()
  {
    this.transfer.GetPaymentType().subscribe(
      res=>{
        this.paymentTypes = res
      }
    )
  }


  
  validateRecord()
  {
    if ($('#records').is(":checked"))
      {
        this.BulkPaymentForm.get('validateRecords').setValue(true)
      }
      else{
        this.BulkPaymentForm.get('validateRecords').setValue(false)
      }
  }

  enableMulti()
  {
    if ($('#debit').is(":checked"))
    {
      this.BulkPaymentForm.get('multipleDebits').setValue(true)
    }
    else{
      this.BulkPaymentForm.get('multipleDebits').setValue(false)
    }
  }
  saveBene()
  {
    if ($('#saveBene').is(":checked"))
    {
      this.BulkPaymentForm.get('saveBeneficiary').setValue(true)
    }
    else{
      this.BulkPaymentForm.get('saveBeneficiary').setValue(false)
    }
  }

  disableDate()
  {
    return false;
  }


}
