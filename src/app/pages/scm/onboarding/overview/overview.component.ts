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
    total: 0
  };

  allCustomers = [];

  constructor(
    private router: Router,
    private crudServices: CrudService,
    private statsService: SummaryService,
    private gVar: GlobalsService,
    private onboardService: CustomersService

  ) { }

  toggleModal(role: string) {
    this.detailsModal = !this.detailsModal;
    this.role = role;
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
          } else {
            // show toast
            this.gVar.toastr.info("No stats found", "Info");
          }
        })
        // console.log("stats:", this.stats) 
      }, error: (err) => {
        // console.log("err:", err)
        // show toast
        this.gVar.toastr.error("Error fetching stats", "Error");
      }

    })
  }

  getCustomers() {
    this.onboardService.getAllCustomers().subscribe({
      next: (data) => {
        console.log("customers:", data)
        this.allCustomers = data.data;
        if(this.allCustomers.length > 0 && Object.keys(this.stats).length > 0){
          this.gVar.spinner.hide();
        }
      }
    })
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
  tableContents = [
    {
      dateAdded: "22/06/21",
      tin: 'FBN1201',
      company: 'chc kimited',
      role: 'buyer',
      comapnyEmail: 'chc@gmail'

    },
    {
      dateAdded: "22/06/21",
      tin: 'FBN1201',
      company: 'chc kimited',
      role: 'supplier',
      comapnyEmail: 'chc@gmail'

    },
    {
      dateAdded: "22/06/21",
      tin: 'FBN1201',
      company: 'chc kimited',
      role: 'buyer',
      comapnyEmail: 'chc@gmail'

    },
    {
      dateAdded: "22/06/21",
      tin: 'FBN1201',
      company: 'chc kimited',
      role: 'buyer',
      comapnyEmail: 'chc@gmail'

    },
    {
      dateAdded: "22/06/21",
      tin: 'FBN1201',
      company: 'chc kimited',
      role: 'supplier',
      comapnyEmail: 'chc@gmail'

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
