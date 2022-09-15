import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';
import { SummaryService } from 'src/app/core/services/scm/onboarding/summary/summary.service';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { CustomersService } from 'src/app/core/services/scm/onboarding/customers/customers.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})

export class OverviewComponent implements OnInit {

  detailsModal: Boolean = false;
  role: string = "";
  deleteModalOpen: boolean = false;

  stats = {
    buyers: 0,
    inactive: 0,
    total: 0,
    suppliers: 0
  };

  allCustomers = [];
  allCustomersEmptyState: boolean = false;
  singleCustomer: any = [];
  
  constructor(
    private router: Router,
    private crudServices: CrudService,
    private statsService: SummaryService,
    private gVar: GlobalsService,
    private onboardService: CustomersService

  ) { }

  toggleModal(role: string, id: number) {
    this.gVar.spinner.show();
    this.detailsModal = !this.detailsModal;
    // captialize first letter for role
    this.role = role.charAt(0).toUpperCase() + role.slice(1);
    // this.role = role;
    this.onboardService.getCustomerById(id).subscribe({
      next: (data) => {
        console.log("single customer:", data)
        this.gVar.spinner.hide();
        this.singleCustomer = data.data;
      }
    })
  }

  closeDetailsModal() {
    this.detailsModal = false;
  }

  toggleDeleteModal() {
    this.deleteModalOpen = !this.deleteModalOpen;
  };

  getStats() {
    this.statsService.getOnboardStats().subscribe({
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
          }else if (stat.key === "SUPPLIER") {
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
    this.onboardService.getAllCustomers().subscribe({
      next: (data) => {
        console.log("customers:", data)
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

  getSingleCustomer(id: number) {

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


  navigate() {
    this.router.navigateByUrl('scm/overview');
    this.crudServices.updateHeaderTitle("All Customers");
  }

  navigateToBuyer() {
    this.router.navigateByUrl('scm/pages');
    this.crudServices.updateHeaderTitle("Buyers")
    this.crudServices.updatetabNumber(2)
  }
  navigateToSupplier() {
    this.router.navigateByUrl('scm/pages');
    this.crudServices.updateHeaderTitle("Suppliers")
    this.crudServices.updatetabNumber(3)
  }

  ngOnInit(): void {
    this.getStats();
    this.getCustomers();
    this.gVar.spinner.show();
  }

}
