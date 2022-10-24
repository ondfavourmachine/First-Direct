import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { Observable, ReplaySubject } from 'rxjs';
import { addLpoModel, requestLpoBody } from 'src/app/core/models/scm/LPO.model';
import { Router } from '@angular/router';
import { userRoleModel } from 'src/app/core/models/scm/onboarding.model';
import { CustomersService } from 'src/app/core/services/scm/onboarding/customers/customers.service';
@Component({
  selector: 'app-oder-file-uploader',
  templateUrl: './oder-file-uploader.component.html',
  styleUrls: ['./oder-file-uploader.component.css']
})
export class OderFileUploaderComponent implements OnInit {
  fileName: string = "Drop your files here, or browse";
  addLpoPayLoad: addLpoModel = {
    session: "",
    username: "",
    subsidiaryId: "",
    supplierId: 0,
    purchaseOrderDate: "",
    purchaseOrderNo: "",
    subsidiaryCode: "",
    // buyerId: 0,
    supplyDate: "",
    paymentDueDate: "",
    purchaseOrderSummary: "",
    acceptedOffline: false,
    paymentTerms: "",
    additionalInformation: "",
    hasAttachment: false,
    purchaseOrderStatus: "",
    // tax: 0,
    // discount: 0,
    miscellaneous: 0,
    total: 0,
    currencyCode: "",
    countryId: "",
    dateCreated: "",
    items: [
      {
        item: "",
        unitPrice: 0,
        quantity: 0,
        amount: 0,
      }
    ],
    attachments: [
      {
        fileName: "",
        documentBase64: "",
      }
    ]
  }

  userLoad: userRoleModel;
  requestBody: requestLpoBody;
  SortColumn: string = "";
  PageNumber: number = 1;
  PageSize: number = 10;
  SearchQuery: string = "";
  suppliers: any = [];

  fileData: any = [];
  constructor(
    private customersService: CustomersService,
    private router: Router,
    private crudServices: CrudService,
    private gVar: GlobalsService
  ) {
    this.userLoad = this.gVar.checkRoute(this.gVar.router.url);
    this.requestBody = {
      "searchQuery": this.SearchQuery,
      "sortColumn": this.SortColumn,
      "pageNumber": this.PageNumber,
      "pageSize": this.PageSize,
      "session": this.userLoad?.session,
      "username": this.userLoad?.username,
      "subsidiaryId": this.userLoad?.subsidiaryId.toString(),
      "countryId": "01",
      "filter": ""
    }
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => {
      result.next(btoa(event.target.result.toString()));
      let binary = event.target.result;
      let wb = XLSX.read(binary, { type: 'binary' });
      wb.SheetNames.forEach((sheetName) => {
        let data = XLSX.utils.sheet_to_json(wb.Sheets[sheetName])
        console.log(data)
        const itemsObject: any = [
          {
            "item": "",
            "unitPrice": 0,
            "quantity": 0,
            "amount": 0,
          }
        ]

        data.forEach((element: any) => {
          this.fileData.push({
            "purchaseOrderNo": element['Purchase Order No'],
            "supplyDate": element['Date Of Supply'],
            "paymentDueDate": element['Due Date Of Payment'],
            "purchaseOrderSummary": element['Purchase Order Summary'],
            "paymentTerms": element['Payment  Terms'],
            "total": element['Total'],
            "miscellaneous": element['Miscellaneous'],
            "dateCreated": element['Date Of Creation'],
          })

          itemsObject.push({
            "item": element['Item Names'],
            "unitPrice": element['Price Per Units'],
            "quantity": element['Quantities'],
            "amount": element['Amount'],
          })

          this.addLpoPayLoad = this.fileData[0];
          this.addLpoPayLoad = {
            ...this.addLpoPayLoad,
            items: itemsObject,
            ...this.requestBody
          }

          // if (this.addLpoPayLoad.supplierId <= 0) {
            // filter supplierId from supllier name  from suppliers array
            this.suppliers.filter((supplier: any) => {
              if (supplier.customerName === element['Supplier']) {
                // console.log(supplier?.id)
                this.gVar.spinner.hide();
                this.addLpoPayLoad.supplierId = supplier?.id;
                console.log("fileData", this.addLpoPayLoad)
                this.crudServices.updateLpoRequest(this.addLpoPayLoad);
                if(this.addLpoPayLoad.supplierId > 0){

                  this.gVar.toastr.success("Data extracted successfully, transfering to confirmation page");
                  this.gVar.spinner.hide();
                  this.router.navigate(['/scm/purchase-order/order-preview']);
                } else {
                  this.gVar.toastr.error("Supplier not found, please check the supplier name and try again");
                  this.gVar.spinner.hide();
                }
              }
            })

          // }
          //  else {
          //   this.gVar.toastr.error("Supplier not found, please check the supplier name and try again");
          // }





        });

      })
    };

    return result;
  }

  next() {
    if(this.addLpoPayLoad.supplierId > 0){
    console.log("fileData", this.addLpoPayLoad)
    this.crudServices.updateLpoRequest(this.addLpoPayLoad);
    this.gVar.toastr.success("Data extracted successfully, transfering to confirmation page");
    this.gVar.spinner.hide();
    this.router.navigate(['/scm/purchase-order/order-preview']);
  } else {
    this.gVar.toastr.error("Supplier not found, please check the supplier name and try again");
    this.gVar.spinner.hide();
  }

  }


  onFileChange(event) {
    this.gVar.toastr.info("Extracting data from file, please wait...");
    this.gVar.spinner.show();
    if (event.target.files.length > 0) {

      const file = event.target.files[0];
      this.fileName = file.name;
      this.convertFile(file).subscribe({
        next: (data: any) => {
          // console.log(data)
        }
      })

      // console.log(file);
    }
  }

  getSuppliers() {
    this.gVar.spinner.show();
    this.customersService.getSuppliers(this.requestBody).subscribe({
      next: (res) => {
        this.gVar.spinner.hide();
        this.suppliers = res.data;
        // console.log("Suppliers", this.suppliers);
      }, error: (err) => {
        this.gVar.spinner.hide();
        this.gVar.toastr.error("Error fetching data");
      }
    })

  }

  ngOnInit(): void {
    this.getSuppliers();
  }

}
