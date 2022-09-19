import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { CustomersService } from 'src/app/core/services/scm/onboarding/customers/customers.service';

@Component({
  selector: 'app-customer-file-uploader',
  templateUrl: './customer-file-uploader.component.html',
  styleUrls: ['./customer-file-uploader.component.css']
})
export class CustomerFileUploaderComponent implements OnInit, AfterViewInit {

  role: string = "";
  bulkUploadResData: any = [];
  bulkUploadPayload: any = [];
  pasrsedData$: any = [];

  constructor(
    private router: Router,
    private crudServices: CrudService,
    private gVars: GlobalsService,
    private customersService: CustomersService,
    private _route: ActivatedRoute
  ) {
    this._route.params.subscribe(params => this.role = params['role']);
  }

  public getRole() {
    this.crudServices.getRole().subscribe({
      next: (data: any) => {
        this.role = data;
        // console.log(data)
      }
    })
  }

  getParsedData() {
    this.crudServices.getCustomerFileDetails().subscribe({
      next: (data: any) => {
        // store 2nd row of data
        this.pasrsedData$ = data;
        // if(this.pasrsedData$ === null){
        //   this.gVars.toastr.error("No Data Found");
        //   this.router.navigate([`/scm`])
        // }
        // this.pasrsedData$ = data;
         this.payLoad = [...this.pasrsedData$];
            // console.log("pay:", this.payLoad)
        // console.log("parsed data", this.pasrsedData$)
      }
    })

  }
  tableHeaders = [
    {
      name: `${this.role} Name`,
    },
    {
      name: 'Company Name',
    },
    {
      name: 'Inustry',
    },
    {
      name: 'Country',
    },
    {
      name: 'Currency',
    },
    {
      name: 'Company Email',
    },
    {
      name: 'Company Phone No',
    },
    {
      name: 'TIN',
    }, {
      name: 'RC Number',
    },
    {
      name: 'Tier',
    },
    {
      name: 'Limit',
    }
  ]

  payLoad = [];

  public updateHeaders() {
    if (this.role === "supplier") {
      this.tableHeaders = [
        ...this.tableHeaders,
        {
          name: ' Minimum Annual Spend',
        },
        {
          name: 'Maximum Annual Spend',
        },
        {
          name: 'Bnak Name',
        },
        {
          name: 'Account Number',
        },

      ]
    }
  }

  // go back to last route
  public goBack() {
    this.router.navigate([`/scm`])
    this.crudServices.updateCustomerFileDetails(null);
  }

  getCustomerFile() {
    this.gVars.spinner.show();
    this.crudServices.getCustomerFileDetails().subscribe({
      next: (data: any) => {
        // console.log(data)
        this.bulkUploadPayload = data;
        // console.log(this.bulkUploadPayload)

        this.customersService.uploadCustomerFile(this.bulkUploadPayload, this.role).subscribe({
          next: (data: any) => {
            this.gVars.spinner.hide();
            this.gVars.toastr.info("File Uploaded Successfully");
            this.bulkUploadResData = data.data;

            // spread results into payload
           
          }, error: (err: any) => {
            this.gVars.spinner.hide();
           setTimeout(() => {
            this.gVars.toastr.error("Error Occured");
            }, 3000);
          }
        })
        // this.bulkUploadResData = data;
      }
    })
  }
  ngAfterViewInit(): void {
    // this.getCustomerFile(this.role);
    setTimeout(() => {
      this.getParsedData();
    }, 3000);
  }

  upLoadFile() {
    if(this.role === "supplier"){
      this.customersService.uploadSupplierFile(this.payLoad).subscribe({
        next: (data: any) => {
          this.gVars.spinner.hide();
          this.gVars.toastr.info("File Uploaded Successfully");
          this.router.navigate([`/scm`])
          // this.bulkUploadResData = data.data;
          // console.log("data", data)
        } , error: (err: any) => {
          this.gVars.spinner.hide();
          this.gVars.toastr.error("Error Occured");
          this.router.navigate([`/scm`])
          this.crudServices.updateCustomerFileDetails(null)
        }
      })
    } else {
      this.customersService.uploadBuyerFile(this.payLoad).subscribe({
        next: (data: any) => {
          this.gVars.spinner.hide();
          this.gVars.toastr.info("File Uploaded Successfully");
          this.router.navigate([`/scm`])
          // this.bulkUploadResData = data.data;
          // console.log("data", data)
        } , error: (err: any) => {
          this.gVars.spinner.hide();
          this.gVars.toastr.error("Error Occured");
          this.router.navigate([`/scm`])
          this.crudServices.updateCustomerFileDetails(null)
        }
      })
    }
  }

  ngOnInit(): void {
    this.updateHeaders();
    this.getRole();
  
   
    // this.getCustomerFile();
  }

}
