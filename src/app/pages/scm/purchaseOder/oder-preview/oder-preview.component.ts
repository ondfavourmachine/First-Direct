import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';
import { CustomersService } from 'src/app/core/services/scm/onboarding/customers/customers.service';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { ActivatedRoute } from '@angular/router';
import { LposService } from 'src/app/core/services/scm/purchase-oder/lpos.service';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-oder-preview',
  templateUrl: './oder-preview.component.html',
  styleUrls: ['./oder-preview.component.scss']
})
export class OderPreviewComponent implements OnInit {

  isSuccessModalOpen: Boolean = false;
  modalText: string = " Purchase order created successfully";
  preservedData : any = {};
  singleSupplier: any = [];
  singleBuyer: any = [];
  subtotal = 0;
  showEditBtn : Boolean = true;
  private previousUrl: string;
  private currentUrl: string;
  constructor(
    private crudServices: CrudService,
    private router: Router,
    private _route: ActivatedRoute,
    private customersService: CustomersService,
    private gVars: GlobalsService,
    private lposService: LposService,
    private location: Location
  ) { 

    this.currentUrl = this.router.url;
    this.previousUrl = null;

    this.router.events
                .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
                .subscribe((event: NavigationEnd) => {
                    this.previousUrl = this.currentUrl;
                    this.currentUrl = event.urlAfterRedirects;
                    console.log("prev: ", this.previousUrl)
                    console.log("curr: ", this.currentUrl)
                });


  }

  public getPreservedData() {
    this.gVars.spinner.show();
    this.crudServices.getLpoRequest().subscribe({
      next: (data: any) => {
        if(data === null) {
          this.router.navigate(['/scm/purchase-order']);
        } else {
        //  data.items.shift();
          this.preservedData = data;
          // console.log("data:", data)
          // if preservedData.items.item is null or undefined or emtpy string remove it from the array
          this.preservedData.items = this.preservedData.items.filter((item: any) => item.item !== null && item.item !== undefined && item.item !== "");

        this.subtotal = this.preservedData.total - this.preservedData.miscellaneous;
        this.getSingleSupplier(this.preservedData.supplierId);
        // this.getSingleBuyer(this.preservedData.buyerId);
        console.log("preservedData:", this.preservedData)
       
        }
      
      }
    })
  }


  closeSuccessModal() {
    this.isSuccessModalOpen = false;  
    this.router.navigate(['/scm/purchase-order']);
    this.crudServices.updateLpoRequest(null);
  }

  getSingleSupplier(id: number) {
    this.customersService.getCustomerById(id).subscribe({
      next: (data: any) => {
        console.log("supplier:", data)
        this.singleSupplier = data.data;
        this.gVars.spinner.hide();
      }
    })
  }

  getSingleBuyer(id: number) {
    this.customersService.getCustomerById(id).subscribe({
      next: (data: any) => {
        console.log("buyer:", data)
        this.singleBuyer = data.data;
        this.gVars.spinner.hide();
      }
    })
  }



  toggleSuccessModal() {
    this.gVars.spinner.show();
    this.lposService.addLpo(this.preservedData).subscribe({
      next: (data: any) => {
        console.log("data:", data)
        this.gVars.spinner.hide();
        this.isSuccessModalOpen = !this.isSuccessModalOpen;
      }, error: (error: any) => {
        this.gVars.spinner.hide();
        console.log("error:", error)
        this.gVars.toastr.error("Error creating LPO");
      }
    })

  }

  goBackToLastRoute() {
    this.location.back();
    this.crudServices.updateLpoRequest(this.preservedData);
  }
  

  ngOnInit(): void {
    this.getPreservedData();
  }

}
