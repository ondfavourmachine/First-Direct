import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit {
  tabNumber: number = 1;
  constructor() { }

  toggleTabs(tabNumber: number) {
    this.tabNumber = tabNumber;
  }
  ngOnInit(): void {
  }

}
