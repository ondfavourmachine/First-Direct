import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  navigateToForm() {
    this.router.navigate(['scm/purchase-order/create-order']);
  }

  navigateToOrderUploader(){
    this.router.navigate(['scm/purchase-order/order-file-uploader']);
  }

  ngOnInit(): void {
  }

}
