import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';;
import { Router } from '@angular/router';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { CustomersService } from 'src/app/core/services/scm/onboarding/customers/customers.service';
import { Observable, ReplaySubject } from 'rxjs';
import * as XLSX from 'xlsx';
import { uploadCustomerFileModel } from 'src/app/core/models/scm/onboarding.model';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  headerTitle$: string = "Onboard New Buyer";
  modalTitle: string = "Onboard New Buyer";
  showModal: Boolean = false;
  customerType: string = "";
  role: string = "";
    base64: any= [] ;
  constructor(
    private crudServices: CrudService,
    private router: Router,
    private gVar: GlobalsService,
    private customerService: CustomersService
  ) { }


  getHeaderTitle() {
    this.crudServices.getHeaderTitle().subscribe({
      next: (data: any) => {
        this.headerTitle$ = data;
      }
    })
  }



  addBuyer(): void {
    this.modalTitle = "Onboard New Buyer";
    this.showModal = !this.showModal;
    this.customerType = "Buyer";
    this.crudServices.updateCustomerDetails(null);
    this.crudServices.updateEditor(null);
  }

  addSeller(): void {
    this.modalTitle = "Onboard New Supplier";
    this.customerType = "Supplier";
    this.showModal = !this.showModal;
    this.crudServices.updateCustomerDetails(null);
    this.crudServices.updateEditor(null);
  }

  closeModal() {
    this.showModal = false
  }

  convertFile(file : File) : Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => {
      result.next(btoa(event.target.result.toString()));
     let binary = event.target.result;
      // let wb = XLSX.read(binary, {type: 'binary'});
      // let wsname = wb.SheetNames[0];
      // let ws = wb.Sheets[wsname];
      // let data = XLSX.utils.sheet_to_json(ws, {header: 1});
      // console.log(data);
      

      let wb = XLSX.read(binary, { type: 'binary' });
      // let wsname = wb.SheetNames[0];
      // let ws = wb.Sheets[wsname];
      // let data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      // console.log(data);
      // this.crudServices.updateCustomerFileDetails(data);
      wb.SheetNames.forEach((sheetName) => {
        let data = XLSX.utils.sheet_to_json(wb.Sheets[sheetName])
        this.crudServices.updateCustomerFileDetails(data);
        // console.log(data)
      })
    };
    
    return result;
  }

  public changeListener(files: File) {
    if (this.customerType === "Buyer") {
      this.crudServices.updateRole('buyer');
    } else {
      this.crudServices.updateRole('supplier');
    }
    // console.log(files);
  
    if (files ) {
      this.gVar.toastr.info("Uploading  Please Wait , please wait");
      this.convertFile(files).subscribe({
        next: (data) => {
          // console.log(data);
          this.base64 ={
            "documentBaser64String": "data:@file/octet-stream;base64," + data,
            "documentName": files.name,
            "countryId": "01"
          }
        //  this.crudServices.updateCustomerFileDetails(this.base64);
        }
      })     
    }
    this.crudServices.getRole().subscribe({
      next: (data: any) => {
        this.role = data;
        this.router.navigateByUrl(`scm/onboarding/upload-customer/${this.role}`)
      }
    })
    
  }

  navigate(path: string) {

    if (this.customerType === "Buyer") {
      this.crudServices.updateRole('buyer');
    } else {
      this.crudServices.updateRole('supplier');
    }

    this.crudServices.getRole().subscribe({
      next: (data: any) => {
        this.role = data;
        this.router.navigateByUrl(`/${path}/${this.role}`)
      }
    })

  }

  ngOnInit(): void {
    this.getHeaderTitle();
    // this.customerService.getSessions().subscribe({
    //   next: (data: any) => {
    //     console.log(data);
    //   }
    // })
  }

}
