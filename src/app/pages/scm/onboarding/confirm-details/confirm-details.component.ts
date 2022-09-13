import { Component, OnInit } from '@angular/core';
import { addCustomer } from 'src/app/core/models/scm/onboarding.model';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';

@Component({
  selector: 'app-confirm-details',
  templateUrl: './confirm-details.component.html',
  styleUrls: ['./confirm-details.component.scss']
})
export class ConfirmDetailsComponent implements OnInit {
customerDetails : addCustomer ;
today = new Date();
  isSuccessModalOpen: Boolean = false;

  toggleSuccessModal(){
    this.isSuccessModalOpen = !this.isSuccessModalOpen;
  }
  constructor(
    private crudServices: CrudService,
  ) { }

  public getCustomerDetails(){
    this.crudServices.getCustomerDetails().subscribe({
      next: (data:any) =>{
        this.customerDetails = data;
        console.log("customerDetails:",this.customerDetails)
      }
    })
  }
  ngOnInit(): void {
    this.getCustomerDetails();
  }

}
