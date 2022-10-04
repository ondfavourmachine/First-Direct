import { Component, OnInit } from '@angular/core';

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
  modalText: string = "Successful"
  constructor() { }
  toggleTabs(tabNumber: Number) {
    this.tabNumber = tabNumber;
    // if (tabNumber === 1) {
    //   this.router.navigateByUrl('scm/onboarding/overview')
    //   this.crudServices.updateHeaderTitle("Onboarding")
    // } else if (tabNumber === 2) {
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

  toggleSuccesModal() {
    this.isSuccesModalOpen = !this.isSuccesModalOpen;
  }

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

  toggleDetailsModal() {
    this.isDetailsModalOpen = !this.isDetailsModalOpen;
  }
  ngOnInit(): void {
  }

}
