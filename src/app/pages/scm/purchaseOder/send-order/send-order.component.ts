import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-order',
  templateUrl: './send-order.component.html',
  styleUrls: ['./send-order.component.css']
})
export class SendOrderComponent implements OnInit {

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
