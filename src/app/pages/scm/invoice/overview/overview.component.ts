import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { CustomersService } from 'src/app/core/services/scm/onboarding/customers/customers.service';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

isDetailsModalOpen: boolean = false;

  constructor(
    private customersService: CustomersService,
  private  gVars: GlobalsService
  ) { }



  toggleDetailsModal() {
    this.isDetailsModalOpen = !this.isDetailsModalOpen;
  }

  tableHeaders = [
  {
    name: "Date"
  },
  {
    name: "Invoice No"
  },
  {
    name: "buyer"
  },
  {
    name: "Supplier"
  },
  {
    name: "Amount"
  },
  {
    name: "Status"
  },
]

  ngOnInit(): void {
   
  }

}
