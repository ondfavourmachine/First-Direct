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
  tableHeaders = [
    {
      name: 'S/N',
    },
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
      name: 'Rank',
    },
    {
      name: 'Tier',
    },
    {
      name: 'Limit',
    }
  ]

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
  }

  getCustomerFile() {
    this.gVars.spinner.show();
    this.crudServices.getCustomerFileDetails().subscribe({
      next: (data: any) => {
        // console.log(data)
        this.bulkUploadPayload = data;
        console.log(this.bulkUploadPayload)

        this.customersService.uploadCustomerFile(this.bulkUploadPayload, this.role).subscribe({
          next: (data: any) => {
            this.gVars.spinner.hide();
            this.gVars.toastr.info("File Uploaded Successfully");
            this.bulkUploadResData = data.data;
            console.log(data)
          }, error: (err: any) => {
            this.gVars.spinner.hide();
            this.gVars.toastr.error("Error Occured");
          }
        })
        // this.bulkUploadResData = data;
      }
    })
  }
  ngAfterViewInit(): void {
    // this.getCustomerFile(this.role);
  }
  ngOnInit(): void {
    this.updateHeaders();
    this.getRole();

    this.getCustomerFile();
  }

}
