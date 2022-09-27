import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';
import { SummaryService } from 'src/app/core/services/scm/onboarding/summary/summary.service';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { CustomersService } from 'src/app/core/services/scm/onboarding/customers/customers.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { requestBodyModel, userRoleModel } from 'src/app/core/models/scm/onboarding.model';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})

export class OverviewComponent implements OnInit {

  detailsModal: Boolean = false;
  role: string = "";
  deleteModalOpen: boolean = false;
  customerId: number = 0;
  PageNumber: number = 1;
  PageSize: number = 10;
  SearchQuery: string = "";
  filterModal: Boolean = false;
  SortColumn: string = "";

  stats = {
    buyers: 0,
    inactive: 0,
    total: 0,
    suppliers: 0
  };

  allCustomers = [];
  allCustomersEmptyState: boolean = false;
  singleCustomer: any = [];
  searchForm: FormGroup;
  userLoad: any;
  constructor(
    private router: Router,
    private crudServices: CrudService,
    private statsService: SummaryService,
    private gVar: GlobalsService,
    private onboardService: CustomersService,
    private formBuilder: FormBuilder

  ) {
    this.searchForm = this.formBuilder.group({
      search: ['', Validators.required],
    });

    if (this.SearchQuery === "") {
      this.getCustomers();
    }
    this.userLoad = this.gVar.checkRoute(this.gVar.router.url);
  }



  searchCustomer() {
    this.SearchQuery = this.searchForm.value.search;
    this.getCustomers();
  }


  toggleFilterModal() {
    this.filterModal = !this.filterModal;
  }
  closeFilterModal() {
    this.filterModal = false;
    this.resetTable();
  }


  toggleModal(role: string, id: number) {
    this.gVar.spinner.show();
    this.customerId = id;
    this.detailsModal = !this.detailsModal;
    // captialize first letter for role
    this.role = role.charAt(0).toUpperCase() + role.slice(1);
    // this.role = role;
    this.onboardService.getCustomerById(id).subscribe({
      next: (data) => {
        // console.log("single customer:", data)
        this.gVar.spinner.hide();
        this.singleCustomer = data.data;
      }
    })
    // console.log("role:", this.role)
  }

  closeDetailsModal() {
    this.detailsModal = false;
  }

  toggleDeleteModal() {
    this.deleteModalOpen = !this.deleteModalOpen;
  };

  nextPage() {
    this.PageNumber++;
    this.getCustomers();
  }

  previousPage() {
    this.PageNumber = this.PageNumber - 1;
    this.getCustomers();
  }

  deleteCustomer() {
    this.gVar.spinner.show();
    this.onboardService.deletteCustomer(this.customerId).subscribe({
      next: (data) => {
        this.gVar.spinner.hide();
        // console.log("delete customer:", data)
        this.gVar.toastr.success("Customer deleted successfully", "Success");
        this.toggleDeleteModal();
        this.closeDetailsModal();
        this.getCustomers();
        this.getStats();
      }
    })
  }
  getStats() {
    const reqBody: userRoleModel = {
      "session": this.userLoad?.session,
      "username": this.userLoad?.username,
      "subsidiaryId": this.userLoad?.subsidiaryId,
    }
    this.statsService.getOnboardStats(reqBody).subscribe({
      next: (data) => {
        // console.log("stats:",data)
        // loop through stats
        data.data.forEach((stat: any) => {
          // console.log("stat:",stat.value)
          if (stat.key === "BUYER") {
            this.stats.buyers = stat.value;
          } else if (stat.key === "ISACTIVE") {
            this.stats.inactive = stat.value;
          } else if (stat.key === "ALL") {
            this.stats.total = stat.value;
          } else if (stat.key === "SUPPLIER") {
            this.stats.suppliers = stat.value;
          }
          else {
            // show toast
            // this.gVar.toastr.info("No stats found", "Info");
          }
        })
        // console.log("stats:", this.stats) 
      }, error: (err) => {
        // console.log("err:", err)
        // show toast
        this.gVar.toastr.error("Error fetching data", "Error");
      }

    })
  }

  getCustomers() {
  const  requestBody: requestBodyModel = {
      "searchQuery": this.SearchQuery,
      "sortColumn": this.SortColumn,
      "pageNumber": this.PageNumber,
      "pageSize": this.PageSize,
      "session": this.userLoad?.session,
      "username": this.userLoad?.username,
      "subsidiaryId": this.userLoad?.subsidiaryId.toString(),
      "countryId": "01"
    }
    this.onboardService.getAllCustomers(requestBody).subscribe({
      next: (data) => {
        // console.log("customers:", data)
        this.allCustomers = data.data;
        if (data.message === "Successful") {
          this.gVar.spinner.hide();
        }

        if (this.allCustomers.length === 0) {
          this.allCustomersEmptyState = true;
        } else {
          this.allCustomersEmptyState = false;
        }
      }
    })
  }



  edit(role: string, id: number) {
    this.router.navigateByUrl('scm/onboarding/edit-form/' + role + '/' + id);
  }



  tableHeaders = [
    {
      name: "Date Added"
    },
    {
      name: "TIN"
    },
    {
      name: "Company"
    },
    {
      name: "Role"
    },
    {
      name: "Company Email"
    },
    {
      name: "Actions"
    },
  ]

  resetTable() {
    this.SearchQuery = "";
    this.SortColumn = "";
    this.getCustomers();
  }

  resetData(val: string) {
    // console.log("val:", val)
    // timeout val to allow for the value to be set
    this.SearchQuery = val;
    this.getCustomers();

    // if(this.SearchQuery === ""){
    //   this.getCustomers();
    // }
  }
  navigate() {
    this.router.navigateByUrl('scm/onboarding/overview');
    this.crudServices.updateHeaderTitle("All Customers");
  }

  navigateToBuyer() {
    this.router.navigateByUrl('scm/onboarding/pages');
    this.crudServices.updateHeaderTitle("Buyers")
    this.crudServices.updatetabNumber(2)
  }
  navigateToSupplier() {
    this.router.navigateByUrl('scm/onboarding/pages');
    this.crudServices.updateHeaderTitle("Suppliers")
    this.crudServices.updatetabNumber(3)
  }

  sortBuyers() {
    this.SortColumn = "BUYER";
    this.getCustomers();
    this.toggleFilterModal();
  }

  sortSuppliers() {
    this.SortColumn = "SUPPLIER";
    this.getCustomers();
    this.toggleFilterModal();
  }

  sortApproved() {
    this.SortColumn = "APPROVED";
    this.getCustomers();
    this.toggleFilterModal();
  }

  sortNotApproved() {
    this.SortColumn = "NOTAPPROVED";
    this.getCustomers();
    this.toggleFilterModal();
  }

  ngOnInit(): void {
    this.getStats();
    this.getCustomers();
    this.gVar.spinner.show();


  }

}
