import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { IconProp } from '@fortawesome/fontawesome-svg-core';
// import { faSearch, faFilter, faFileEdit, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { CustomersService } from 'src/app/core/services/scm/onboarding/customers/customers.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  tabNumber: Number = 1;
  allCustomers = [];
  buyers = [];
  suppliers = [];
  detailsModal: Boolean = false;
  role: string = "";
  deleteModalOpen: boolean = false;
  customerId: number = 0;
  // empty state check
  buyersEmptyState: Boolean = false;
  suppliersEmptyState: Boolean = false;
  allCustomersEmptyState: Boolean = false;
  singleCustomer: any = [];
  PageNumber: number = 1;
  PageSize: number = 10;
  SearchQuery: string = "";
  searchForm: FormGroup;
  SortColumn: string = "";
  constructor(
    private router: Router,
    private crudServices: CrudService,
    private onboardService: CustomersService,
    private gVar: GlobalsService,
    private formBuilder: FormBuilder
  ) {
    this.searchForm = this.formBuilder.group({
      search: ['', Validators.required]
    });
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
        console.log("single customer:", data)
        this.gVar.spinner.hide();
        this.singleCustomer = data.data;
      }
    })
    console.log("role:", this.role)
  }

  closeDetailsModal() {
    this.detailsModal = false;
  }

  toggleDeleteModal() {
    this.deleteModalOpen = !this.deleteModalOpen;
  };

  searchCustomer() {
    this.SearchQuery = this.searchForm.value.search;
    if (this.tabNumber === 1) {
      this.getCustomers();
    } else if (this.tabNumber === 2) {
      this.getBuyers();
    } else {
      this.getSuppliers();
    }
  }

  nextPage() {
    this.PageNumber++;
    if (this.tabNumber === 1) {
      this.getCustomers();
    } else if (this.tabNumber === 2) {
      this.getBuyers();
    } else {
      this.getSuppliers();
    }
  }

  previousPage() {
    this.PageNumber = this.PageNumber - 1;
    if (this.tabNumber === 1) {
      this.getCustomers();
    } else if (this.tabNumber === 2) {
      this.getBuyers();
    } else {
      this.getSuppliers();
    }
  }


  toggleTabs(tabNumber: Number) {
    this.tabNumber = tabNumber;
    if (tabNumber === 1) {
      this.router.navigateByUrl('scm/overview')
      this.crudServices.updateHeaderTitle("Onboarding")
    } else if (tabNumber === 2) {
      this.crudServices.updateHeaderTitle("Buyers")
    } else {
      this.crudServices.updateHeaderTitle("Suppliers")
    }
  };

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
        this.getBuyers();
        this.getSuppliers();
      }, error: (err) => {
        this.gVar.spinner.hide();
        // console.log("err:", err)
        this.gVar.toastr.error("Error deleting customer", "Error");
      }
    })
  }
  getCustomers() {
    this.onboardService.getAllCustomers(this.SearchQuery, this.SortColumn , this.PageNumber, this.PageSize).subscribe({
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

      }, error: (err) => {
        // console.log("err:", err)
        // show toast
        this.gVar.toastr.error("Error fetching data", "Error");
      }
    })
  }

  getBuyers() {
    this.onboardService.getBuyers(this.SearchQuery, this.PageNumber, this.PageSize).subscribe({
      next: (data) => {
        // console.log("buyers:", data)
        this.buyers = data.data;
        if (data.message === "Successful") {
          this.gVar.spinner.hide();
        }
        if (this.buyers.length === 0) {
          this.buyersEmptyState = true;
        } else {
          this.buyersEmptyState = false;
        }
      }, error: (err) => {
        // console.log("err:", err)
        // show toast
        this.gVar.toastr.error("Error fetching data", "Error");
      }
    })
  }

  getSuppliers() {
    this.onboardService.getSuppliers(this.SearchQuery, this.PageNumber, this.PageSize).subscribe({
      next: (data) => {
        // console.log("suppliers:", data)
        this.suppliers = data.data;
        if (data.message === "Successful") {
          this.gVar.spinner.hide();
        }

        if (this.suppliers.length === 0) {
          this.suppliersEmptyState = true;
        } else {
          this.suppliersEmptyState = false;
        }

      }, error: (err) => {
        // console.log("err:", err)
        // show toast
        this.gVar.toastr.error("Error fetching data", "Error");
      }
    })
  }

  edit(role: string, id: number) {
    this.router.navigateByUrl('scm/edit-form/' + role + '/' + id);
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
  filterTableHeaders = [
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
      name: "Company Email"
    },
    {
      name: "Actions"
    },
  ]

  syncTab() {
    this.crudServices.gettabNumber().subscribe({
      next: (data: any) => {
        this.tabNumber = data;
      }
    })
  }


  ngOnInit(): void {
    this.gVar.spinner.show();
    this.syncTab()
    this.getCustomers()
    this.getBuyers()
    this.getSuppliers()
  }

}
