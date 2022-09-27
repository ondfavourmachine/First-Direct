import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';;
import { Router } from '@angular/router';
import { GlobalsService } from 'src/app/core/globals/globals.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(
    private crudServices: CrudService,
    private router: Router,
    private gVar: GlobalsService
  ) { }


  navigateToForm() {
    this.router.navigate(['scm/invoice/create-invoice']);
  }

  ngOnInit(): void {
  }

}
