import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { userData } from 'src/app/core/models/userData.model';
import { BeneficiaryService } from 'src/app/core/services/beneficiary';

declare var $:any;
@Component({
  selector: 'app-upload-beneficiary',
  templateUrl: './upload-beneficiary.component.html',
  styleUrls: ['./upload-beneficiary.component.css']
})
export class UploadBeneficiaryComponent implements OnInit,AfterViewInit {
    BeneficiaryForm:FormGroup;
    sheet:any;
    userLoad:{username:string, subsidiaryId:number,session:string};
    constructor(
        private fb: FormBuilder,
        public gVars: GlobalsService,
        private beneficiaryServe: BeneficiaryService
    )
    {
     this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
    }

    ngOnInit(): void {
         this.BeneficiaryForm = this.fb.group({
            attachment: ['',Validators.required],
            attachmentExtension: ['', Validators.required],
            fileRef: [''],
            local_Foreign: true
        })
    }
    ngAfterViewInit(): void {
       
    }

    AddBeneficiary(data)
    {
        this.gVars.spinner.show()
       let payload =
       {
           ...this.userLoad,
           ...data,
       }
       this.beneficiaryServe.UploadBeneficiary(payload).subscribe(
           res=>{
               if(res.success)
               {
                this.gVars.toastr.success(res.responseMessage)
                this.gVars.reloadAfter()
               }
               else{
               this.gVars.goHome(res.responseMessage)
               }
           },
           err=>{
               this.gVars.takeOut()
           }
       )
    }

    ClearData()
    {}

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
        //fileRef  ...personally generated this.gvars.GenerateRef(len,bits)
        this.sheet = event.target.files[0].name
        const file = event.target.files[0];
        this.gVars.fileToBase64(file, file).then(result =>{
            const news = result
            // this.file.name is the name of the uploaded file
            let fileExtension = /[.]/.exec(file.name)
                ? /[^.]+$/.exec(file.name)
                : undefined;
            const docByteArray = (<string>news).split(",")[1]; // file
            this.BeneficiaryForm.get('attachment').setValue(docByteArray);
            this.BeneficiaryForm.get('attachmentExtension').setValue(fileExtension[0])
            this.BeneficiaryForm.get('fileRef').setValue(this.sheet)
        })
    }    
}