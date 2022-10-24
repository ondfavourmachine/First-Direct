import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(
    private router: Router,

    private crudService: CrudService,
    private location: Location

  ) { }

  headerTitle = "Purchase Order";

  navigateToForm() {
    this.router.navigate(['scm/purchase-order/create-order']);
    this.crudService.updateLpoRequest(null);
  }

  navigate(tab: number) {
    this.crudService.updateLpoTabNumber(tab);
    this.router.navigate(['scm/purchase-order/pages']);
  }

  navigateToOrderUploader() {
    this.router.navigate(['scm/purchase-order/order-file-uploader']);
  }

  getHeaderTitle(): string {
    this.crudService.getLpoHeaderTitle().subscribe({
      next: (data: any) => {
        this.headerTitle = data;
      }
    })
    return this.headerTitle;
  }

  ngOnInit(): void {
      this.getHeaderTitle();

  }

}
