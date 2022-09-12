import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-details',
  templateUrl: './confirm-details.component.html',
  styleUrls: ['./confirm-details.component.scss']
})
export class ConfirmDetailsComponent implements OnInit {

  isSuccessModalOpen: Boolean = false;

  toggleSuccessModal(){
    this.isSuccessModalOpen = !this.isSuccessModalOpen;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
