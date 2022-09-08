import { Component, Input, OnInit } from '@angular/core';
import { ExcelService } from 'src/app/core/services/excel.service';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GlobalsService } from 'src/app/core/globals/globals.service';

@Component({
  selector: 'app-Corpaccount-reports',
  templateUrl: './account-reports.component.html',
  styleUrls: ['./account-reports.component.css']
})
export class CorporateAccountReportsComponent implements OnInit {
  p:any;
  term:any;
  @Input() Corporate;
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
    if(this.gVars.checkData(this.Corporate))
    {
      return
    }
    const exportFile = this.Corporate.map((res) => {
      return {
        "Account Name": res.AccountName,
        "Account Number": res.AccountNumber,
        "Available Balance": res.AvailableBalance,
        "Ledger Balance": res.LedgerBalance,
        "Overdraft Balance": res.OverDraftBalance,
        "Currency": res.Currency,
        "Organisation Name": res.OrganisationName,
        "Preferred Name": res.PreferredName,
        Status: res.Status,
      };
    });
    this.excel.exportTableElmToExcel(
      exportFile,
      "Corporate Accounts Report-" +
        new Date().toJSON().slice(0, 10).split("-").reverse().join("/")
    );
  }

  convert() {
   if(this.gVars.checkData(this.Corporate))
   {
    return
    } 
    var doc = new jsPDF('l', 'pt', 'a4');
    doc.setFontSize(10);
    const head = [['Account Number','Account Name', 'Organisation Name', 'Preferred Name', 
    'Ledger Balance', 'Available Balance','Overdraft Balance','Currency', 'Status'] ];
    const body = this.Corporate.map((res, index) => {
      return [ res.AccountNumber, res.AccountName, res.OrganisationName, res.PreferredName,
        res.LedgerBalance, res.AvailableBalance, res.OverDraftBalance,res.Currency,res.Status ]
    });
    autoTable(doc, { head: head,
      body: body,
      styles: {
        fontSize: 5,
        font: "helvetica"
      }
    });
    doc.save("Corporate Accounts-Report -" + new Date().toJSON().slice(0, 10).split("-").reverse().join("/") + ".pdf");
  }

}
