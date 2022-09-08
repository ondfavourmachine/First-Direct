import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { GlobalsService } from "src/app/core/globals/globals.service";
import { TransferService } from "src/app/core/services/transfer.service";
declare var $: any;
@Component({
  selector: "app-bulk-modal",
  templateUrl: "./bulk-modal.component.html",
  styleUrls: ["./bulk-modal.component.css"],
})
export class BulkModalComponent implements OnInit, OnChanges {
  toMark = [];
  @Input() Details;
  toInitiate: any[];
  itemsPerPage: number = 100;
  currentPage: number = 1;
  holdPage: number = 1;
  startIndex: number = 0;
  endIndex: number = this.startIndex + this.itemsPerPage - 1;
  userLoad:{username:string, subsidiaryId:number,session:string};
  constructor(
    private TransferS: TransferService,
    private gVars: GlobalsService
  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url)
  }

  ngOnInit() {}
  ngOnChanges() {}
  MarkBulk(data, index) {
    let isChecked = $("#bulk" + index).is(":checked");
    if (isChecked) {
      this.toMark.push(data);
    } else {
      this.toMark = this.toMark.filter((item) => item !== data);
    }
  }

  ValidateId(data) {
    let body = {
      ...this.userLoad,
      active: true,
      batchId: this.Details.batch,
      selectedIds: [],
    };
    this.toMark.forEach((element) => {
      body.selectedIds.push(element.Id);
    });
    let newBody = this.gVars.EncryptData(JSON.stringify(body));
    this.TransferS.markIdValid({ encryptedData: newBody }).subscribe((res) => {
      this.gVars.spinner.hide();
      let decryptedData = JSON.parse(this.gVars.DecryptData(res.encryptedData));
      if (decryptedData.Success) {
        this.gVars.toastr.success(decryptedData.ResponseMessage);
        setTimeout(() => {
          location.reload();
        }, 1500);
      } else {
        this.gVars.toastr.error(res.ResponseMessage);
      }
    });
  }

  MarkValid(data) {
    this.gVars.spinner.show();
    let body = {
      ...this.userLoad,
      batchId: String(data),
    };
    let newBody = this.gVars.EncryptData(JSON.stringify(body));
    this.TransferS.MarkValid({ encryptedData: newBody }).subscribe(
      (res) => {
        this.gVars.spinner.hide();
        let decryptedData = JSON.parse(
          this.gVars.DecryptData(res.encryptedData)
        );
        if (decryptedData.Success) {
          this.gVars.toastr.success(decryptedData.ResponseMessage);
          setTimeout(() => {
            location.reload();
          }, 1500);
        } else {
          this.gVars.toastr.error(decryptedData.ResponseMessage);
        }
      },
      (err) => {
        this.gVars.spinner.hide();
        this.gVars.toastr.error(
          "Unable to complete that request",
          "Redirecting..."
        );
        setTimeout(() => {
          this.gVars.router.navigate(["/login"]);
        }, 1500);
      }
    );
  }

  ChecKAllBoxes(data, pageNumber) {
    let isChecked = $("#checkAll").prop("checked");
    if (isChecked) {
      $("#checkAll").prop("checked", true);
      this.endIndex = this.startIndex + this.itemsPerPage - 1;
      for (let i = this.startIndex; i <= this.endIndex; i++) {
        if (data[i] === undefined) {
          return;
        }
        this.toMark.push(data[i].Id);
        $(`.bulk-mark`).prop("checked", true);
      }
    } else {
      this.toMark = [];
      $("#checkAll").prop("checked", false);
      for (let i = this.startIndex; i <= this.endIndex; i++) {
        $(`.bulk-mark`).prop("checked", false);
      }
    }
  }

  ClearMark() {
    $("#checkAll").prop("checked", false);
    for (let i = this.startIndex; i <= this.endIndex; i++) {
      $(`.bulk-mark`).prop("checked", false);
    }
    this.toMark = [];
  }

  Clicked() {
    if (this.currentPage > this.holdPage) {
      $("#checkAll").prop("checked", false);
      for (let i = this.startIndex; i <= this.endIndex; i++) {
        $(`.bulk-mark`).prop("checked", false);
      }
      this.toMark = [];
      this.startIndex = this.endIndex + 1;
      this.endIndex = this.startIndex + this.itemsPerPage - 1;
    }
    if (this.currentPage <=  this.holdPage) {
      $("#checkAll").prop("checked", false);
      for (let i = this.startIndex; i <= this.endIndex; i++) {
        $(`.bulk-mark`).prop("checked", false);
      }
      this.toMark = [];
      this.startIndex = this.startIndex - this.itemsPerPage;
      this.endIndex = this.startIndex + this.itemsPerPage - 1;
    }
    this.holdPage = this.currentPage;
  }
}
