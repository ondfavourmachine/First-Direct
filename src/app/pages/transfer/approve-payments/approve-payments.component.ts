import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-approve-payments',
  templateUrl: './approve-payments.component.html',
  styleUrls: ['./approve-payments.component.css']
})
export class ApprovePaymentsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  inputValidator(event: any) {
    const pattern = /^[a-zA-Z0-9]*$/;   
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^a-zA-Z]/g, "");
      // invalid character, prevent input
    }
  }

}
