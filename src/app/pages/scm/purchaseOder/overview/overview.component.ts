import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  private  gVars: GlobalsService,
  private router: Router

  ) { }


  navigate( tab: number) {
    this.router.navigate(['scm/invoice/pages']);
  }

  toggleDetailsModal() {
    this.isDetailsModalOpen = !this.isDetailsModalOpen;
  }
  tableHeaders = [
    {
      name: "Date"
    },
    {
      name: "Purchase Orsder No"
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
  ngOnInit(): void {
  }

}
