import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { IconProp } from '@fortawesome/fontawesome-svg-core';
// import { faSearch, faFilter, faFileEdit, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { CustomersService } from 'src/app/core/services/scm/onboarding/customers/customers.service';

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

  // empty state check
  buyersEmptyState : Boolean = false;
  suppliersEmptyState : Boolean = false;
  allCustomersEmptyState : Boolean = false;

  constructor(
    private router : Router,
    private crudServices : CrudService,
    private onboardService: CustomersService,
    private gVar: GlobalsService
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


  toggleTabs(tabNumber: Number) {
    this.tabNumber = tabNumber;
    if(tabNumber === 1){
      this.router.navigateByUrl('scm/overview')
      this.crudServices.updateHeaderTitle("Onboarding")
    } else if (tabNumber === 2){
      this.crudServices.updateHeaderTitle("Buyers")
    }else {
      this.crudServices.updateHeaderTitle("Suppliers")
    }
  };

  getCustomers() {
    this.onboardService.getAllCustomers().subscribe({
      next: (data) => {
        // console.log("customers:", data)
        this.allCustomers = data.data;
        if(data.message ===  "Successful" ){
          this.gVar.spinner.hide();
        }

        if(this.allCustomers.length === 0 ){
          this.allCustomersEmptyState = true;
        }else {
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
    this.onboardService.getBuyers().subscribe({
      next: (data) => {
        // console.log("buyers:", data)
        this.buyers = data.data;
        if(data.message ===  "Successful" ){
          this.gVar.spinner.hide();
        }
        if(this.buyers.length === 0 ){
          this.buyersEmptyState = true;
        }else {
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
    this.onboardService.getSuppliers().subscribe({
      next: (data) => {
        // console.log("suppliers:", data)
        this.suppliers = data.data;
        if(data.message ===  "Successful" ){
          this.gVar.spinner.hide();
        }

        if(this.suppliers.length === 0 ){
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
 
  syncTab(){
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
