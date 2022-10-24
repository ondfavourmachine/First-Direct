import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LposService } from 'src/app/core/services/scm/purchase-oder/lpos.service';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';
import { Router } from '@angular/router';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { requestLpoBody, updatingLpoModel } from 'src/app/core/models/scm/LPO.model';
import { userRoleModel } from 'src/app/core/models/scm/onboarding.model';
@Component({
  selector: 'app-table-tabs',
  templateUrl: './table-tabs.component.html',
  styleUrls: ['./table-tabs.component.scss']
})
export class TableTabsComponent implements OnInit {

  tabNumber: Number = 1;
  isDetailsModalOpen: boolean = false;
  isRejectInvoiceModalOpen: boolean = false;
  isApproveInvoiceModalOpen: boolean = false;
  isSuccesModalOpen: boolean = false;
  modalText: string = "Successful";
  allLpos: any = [];
  unpaidLpos: any = [];
  paidLpos: any = [];
  uploadedLpos: any = [];
  dueLpos = [];
  newLpos: any = [];
  PageNumber: number = 1;
  PageSize: number = 10;
  SearchQuery: string = "";
  SortColumn: string = "";
  userLoad: userRoleModel;
  requestBody: requestLpoBody;
  singleLpo: any = [];
  isNewLpoEmpty : boolean = false;
  isPaidLpoEmpty : boolean = false;
  isUploadedLpoEmpty : boolean = false;
  isLposEmpty : boolean = false;
  isUnpaidLpoEmpty : boolean = false;
  isDueLposEmpty : boolean = false;
  purchaseOrderId : number = 0;
  subTotal : number = 0;

  constructor(
    private lposService: LposService,
    private crudServices: CrudService,
    private router: Router,
    private gVars: GlobalsService,
    private _route: ActivatedRoute

  ) {
    this.userLoad = this.gVars.checkRoute(this.gVars.router.url);
    this.requestBody = {
      "searchQuery": this.SearchQuery,
      "sortColumn": this.SortColumn,
      "pageNumber": this.PageNumber,
      "pageSize": this.PageSize,
      "session": this.userLoad?.session,
      "username": this.userLoad?.username,
      "subsidiaryId": this.userLoad?.subsidiaryId.toString(),
      "countryId": "01",
      "filter": ""
    }
  }
  toggleTabs(tabNumber: Number) {
    this.tabNumber = tabNumber;
    this.headerTitleConfig();
    if (tabNumber === 1) {
      this.router.navigate(['scm/purchase-order/overview']);
    } 
    // else if (tabNumber === 2) {
    //   this.crudServices.updateHeaderTitle("Buyers")
    // } else {
    //   this.crudServices.updateHeaderTitle("Suppliers")
    // }
  };

  toggleRejectInvoiceModal() {
    this.isRejectInvoiceModalOpen = !this.isRejectInvoiceModalOpen;
  }

  toggleApproveInvoiceModal() {
    this.isApproveInvoiceModalOpen = !this.isApproveInvoiceModalOpen;
  }

  acceptLpo(){
    const reqBody: updatingLpoModel ={
      "purchaseOrderId": this.purchaseOrderId,
      "comment": "",
      "session": this.userLoad?.session,
      "username": this.userLoad?.username,
      "subsidiaryId": this.userLoad?.subsidiaryId.toString(),
      "countryId": "01",
    }

    this.lposService.acceptLpo(reqBody).subscribe({
      next: (res) => {
        this.modalText = "LPO Accepted Successfully";
        this.isSuccesModalOpen = true;
        this.getLpos();
      }, error: (err) => {
        console.log(err);
        this.gVars.toastr.error("Something went wrong");
      }
    })

  }

  rejectLpo(){
    const reqBody: updatingLpoModel ={
      "purchaseOrderId": this.purchaseOrderId,
      "comment": "",
      "session": this.userLoad?.session,
      "username": this.userLoad?.username,
      "subsidiaryId": this.userLoad?.subsidiaryId.toString(),
      "countryId": "01",
    }

    this.lposService.rejectLpo(reqBody).subscribe({
      next: (res) => {
        this.modalText = "LPO Rejected Successfully";
        this.isSuccesModalOpen = true;
        this.getLpos();
      }, error: (err) => {
        console.log(err);
        this.gVars.toastr.error("Something went wrong");
      }
    })

  }

  deleteLpo(){

    const reqBody: updatingLpoModel ={
      "purchaseOrderId": this.purchaseOrderId,
      "comment": "",
      "session": this.userLoad?.session,
      "username": this.userLoad?.username,
      "subsidiaryId": this.userLoad?.subsidiaryId.toString(),
      "countryId": "01",
    }

    this.lposService.deleteLpo(reqBody).subscribe({
      next: (res) => {
        this.modalText = "LPO Deleted Successfully";
        this.isSuccesModalOpen = true;
        this.getLpos();
      } , error: (err) => {
        console.log(err);
        this.gVars.toastr.error("Something went wrong");
      }
    })



  }

  toggleSuccesModal() {
    this.isSuccesModalOpen = !this.isSuccesModalOpen;
  }

  closeDetailsModal() {
    this.isDetailsModalOpen = false;
  }

  getLpos() {
    this.gVars.spinner.show();
    this.lposService.getLpos(this.requestBody).subscribe({
      next: (data: any) => {
        this.allLpos = data.data;
        this.unpaidLpos = this.allLpos.filter((lpo: any) => lpo.purchaseOrderStatus=== "UNPAID");
        this.paidLpos = this.allLpos.filter((lpo: any) => lpo.purchaseOrderStatus=== "PAID");
        this.uploadedLpos = this.allLpos.filter((lpo: any) => lpo.purchaseOrderStatus=== "UPLOADED");
        this.dueLpos = this.allLpos.filter((lpo: any) => lpo.purchaseOrderStatus=== "DUE");
        this.newLpos = this.allLpos.filter((lpo: any) => lpo.purchaseOrderStatus=== "NEW");
        this.gVars.spinner.hide();
        if(this.newLpos.length === 0){
          this.isNewLpoEmpty = true;
        } 
        if(this.paidLpos.length === 0){
          this.isPaidLpoEmpty = true; 
        }
        if(this.uploadedLpos.length === 0){
          this.isUploadedLpoEmpty = true;
        } 
        if(this.allLpos.length === 0){
          this.isLposEmpty = true;
        }
        if(this.unpaidLpos.length === 0){
          this.isUnpaidLpoEmpty = true;
        }
        if(this.dueLpos.length === 0){
          this.isDueLposEmpty = true;
        }


      },
      error: (err: any) => {
        this.gVars.spinner.hide();
        console.log(err);
      }
    })
  }

  // emptyStateManager(arr : any, checker: boolean){
  //   if(arr.length === 0){
  //     checker = true;
  //   } else {
  //     checker = false;
  //   }

  //   console.log(checker);
  //   console.log("is empty", this.isDueLposEmpty);
  // }





  tableHeaders = [
    {
      name: "Date"
    },
    {
      name: "LPO No"
    },
    {
      name: "Company"
    },
    {
      name: "Amount"
    },
    {
      name: "Email Address"
    },
    {
      name: "Status"
    },
  ]

  toggleDetailsModal(id: number) {
    this.purchaseOrderId = id;
    this.gVars.spinner.show();
    this.isDetailsModalOpen = !this.isDetailsModalOpen;
    this.lposService.getLpoById(id).subscribe({
      next: (res) => {
        this.singleLpo = res.data;
        this.subTotal = this.singleLpo?.total - this.singleLpo?.miscellaneous;
        // console.log("single-lpo:", this.singleLpo);
        this.gVars.spinner.hide();
      },
      error: (err) => {
        console.log(err);
        this.isDetailsModalOpen = !this.isDetailsModalOpen;
      }
    })
  }

  getTabNumber(){
    this.crudServices.getLpoTabNumber().subscribe({
      next: (res) => {
        this.tabNumber = res;
        // console.log("tab number", this.tabNumber);
      }
    })
  }

  updateHeaderTitle(title: string){
    this.crudServices.updateLpoHeaderTitle(title);
  }

  headerTitleConfig(){
    if(this.tabNumber === 1){
      this.updateHeaderTitle("All Purchase Orders");
    } else if(this.tabNumber === 2){
      this.updateHeaderTitle("Unpaid Purchase Orders"); 
    } else if(this.tabNumber === 3){
      this.updateHeaderTitle("Paid Purchase Orders");
    } else if(this.tabNumber === 4){
      this.updateHeaderTitle("Uploaded Purchase Orders");
    } else if(this.tabNumber === 5){
      this.updateHeaderTitle("Due Purchase Orders");
    } else if(this.tabNumber === 6){
      this.updateHeaderTitle("New Purchase Orders");
    } else {
      this.updateHeaderTitle("Purchase Orders");
    }
  }
  ngOnInit(): void {
    this.getLpos();
    this.getTabNumber();
    this.headerTitleConfig();

  }

}
