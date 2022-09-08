import { Component, Input, OnInit } from '@angular/core';
import { ExcelService } from 'src/app/core/services/excel.service';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GlobalsService } from 'src/app/core/globals/globals.service';

@Component({
  selector: 'app-suspense-reports',
  templateUrl: './suspense-reports.component.html',
  styleUrls: ['./suspense-reports.component.css']
})
export class SuspenseReportsComponent implements OnInit {
  p:any;
  term:any;
  @Input() Suspense;
  constructor(
    private excel: ExcelService,
    private gVars: GlobalsService
  ) { }

  ngOnInit(): void {
  }
  ngOnChanges()
  {
  }

  export()
  {
    
    if(this.gVars.checkData(this.Suspense))
    {
      return
    }
    const exportFile = this.Suspense.map((res) => {
      return {
        "Account Number": res.accountNumber,
        "Company Name": res.companyName,
        "Account Name": res.accountName,
        "Organisation Name":res.organisationName,
        "Available Balnace":res.availableBalance,
        "Currency":res.currency,
        "Status":res.status
      };
    });
    this.excel.exportTableElmToExcel(
      exportFile,
      "Suspense Accounts Report-" +
        new Date().toJSON().slice(0, 10).split("-").reverse().join("/")
    );
  }
  convert() {
    if(this.gVars.checkData(this.Suspense))
    {
      return
    } 
    var doc = new jsPDF('l', 'pt', 'a4');
    doc.setFontSize(10);
    const head = [[ 'Account Number', 'Company Name', 'Account Name', 'Organisation Name', 
     'Available Name', 'Currency', 'Status'] ];
    const body = this.Suspense.map((res, index) => {
      return [ res.accountNumber, res.companyName, res.accountName, res.organisationName,
        res.availableBalance, res.currency, res.status ]
    });
    autoTable(doc, { head: head,
      body: body,
      styles: {
        fontSize: 5,
        font: "helvetica"
      }
    });
    doc.save("Suspense Account-Report -" + new Date().toJSON().slice(0, 10).split("-").reverse().join("/") + ".pdf");
  }

}
