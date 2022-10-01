import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-invoice',
  templateUrl: './send-invoice.component.html',
  styleUrls: ['./send-invoice.component.css']
})
export class SendInvoiceComponent implements OnInit {
  isSuccessModalOpen: Boolean = false;
  modalText: string = " Invooice sent successfully"
  constructor(
    private router: Router
  ) { } 

  toggleSuccessModal() {
    this.isSuccessModalOpen = !this.isSuccessModalOpen;
  }
  ngOnInit(): void {
  }

}
