import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ExcelService } from 'src/app/core/services/excel.service';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { RequestService } from 'src/app/core/services/request.service';

declare var $:any;
@Component({
  selector: 'app-pending-stops',
  templateUrl: './pending-stops.component.html',
})
export class PendingStopsComponent implements OnInit, OnChanges {
  Decision: { action: any; data: any;requestType:number };
  p:any;
  term:any;
  ChequeStops: any;
  FilterForm:FormGroup
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
   this.ChequeStops = this.Details?.ChequeStops
  }
  launchModal(action, data)
  {
    this.Decision = {
      action:action,
      data:data,
      requestType:4
    }
    $('#pendingModal').modal('show')
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

  export()
  {
    if(this.gVars.checkData(this.ChequeStops))
    {
      return
    }
    const exportFile = this.ChequeStops.map((res) => {
      return {
        "Date Added": res.DateAdded,
        "Leaflet Number": res.LeafletNos,
        "Stop Reason": res.StopReason,
        "Cheque Number": res.ChequeNumber,
        "Cheque Form":res.ChequeForm,
        "Initiator":res.Initiator,
        "Approval Status":res.ApprovalStatusString,
        "Request Status":res.RequestStatus
      };
    });
    this.excel.exportTableElmToExcel(
      exportFile,
      "Cheque stop-Report-" +
        new Date().toJSON().slice(0, 10).split("-").reverse().join("/")
    );
  }
  convert() {
    if(this.gVars.checkData(this.ChequeStops))
    {
      return
    } 
    var doc = new jsPDF('l', 'pt', 'a4');
    doc.setFontSize(10);
    const head = [['s/n', 'Date Added', 'Leaflet Number', 'Stop Reason', 'Cheque Number', 
     'Cheque Form', 'Initiator', 'Approval Status','Request Status'] ];
    const body = this.ChequeStops.map((res, index) => {
      return [
        index + 1, res.DateAdded, res.LeafletNos, res.StopReason, res.ChequeNumber,
        res.ChequeForm, res.Initiator, res.ApprovalStatusString, res.RequestStatus ]
    });
    autoTable(doc, { head: head,
      body: body,
      styles: {
        fontSize: 5,
        font: "helvetica"
      }
    });
    doc.save("Cheque stop-Report -" + new Date().toJSON().slice(0, 10).split("-").reverse().join("/") + ".pdf");
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
          this.ChequeStops =  decryptedData.ChequeStops
        }else{
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