import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';;
import { Router } from '@angular/router';
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
  constructor(
    private crudServices: CrudService,
    private router: Router,
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
  }

  addSeller(): void {
    this.modalTitle = "Onboard New Supplier";
    this.customerType = "Supplier";
    this.showModal = !this.showModal;
  }

  closeModal() {
    this.showModal = false
  }

  public changeListener(files: FileList) {
    // console.log(files);
    if (files && files.length > 0) {
      let file: File = files.item(0);
      //  console.log(file.name);
      //  console.log(file.size);
      //  console.log(file.type);
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        let csv: string = reader.result as string;
        // console.log(csv);
      }
    }
  }

  navigate() {

    if (this.customerType === "Buyer") {
      this.crudServices.updateRole('buyer');
    } else {
      this.crudServices.updateRole('supplier');
    }

    this.crudServices.getRole().subscribe({
      next: (data: any) => {
        this.role = data;
        this.router.navigateByUrl(`/scm/add-new/${this.role}`)
      }
    })

  }

  ngOnInit(): void {
    this.getHeaderTitle()
  }

}
