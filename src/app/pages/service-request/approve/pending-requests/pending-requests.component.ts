import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestService } from 'src/app/core/services/request.service';
declare var $:any;
@Component({
  selector: 'app-pending-requests',
  templateUrl: './pending-requests.component.html',
})
export class PendingRequestsComponent implements OnInit, OnChanges {
  Decision: { action: any; data: any; requestType:number};
  p:any;
  term:any;
  ChequeRequests: any;
  mode: string;
  FilterForm:FormGroup;
  userLoad: { session: any; username: string; subsidiaryId: any; };
  constructor(
    private excel: ExcelService,
    private gVars: GlobalsService,
    private fb: FormBuilder,
    private requestService: RequestService
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
   }

  @Input() Details;
  ngOnInit(): void {
    this.FilterForm = this.fb.group({
      ...this.userLoad,
      startDate:['',Validators.required],
      endDate: ['', Validators.required],
      reportPage: true
  })
  }
  ngOnChanges(changes: SimpleChanges): void {
   this.mode =this.Details?.mode
   this.ChequeRequests = this.Details?.ChequeRequests
  }
  

  launchModal(action, data)
  {
    this.Decision = {
      action:action,
      data:data,
      requestType:2
    }
    $('#instructionModal').modal('show')
  }

  export()
  {
    if(this.gVars.checkData(this.ChequeRequests))
    {
      return
    }
    const exportFile = this.ChequeRequests.map((res) => {
      return {
        "Date Added":res.DateAdded,
        "Account Number": res.AccountNumber,
        "Branch Code": res.BranchCode,
        "Initiator": res.Initiator,
        "Cheque Type Name":res.ChequeTypeName,
        "No of Leaves":res.NoLeaves,
        "Approval Status":res.ApprovalStatusString,
      };
    });
    this.excel.exportTableElmToExcel(
      exportFile,
      "Cheque request-Report-" +
        new Date().toJSON().slice(0, 10).split("-").reverse().join("/")
    );
  }
  convert()
  { if(this.gVars.checkData(this.ChequeRequests))
    {
      return
    } 
    var doc = new jsPDF('l', 'pt', 'a4');
    doc.setFontSize(10);
    const head = [['Date Added', 'Account Number', 'Branch Code', 
      'Initiator','Request Status','Approval Status'] ];
    const body = this.ChequeRequests.map((res, index) => {
      return [res.DateAdded, res.AccountNumber, res.BranchCode,
        res.Initiator, res.ChequeTypeName, res.NoLeaves, res.ApprovalStatusString ]
    });
    autoTable(doc, { head: head,
      body: body,
      styles: {
        fontSize: 5,
        font: "helvetica"
      }
    });
    doc.save("Cheque request-Report -" + new Date().toJSON().slice(0, 10).split("-").reverse().join("/") + ".pdf");
 }
  castMode(data:string)
  {
    if(data === 'pending')
    {
      return ''
    }
    else{
      return 'Report'
    }
  }
  FilterReports(data:any)
  {
    this.gVars.spinner.show()
    let body = {
      ...data,
      startDate: this.gVars.convertDate(data.startDate),
      endDate: this.gVars.convertDate(data.endDate)
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body))
    this.requestService.GetReports({encryptedData:newBody}).subscribe(
      res=>{
        this.gVars.spinner.hide()
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
        {
         this.ChequeRequests =  decryptedData.ChequeRequests
        }
        else{
          this.gVars.goHome()
        }
      },
      err=>{
        this.gVars.spinner.hide()
        this.gVars.takeOut()
      }
    )
  }
}
