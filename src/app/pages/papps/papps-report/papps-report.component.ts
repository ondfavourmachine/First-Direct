import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { PappsService } from 'src/app/core/services/papps.service';
import { environment } from 'src/environments/environment';

import { ExcelService } from 'src/app/core/services/excel.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

declare var $:any
@Component({
  selector: 'app-papps-report',
  templateUrl: './papps-report.component.html',
  styleUrls: ['./papps-report.component.css']
})
export class PappsReportComponent implements OnInit {
  userLoad: { session: any; username: string; subsidiaryId: any; };
  FilterForm: any;
  PaymentList:Array<any> = [];
  localAccounts: any;
  Details: { action: string; Data: string; mode: string; message: string; };
  term:any;
  p:any;
  constructor(
    private gVars:GlobalsService,
    private fb: FormBuilder,
    private PappsService: PappsService,
    private excel: ExcelService,
  ) { 
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
  }

  ngOnInit(): void {
    this.GetForeignList()
    this.FilterForm = this.fb.group({
        ...this.userLoad,
        startDate:['',Validators.required],
        endDate: ['', Validators.required],
        reportPage: true
    })
  }

  GetForeignList()
{
    this.gVars.spinner.show()
    var mytoday = new Date();
    var firstDay = new Date(mytoday.getFullYear(), mytoday.getMonth(), 1);
    var startDate = firstDay.toISOString().slice(0,10);
    var endDate =  mytoday.toISOString().slice(0,10); 
    let payload = 
    {
        ...this.userLoad,
        startDate:startDate,
        endDate:endDate,
        reportPage: true
    }
    console.log(payload)
    let newBody = this.gVars.EncryptData(JSON.stringify(payload))
    this.PappsService.fetchPaymentList({encryptedData:newBody}).subscribe(
        res=>{
            this.gVars.spinner.hide()
            let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
            if(decryptedData.Success)
           {
               this.localAccounts = decryptedData.Accounts
               this.PaymentList = decryptedData.Payments
           }
           else{
             this.gVars.goHome()
           }
        },
        err=>{
          this.gVars.takeOut()
        }
    )
}

ShowData(data:string, action:string)
{
    this.Details = {
        action:action,
        Data:data,
        mode:'', 
        message:'Review Decision'
      }
    $("#foreignModal").modal('show') 
}


refreshBatch()
{
  this.GetForeignList()
}
FilterReports(data)
{
  this.gVars.spinner.show()
  let body = {
    ...data,
    startDate: this.gVars.convertDate(data.startDate),
    endDate: this.gVars.convertDate(data.endDate)
  }
  let newBody = this.gVars.EncryptData(JSON.stringify(body))
  this.PappsService.fetchPaymentList({encryptedData:newBody}).subscribe(
      res=>{
          this.gVars.spinner.hide()
          let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if(decryptedData.Success)
          {
            this.PaymentList = decryptedData.Payments 
          }
          else{
             this.gVars.goHome()
          }
      },
      err=>{
        this.gVars.takeOut()
      }
  )
}

DownloadReceipt(item)
{ 
 this.gVars.toastr.info('Generating receipt...')
 window.open(environment.devUrl.transService+'Payment/DownloadLocalSingleReceipt/'+this.userLoad.session+'/'+this.userLoad.username+'/'+item.Id, '_blank')
}  

ConfirmPAPPS(data)
{
  console.log(data)
  const newBody =  this.gVars.EncryptData(JSON.stringify(data.transactionRef))
  this.PappsService.confirmPappsTransaction({encryptedData:newBody}).subscribe(
    res=>{
      this.gVars.spinner.hide()
      let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
      if(decryptedData.Success)
      {
        this.gVars.toastr.success(decryptedData.description,)
      }else{
        this.gVars.toastr.error(decryptedData.ResponseMessage, 'Taking you home...')
          this.gVars.goHome()
      }
    },
    err=>{
      this.gVars.spinner.hide();
      this.gVars.toastr.error('Unable to complete that request','Redirecting...')
      this.gVars.goHome()
    }
  )
}

exportPdf()
{
  if(this.gVars.checkData(this.PaymentList))
  {

    return
  } 
  var doc = new jsPDF('l', 'pt', 'a4');
  doc.setFontSize(10);
  const head = [['Payment Date','Request Date', 'Reference No.', 'Subsidiary', 'Initiator','Source Account No.', 
   'Beneficiary Account No.','Beneficiary Bank','Source Amount','Destination Amount','Currency','Charges','Rate','Narration','Payment Type','Payment Mode','Transaction Type','Payment Status','Payment Method','Payment Remark'] ];
  const body = this.PaymentList.map((res) => {
    return [res.DateProcessed,res.RequestDate, res.MFormReferenceNo, res.SubsidiaryName,res.Initiator, res.SourceAccount,
      res.AccountNumber,res.BeneficiaryBank,res.Amount,res.DestinationAmount,res.CurrencyCode, res.Charges,res.Rate, res.Narration,this.castInvoice(res.IsInvoicePayment),res.TradeBackType,res.TrnxType,res.PaymentStatus, res.PaymentMethod,res.PaymentRemark]
  });
  autoTable(doc, { head: head,
    body: body,
    styles: {
      fontSize: 5,
      font: "helvetica"
    }
  });
  doc.save("Transaction-Reports -" + new Date().toJSON().slice(0, 10).split("-").reverse().join("/") + ".pdf");

}
exportCsv()
{
  if(this.gVars.checkData(this.PaymentList)) 
   {
     return
   }
    const exportFile = this.PaymentList.map((res) => {
      return {
        "Payment Date": res.DateProcessed,
        "Request Date": res.RequestDate,
        "Reference No.": res.MFormReferenceNo,
        "Subsidiary": res.SubsidiaryName,
        "Initiator":res.Initiator,
        "Source Account Number": res.SourceAccount,
        "Beneficiary Account Number":res.AccountNumber,
        "Source Amount":res.Amount,
        "Destination Amount": res.DestinationAmount,
        "Charges": res.Charges,
        "Currency": res.CurrencyCode,
        "Rate":res.Rate,
        "Rate Description":res.RateDesp,
        "Transaction Type":res.TrnxType,
        "Beneficiary":res.BeneficiaryName,
        "Narration":res.Narration,
        "Payment Method":res.PaymentMethod,
        "Payment Status":res.PaymentStatus,
        "Payment Remark":res.PaymentRemark,
        "Payment Mode":res.TradeBackType,
        "Payment Type ":this.castInvoice(res.IsInvoicePayment),
        "Approval Status": res.ApprovalStatus,
        'Beneficiary Bank':res.BeneficiaryBank
      };
    });
    this.excel.exportTableElmToExcel(
      exportFile,
      "Papps-Reports-" +
        new Date().toJSON().slice(0, 10).split("-").reverse().join("/")
    );
}
castInvoice(data)
{
  return data == true ? 'Invoice Payment' : 'Direct Payment';
}

}
