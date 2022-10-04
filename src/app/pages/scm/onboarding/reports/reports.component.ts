import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';;
import { Router } from '@angular/router';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { CustomersService } from 'src/app/core/services/scm/onboarding/customers/customers.service';
import { requestBodyModel, userRoleModel } from 'src/app/core/models/scm/onboarding.model';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  requestBody: requestBodyModel;
  userLoad: userRoleModel;
  SortColumn: string = "RECENTADDED";
  customerId: number = 0;
  PageNumber: number = 0;
  PageSize: number = 10;
  SearchQuery: string = "";
  tabNumber: Number = 1;
  allCustomers = [];
  editedCustomers = [];
  deletedCustomers = [];
  addedCustomers = [];
  totalDeleted: number = 0;
  totalAdded: number = 0;
  totalEdited: number = 0;
  total: number = 0;
  detailsModal: Boolean = false;
  singleCustomer: any = [];
  customerType: string = "";
  isOldEmpty: boolean = true;
  constructor(
    private crudServices: CrudService,
    private router: Router,
    private gVar: GlobalsService,
    private customerService: CustomersService
  ) {
    this.userLoad = this.gVar.checkRoute(this.gVar.router.url);
    this.requestBody = {
      "searchQuery": this.SearchQuery,
      "sortColumn": this.SortColumn,
      "pageNumber": this.PageNumber,
      "pageSize": this.PageSize,
      "session": this.userLoad?.session,
      "username": this.userLoad?.username,
      "subsidiaryId": this.userLoad?.subsidiaryId.toString(),
      "countryId": "01"
    }
  }
  closeDetailsModal() {
    this.detailsModal = false;
  }
  getReports() {
    this.customerService.getAllReports(this.requestBody).subscribe({
      next: (data) => {
        this.allCustomers = data.data;

        // console.log("reports",data);
        this.total = data.totalCount;
        this.gVar.spinner.hide();
      }, error: (err) => {
        this.gVar.toastr.error("Unable to fetch data");
      }
    })
  }

  getDeltedReports() {
    const filter = {
      "filter": "RECENTDELETED"
    }
    this.requestBody = {
      ...this.requestBody,
      ...filter
    }
    this.customerService.getAllReports(this.requestBody).subscribe({
      next: (data) => {
        this.deletedCustomers = data.data;
        this.totalDeleted = data.totalCount;
        // console.log("deleted",data);
      }
    })
  }

  getEditedReports() {
    const filter = {
      "filter": "RECENTEDITED"
    }
    this.requestBody = {
      ...this.requestBody,
      ...filter
    }
    this.customerService.getAllReports(this.requestBody).subscribe({
      next: (data) => {
        this.editedCustomers = data.data;
        this.totalEdited = data.totalCount;
        // console.log("edited",data);
      }
    })
  }

  getAddedReports() {
    const filter = {
      "filter": "RECENTADDED"
    }
    this.requestBody = {
      ...this.requestBody,
      ...filter
    }
    this.customerService.getAllReports(this.requestBody).subscribe({
      next: (data) => {
        this.addedCustomers = data.data;
        this.totalAdded = data.totalCount;
        // console.log("added",data);
      }
    })
  }
  pageChecker() {
    if (this.tabNumber === 1) {
      this.getReports();
    } else if (this.tabNumber === 2) {
      this.getDeltedReports();
    } else if (this.tabNumber === 3) {
      this.getEditedReports();
    } else if (this.tabNumber === 4) {
      this.getAddedReports();
    }
  }

  paginator(typs: string) {
    if (typs === "next") {
      this.PageNumber = this.PageNumber++;
      this.pageChecker();
    } else {
      this.PageNumber = this.PageNumber - 1;
      this.pageChecker();
    }

  }



  tableHeaders = [
    {
      name: "Contact Person Name",
    },
    {
      name: "Contact Person Role",
    },
    {
      name: "Date of Change",
    }
  ]

  toggleTabs(tabNumber: Number) {
    this.tabNumber = tabNumber;
  }

  getSingleCustomer() {
    this.customerService.getCustomerReportById(this.requestBody).subscribe({
      next: (data) => {
        this.singleCustomer = data.data;
        this.customerType = data.customerType;
        this.detailsModal = true;
        //  loop through single customer 
        this.singleCustomer.forEach((element: any) => {
          // console.log(element?.newValues?.Limits)
          if (Object.keys(element?.oldValues).length > 0) {
            this.isOldEmpty = false;
          }
        }
        );
      }
    })
  }

  viewCustomerDetails(customerId: number, customerType: string) {
    this.detailsModal = true;
    this.customerId = customerId;
    const id = {
      "customerId": this.customerId
    }
    this.requestBody = {
      ...this.requestBody,
      ...id
    }
    this.customerType = customerType;
    this.detailsModal = true;
    this.getSingleCustomer();
  }

  goBack() {
    this.router.navigate(['/scm/onboarding']);
  }

  ngOnInit(): void {
    this.gVar.spinner.show();
    this.getReports();
    this.getDeltedReports();
    this.getEditedReports();
    this.getAddedReports();
  }

}
