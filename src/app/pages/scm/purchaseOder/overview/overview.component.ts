import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { downloadLpoModel, requestLpoBody, updatingLpoModel } from 'src/app/core/models/scm/LPO.model';
import { userRoleModel } from 'src/app/core/models/scm/onboarding.model';
import { CustomersService } from 'src/app/core/services/scm/onboarding/customers/customers.service';
import { LposService } from 'src/app/core/services/scm/purchase-oder/lpos.service';
import { SummaryService } from 'src/app/core/services/scm/summary/summary.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  isDetailsModalOpen: boolean = false;
  summary: any = {
    allLpos: 0,
    unpaidLpos: 0,
    uploadedLpos: 0,
    newLpos: 0
  };
  userLoad: userRoleModel;
  requestBody: requestLpoBody;
  PageNumber: number = 1;
  PageSize: number = 10;
  SearchQuery: string = "";
  SortColumn: string = "";
  isStateEmpty: boolean = false;
  searchForm: FormGroup;
  hasNextPage: boolean = false;
  hasPrevPage: boolean = false;
  singleLpo: any = {};
  purchaseOrderId: number = 0;
  modalText: string;
  isSuccesModalOpen: boolean;
  subTotal: number;

  constructor(
    private customersService: CustomersService,
    private gVars: GlobalsService,
    private LPOService: LposService,
    private statsService: SummaryService,
    private router: Router,
    private formBuilder: FormBuilder,
    private crudService: CrudService

  ) {
    this.searchForm = this.formBuilder.group({
      search: ['', Validators.required],
    });
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


  navigate(tab: number) {
    this.crudService.updateLpoTabNumber(tab);
    this.router.navigate(['scm/purchase-order/pages']);
  }

  toggleDetailsModal(id: number) {
    this.purchaseOrderId = id;
    this.gVars.spinner.show();
    this.isDetailsModalOpen = !this.isDetailsModalOpen;
    this.LPOService.getLpoById(id).subscribe({
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

  deleteLpo() {
    this.gVars.spinner.show();

    const reqBody: updatingLpoModel = {
      "purchaseOrderId": this.purchaseOrderId,
      "comment": "",
      "session": this.userLoad?.session,
      "username": this.userLoad?.username,
      "subsidiaryId": this.userLoad?.subsidiaryId.toString(),
      "countryId": "01",
    }

    this.LPOService.deleteLpo(reqBody).subscribe({
      next: (res) => {
        this.gVars.spinner.hide();
        this.gVars.toastr.success("LPO deleted successfully");
        this.isDetailsModalOpen = false;
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }, error: (err) => {
        console.log(err);
        this.gVars.toastr.error("Something went wrong");
      }
    })



  }

  downloadLpo() {
    this.gVars.spinner.show();
    const reqBody: downloadLpoModel = {
      "purchaseOrderId": this.purchaseOrderId,
      "session": this.userLoad?.session,
      "username": this.userLoad?.username,
      "subsidiaryId": this.userLoad?.subsidiaryId.toString(),
      "countryId": "01",
    }

    this.LPOService.dowloadLpo(reqBody).subscribe({
      next: (res) => {
        this.gVars.spinner.hide();
        this.gVars.toastr.success("LPO downloaded successfully");
        this.isDetailsModalOpen = false;
      }, error: (err) => {
        console.log(err);
        this.gVars.spinner.hide();
        this.gVars.toastr.error("Something went wrong");
      }
    })
  }





  closeDetailsModal() {
    this.isDetailsModalOpen = !this.isDetailsModalOpen;
  }

  tableHeaders = [
    {
      name: "Date"
    },
    {
      name: "Purchase Order No"
    },
    {
      name: "Vendor"
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

  tableData = [];

  getLpoSummary() {
    this.statsService.getLpoStats(this.requestBody).subscribe({
      next: (res) => {
        this.gVars.spinner.hide();
        res.data.forEach((element: any) => {
          if (element.key === "ALL") {
            this.summary.allLpos = element.value;
          } else if (element.key === "UNPAID") {
            this.summary.unpaidLpos = element.value;
          }
          else if (element.key === "UPLOADED") {
            this.summary.uploadedLpos = element.value;
          } else if (element.key === "NEW") {
            this.summary.newLpos = element.value;
          } else {
            this.summary.allLpos = 0;
            this.summary.unpaidLpos = 0;
            this.summary.uploadedLpos = 0;
            this.summary.newLpos = 0;
          }
        });
      }, error: (err) => {
        this.gVars.spinner.hide();
        this.gVars.toastr.error("Error fetching data");
      }
    })
  }

  resetData(val: string) {
    this.SearchQuery = val;
    console.log("val:", val);
    // setTimeout(() => {
      this.requestBody.searchQuery = this.SearchQuery;
      this.getAllLpos();

      if(val === ""){
        this.getAllLpos();
      }
    // }, 2000);
  }

  getAllLpos() {
    this.crudService.updateLpoHeaderTitle('Purchase Order');
    this.LPOService.getLpos(this.requestBody).subscribe({
      next: (res) => {
        this.hasPrevPage = res.hasPrevious === true ? true : false;
        this.hasNextPage = res.hasNext === true ? true : false;
        this.gVars.spinner.hide();
        this.tableData = res.data;
        if (this.tableData.length === 0) {
          this.isStateEmpty = true;
        }else   {
          this.isStateEmpty = false;
        }
        // console.log("LPOs", this.tableData);
      }, error: (err) => {
        this.gVars.spinner.hide();
        this.gVars.toastr.error("Error fetching data");
      }
    })
  }




  prevPage() {
    if (this.hasPrevPage) {
      this.PageNumber = this.PageNumber - 1;
      this.requestBody.pageNumber = this.PageNumber;
      this.getAllLpos();
    }
  }

  nextPage() {
    if (this.hasNextPage) {
      this.PageNumber = this.PageNumber++;
      this.requestBody.pageNumber = this.PageNumber;
      this.getAllLpos();
    }
  }



  ngOnInit(): void {
    this.gVars.spinner.show();
    this.getLpoSummary();
    this.getAllLpos();


  }

}
