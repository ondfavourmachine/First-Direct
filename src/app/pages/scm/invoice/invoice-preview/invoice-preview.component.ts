import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.scss']
})
export class InvoicePreviewComponent implements OnInit {
  isSuccessModalOpen: Boolean = false;
  modalText: string = " Invooice created successfully"
  constructor(
    private router: Router
  ) { } 

  toggleSuccessModal() {
    this.isSuccessModalOpen = !this.isSuccessModalOpen;
  }



  ngOnInit(): void {
  }

}
