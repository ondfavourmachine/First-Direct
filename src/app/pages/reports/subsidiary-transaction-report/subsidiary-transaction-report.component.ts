import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

import { CollectionsService } from 'src/app/core/services/collections.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { environment } from 'src/environments/environment';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { userData } from 'src/app/core/models/userData.model';
// const doc = new jsPDF();

@Component({
  selector: 'app-subsidiary-transaction-report',
  templateUrl: './subsidiary-transaction-report.component.html',
  styleUrls: ['./subsidiary-transaction-report.component.css']
})
export class SubsidiaryTransactionReportComponent implements OnInit {
  history: any;
  p:any;
  term:any;
  FilterForm: FormGroup;
  downloadUrl =  ``;
  rejectReason = '';
  channelsArray: [];
  paymentChannels: [];
  statusArray: Array<any> = [
    {
      Key: "PAID",
      Value: "Successful"
    },
    {
      Key: "FRESH",
      Value: "Pending"
    }
  ];
  billersArray: Array<any> = [];
  billersSchemeArray: Array<any> = [];
  Reciept: any;
  userLoad:userData
  constructor(
    private collect: CollectionsService,
    private toastr: ToastrService,
    private router: Router,
    public gVars: GlobalsService,
    private spinner: NgxSpinnerService,
    private excel: ExcelService,
    private fb: FormBuilder
  ) { 
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
  }

  ngOnInit(): void {
    this.FilterForm = this.fb.group({
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      dashboard: false,
      username: this.userLoad.username,
      session: this.userLoad.session,
      accountId: [""],
      approvalStatus: [""],
      paymentStatus: [null],
      paymentReference: [""],
      keyword: [""],
      schemeId: null,
      paymentMode: [null],
      paymentChannel: [null],
      billerId: null,
      amount: '',
      sourceAccount: [""]
    });
    this.GetTransHistory();
    this.GetPaymentChannels();
    this.GetBillers();
  }

  GetTransHistory()
  {
    var mytoday = new Date();
    // var firstDay = new Date(mytoday.getFullYear(), mytoday.getMonth(), 1);

    const date = new Date(mytoday.getFullYear(), mytoday.getMonth(), 1);  // 2009-11-10
    const month = date.toLocaleString('default', { month: 'long' });
    // console.log(month);

    let d = new Date(mytoday.getFullYear(), mytoday.getMonth(), 1);
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    var startDate = (`${da}-${mo}-${ye}`);

    let d2 = new Date(mytoday.toISOString().slice(0,10));
    let ye2 = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d2);
    let mo2 = new Intl.DateTimeFormat('en', { month: 'short' }).format(d2);
    let da2 = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d2);
    var endDate = (`${da2}-${mo2}-${ye2}`);

    let body = {
      ...this.userLoad,
        startDate: (this.FilterForm.value.startDate == "" || this.FilterForm.value.startDate == null) ? startDate : this.formatDate(this.FilterForm.value.startDate),
        endDate: (this.FilterForm.value.endDate == "" || this.FilterForm.value.startDate == null) ? endDate : this.formatDate(this.FilterForm.value.endDate),
      approvalStatus: "",
      paymentStatus: this.FilterForm.value.paymentStatus,
      paymentReference: this.FilterForm.value.paymentReference,
      keyword: this.FilterForm.value.keyword,
      schemeId: parseInt(this.FilterForm.value.schemeId),
      paymentMode: "",
      paymentChannel: this.FilterForm.value.paymentChannel,
      billerId: parseInt(this.FilterForm.value.billerId),
      amount: parseInt(this.FilterForm.value.amount),
      sourceAccount: this.FilterForm.value.sourceAccount
    };
    let newBody = this.gVars.EncryptData(JSON.stringify(body));
    this.spinner.show();
    // console.log(body);
    this.collect.FetchTransactionHistory({encryptedData:newBody}).subscribe(
      res=>{
        this.spinner.hide();
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData));
        if(decryptedData.Success)
        {
          this.history = decryptedData.Transactions
        }
        else{
          this.toastr.error(decryptedData.ResponseMessage)
        }
      },
      err=>{
        this.spinner.hide();
        this.toastr.error('Unable to complete that request','Redirecting...')
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      }
    )
  }


  reset() {
    this.FilterForm.reset();
    this.GetTransHistory();
  }

  formatDate(data) {
    const date = new Date(data);  // 2009-11-10
    const dateArray = data.split("-");
    const month = date.toLocaleString('default', { month: 'short' });

    const out = dateArray[2] + '-' + month + '-' + dateArray[0];

    return out;
  }

  convert() {

    var doc = new jsPDF('l', 'pt', 'a4');
    // doc.autoTable({ html: '#my-table' })
    doc.setFontSize(10);
    autoTable(doc, { html: '.table-transaction-history', styles: {
      fontSize: 5,
      font: "helvetica"
      } 
    });
    doc.save("Bill Payment Report -" + new Date().toJSON().slice(0, 10).split("-").reverse().join("/") + ".pdf");
  }
  

  export() {
    const exportFile = this.history.map((res, index) => {
      return {
        "SN": index+1,
        "Merchant": res.ProductOwner,
        "Product Name": res.ProductName,
        "Reference": res.PaymentReference,
        "Source Account": res.SourceAccount,
        "State": res.State,
        "Channel": res.ChannelDescription,
        "Payment Status": res.PaymentStatus,
        "Fee": res.Charge,
        "MSC": res.Msc,
        "Amount": res.Amount,
        "Remark": res.Message,
        "Payment Date": new Date(res.CreatedOn).toDateString(),
        "Settlement Date": new Date(res.SettlementDate).toDateString(),
        // "Acted On": res.authorisedOn
      }
    })


  // console.log(exportFile);

  this.excel.exportTableElmToExcel(exportFile, "Bill Payment Report-" + new Date().toJSON().slice(0,10).split('-').reverse().join('/'));
  }

  downloadReceipt(id) {
    let body = {
      ...this.userLoad
    }

    window.open(`${environment.devUrl.collectionService}Collection/GetReceipt/${body.session}/${body.username}/${body.subsidiaryId}/${id}`, '_blank')
  }

  viewRejectReason(item) {
    this.rejectReason = item.RejectionReason;
    $('#rejectReason').modal('show');
  }

  GetPaymentChannels() {
    {
      // this.channels.clear()
      let body = {
        ...this.userLoad
      };
      let newBody = this.gVars.EncryptData(JSON.stringify(body));
      this.spinner.show();
      this.collect.FetchPaymentChannels({encryptedData:newBody}).subscribe(
        (res) => {
          this.spinner.hide();
          let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
          if (decryptedData.Success) {
            //assign
            this.channelsArray = decryptedData.Items;
            // res.items.forEach((element) => {
            //   this.channels.push(new FormControl());
            //   // console.log(this.channels);
            // });
          }
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error("Unable to complete that request");
        }
      );
    }
  }

  GetBillers() {
    {
      // this.channels.clear()
      let body = {
        ...this.userLoad
      };
      let newBody = this.gVars.EncryptData(JSON.stringify(body));
      this.spinner.show();
      this.collect.FetchBillers({encryptedData:newBody}).subscribe(
        (res) => {
          this.spinner.hide();
          let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
          if (decryptedData.Success) {
            //assign
            this.billersArray = decryptedData.Items;
            // res.items.forEach((element) => {
            //   this.channels.push(new FormControl());
            //   // console.log(this.channels);
            // });
          }
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error("Unable to complete that request");
        }
      );
    }
  }

  GetReport(id) {
    let body = {
      ...this.userLoad,
      id: id
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body));
    this.spinner.show();
    console.log(body);
    this.collect.GetReport(body).subscribe(
      (res) => {
        this.spinner.hide();
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        console.log(decryptedData);
        if (decryptedData.Success) {
          if(decryptedData.ReceiptUrl !== null) {
            window.open(decryptedData.ReceiptUrl, '_blank')
          }
          else {
            this.downloadReceipt(id);
          }
        } else {
          this.toastr.error(decryptedData.ResponseMessage);
          // setTimeout(() => {
          //   this.router.navigate(['/dashboard']);
          // }, 1500);
        }
      },
      (err) => {
        this.spinner.hide();
        this.toastr.error("Unable to complete that request", "Redirecting...");
        setTimeout(() => {
          this.router.navigate(["/login"]);
        }, 1500);
      }
    );


  }

  GetSchemeByBillers(id) {
    {
      // this.channels.clear()
      let body = {
        ...this.userLoad,
        id: parseInt(id)
      };
      let newBody = this.gVars.EncryptData(JSON.stringify(body));
      this.spinner.show();
      this.collect.FetchSchemeByBiller({encryptedData:newBody}).subscribe(
        (res) => {
          this.spinner.hide();
          let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
          if (decryptedData.Success) {
            //assign
            this.billersSchemeArray = decryptedData.Schemes;
            // res.items.forEach((element) => {
            //   this.channels.push(new FormControl());
            //   // console.log(this.channels);
            // });
          }
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error("Unable to complete that request");
        }
      );
    }
  }

  viewDetails(data) {
    {
      let body = {
        ...this.userLoad,
        id: data
      };
      this.spinner.show();
      let newBody = this.gVars.EncryptData(JSON.stringify(body));
      this.collect.FetchTransactionDetails({encryptedData:newBody}).subscribe(
        (res) => {
          let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
          if (decryptedData.Success) {
            this.Reciept = decryptedData
            $('#showRRRModal').modal('show');
          }
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          this.toastr.error("Unable to complete that request");
        }
      );
    }
  }

}
