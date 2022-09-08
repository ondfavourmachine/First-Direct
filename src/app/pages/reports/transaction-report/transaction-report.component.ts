import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
declare var $: any;
// import { jsPDF } from "jspdf";
import { CollectionsService } from "src/app/core/services/collections.service";
import { ExcelService } from "src/app/core/services/excel.service";
import { environment } from "src/environments/environment";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GlobalsService } from "src/app/core/globals/globals.service";
import { userData } from "src/app/core/models/userData.model";



// const doc = new jsPDF();

@Component({
  selector: "app-transaction-report",
  templateUrl: "./transaction-report.component.html",
  styleUrls: ["./transaction-report.component.css"],
})
export class TransactionReportComponent implements OnInit {
  history: any;
  p: any;
  term: any;
  FilterForm: FormGroup;
  downloadUrl = ``;
  rejectReason = "";
  searchForm: FormGroup;
  channelsArray: [];
  paymentChannels: [];
  statusArray: Array<any> = [
    {
      key: "PAID",
      value: "Successful",
    },
    {
      key: "FRESH",
      value: "Pending",
    },
  ];
  billersArray: Array<any> = [];
  billersSchemeArray: Array<any> = [];
  userLoad:userData;
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
      amount: "",
      sourceAccount: [""],
    });
    this.GetTransHistory();
    this.GetPaymentChannels();
    this.GetSchemeByBillers();
    // this.GetBillers();
  }

  GetTransHistory() {
    var mytoday = new Date();
    // var firstDay = new Date(mytoday.getFullYear(), mytoday.getMonth(), 1);

    const date = new Date(mytoday.getFullYear(), mytoday.getMonth(), 1); // 2009-11-10
    const month = date.toLocaleString("default", { month: "long" });
    // console.log(month);

    let d = new Date(mytoday.getFullYear(), mytoday.getMonth(), 1);
    let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    let mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
    let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    var startDate = `${da}-${mo}-${ye}`;

    let d2 = new Date(mytoday.toISOString().slice(0, 10));
    let ye2 = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d2);
    let mo2 = new Intl.DateTimeFormat("en", { month: "short" }).format(d2);
    let da2 = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d2);
    var endDate = `${da2}-${mo2}-${ye2}`;

    let body = {
      ...this.userLoad,
      startDate:
        this.FilterForm.value.startDate == "" ||
        this.FilterForm.value.startDate == null
          ? startDate
          : this.formatDate(this.FilterForm.value.startDate),
      endDate:
        this.FilterForm.value.endDate == "" ||
        this.FilterForm.value.startDate == null
          ? endDate
          : this.formatDate(this.FilterForm.value.endDate),
      approvalStatus: "",
      paymentStatus: this.FilterForm.value.paymentStatus,
      paymentReference: this.FilterForm.value.paymentReference,
      keyword: this.FilterForm.value.keyword,
      paymentMode: "",
      paymentChannel: this.FilterForm.value.paymentChannel,
      amount: parseInt(this.FilterForm.value.amount),
      sourceAccount: this.FilterForm.value.sourceAccount,
    };
    let newBody = this.gVars.EncryptData(JSON.stringify(body));
    this.spinner.show();
    this.collect.FetchSubsidiaryTransaction({encryptedData:newBody}).subscribe(
      (res) => {
        this.spinner.hide();
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        if (decryptedData.Success) {
          this.history = decryptedData.Transactions;
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

  reset() {
    this.FilterForm.reset();
    this.GetTransHistory();
  }

  // savePdf() {
  //   // doc.text("Hello world!", 10, 10);
  //   // doc.save("Transactions.pdf");

  //   var generateData = function (amount) {
  //     var result = [];
  //     var data = {
  //       coin: "100",
  //       game_group: "GameGroup",
  //       game_name: "XPTO2",
  //       game_version: "25",
  //       machine: "20485861",
  //       vlt: "0",
  //     };
  //     for (var i = 0; i < amount; i += 1) {
  //       // data.id = (i + 1).toString();
  //       result.push(Object.assign({}, data));
  //     }
  //     return result;
  //   };

  //   function createHeaders(keys) {
  //     var result = [];
  //     for (var i = 0; i < keys.length; i += 1) {
  //       result.push({
  //         id: keys[i],
  //         name: keys[i],
  //         prompt: keys[i],
  //         width: 65,
  //         align: "center",
  //         padding: 0,
  //       });
  //     }
  //     return result;
  //   }

  //   var headers = createHeaders([
  //     "id",
  //     "coin",
  //     "game_group",
  //     "game_name",
  //     "game_version",
  //     "machine",
  //     "vlt",
  //   ]);

  // var doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "portrait" });
  // doc.table(1, 1, generateData(100), headers, { autoSize: true });
  // }


  convert() {

    var doc = new jsPDF('l', 'pt', 'a4');
    doc.setFontSize(10);
    const head = [['s/n', 'State', 'Payment Reference', 'Channel', 'Payment Status', 'Product Name', 'Product Owner', 'Customer Name', 'Amount', 'Payment Date', 'Currency'] ];
    const body = this.history.map((res, index) => {
     
      return [
        index + 1, res.State, res.PaymentReference, res.ChannelDescription, res.PaymentReference, res.ProductName, res.ProductOwner, res.CustomerName, res.Amount, new Date(res.CreatedOn).toDateString(), res.Currency ]

    });

   
    autoTable(doc, { head: head,
      body: body,
      styles: {
        fontSize: 5,
        font: "helvetica"
      }
      // didDrawCell: (data) => {},
      // tableWidth: 'auto'
    });
    
  

    doc.save("Collections-Report -" + new Date().toJSON().slice(0, 10).split("-").reverse().join("/") + ".pdf");
  }

  formatDate(data) {
    const date = new Date(data); // 2009-11-10
    const dateArray = data.split("-");
    const month = date.toLocaleString("default", { month: "short" });

    const out = dateArray[2] + "-" + month + "-" + dateArray[0];

    return out;
  }

  export() {
    // console.log(this.history);
    const exportFile = this.history.map((res) => {
      return {
        SN: res.id,
        Merchant: res.productOwner,
        "Product Name": res.productName,
        Reference: res.paymentReference,
        // sourceAccount: res.sourceAccount,
        // state: res.state,
        Channel: res.channelDescription,
        "Payment Status": res.paymentStatus,
        // fee: res.charge,
        // msc: res.msc,
        Amount: res.amount,
        Remark: res.message,
        "Payment Date": new Date(res.createdOn).toDateString(),
        "Settlement Date": res.settlementDate,
      };
    });

    // console.log(exportFile);

    this.excel.exportTableElmToExcel(
      exportFile,
      "Collections Report-" +
        new Date().toJSON().slice(0, 10).split("-").reverse().join("/")
    );
  }

  downloadReceipt(id) {
    let body = {
      ...this.userLoad
    };

    window.open(
      `${environment.devUrl.collectionService}Collection/GetReceipt/${body.session}/${body.username}/${body.subsidiaryId}/${id}`,
      "_blank"
    );
  }

  GetReport(id) {
    let body = {
      ...this.userLoad
    }
    let newBody = this.gVars.EncryptData(JSON.stringify(body));
    this.spinner.show();
    console.log(body);
    this.collect.GetReport({encryptedData:newBody}).subscribe(
      (res) => {
        this.spinner.hide();
        let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
        console.log(decryptedData);
        if (decryptedData.Success) {
          this.history = decryptedData.Transactions;
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

  viewRejectReason(item) {
    this.rejectReason = item.rejectionReason;
    $("#rejectReason").modal("show");
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
          let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData))
          this.spinner.hide();
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

  GetSchemeByBillers() {
    {
      // this.channels.clear()
      let body = {
        ...this.userLoad,
        id: 0,
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
}
