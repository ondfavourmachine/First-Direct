import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { IconProp } from '@fortawesome/fontawesome-svg-core';
// import { faSearch, faFilter, faFileEdit, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CrudService } from 'src/app/core/services/crudServices/crud.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  // searchIcon = faSearch as IconProp;
  // filterIcon = faFilter as IconProp;
  // edit = faFileEdit as IconProp;
  // del = faTrashCan as IconProp;
  tabNumber: Number = 1;
  constructor(
    private router : Router,
    private crudServices : CrudService
  ) { }

  toggleTabs(tabNumber: Number) {
    this.tabNumber = tabNumber;
    if(tabNumber === 1){
      this.router.navigateByUrl('/dashboard/onboarding')
      this.crudServices.updateHeaderTitle("Onboarding")
    } else if (tabNumber === 2){
      this.crudServices.updateHeaderTitle("Buyers")
    }else {
      this.crudServices.updateHeaderTitle("Suppliers")
    }
  };

  tableHeaders = [
    {
      name: "Date Added"
    },
    {
      name: "TIN"
    },
    {
      name: "Company"
    },
    {
      name: "Role"
    },
    {
      name: "Company Email"
    },
    {
      name: "Actions"
    },
  ]
  tableContents = [
    {
      dateAdded: "22/06/21",
      tin: 'FBN1201',
      company: 'chc kimited',
      role: 'buyer',
      comapnyEmail: 'chc@gmail'

    },
    {
      dateAdded: "22/06/21",
      tin: 'FBN1201',
      company: 'chc kimited',
      role: 'seller',
      comapnyEmail: 'chc@gmail'

    },
    {
      dateAdded: "22/06/21",
      tin: 'FBN1201',
      company: 'chc kimited',
      role: 'buyer',
      comapnyEmail: 'chc@gmail'

    },
    {
      dateAdded: "22/06/21",
      tin: 'FBN1201',
      company: 'chc kimited',
      role: 'buyer',
      comapnyEmail: 'chc@gmail'

    },
    {
      dateAdded: "22/06/21",
      tin: 'FBN1201',
      company: 'chc kimited',
      role: 'chief',
      comapnyEmail: 'chc@gmail'

    },

  ]

  syncTab(){
    this.crudServices.gettabNumber().subscribe({
      next: (data: any) => {
        this.tabNumber = data;
      }
    })
  }
  ngOnInit(): void {
    this.syncTab()

  }

}
