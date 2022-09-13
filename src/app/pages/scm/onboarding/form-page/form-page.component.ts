import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss']
})
export class FormPageComponent implements OnInit {

  role: string = "";
  constructor(
    private crudServices: CrudService,
   private router : Router,
   private _route : ActivatedRoute
  ) {
    this._route.params.subscribe(params => this.role = params['role']);
   }

  public getRole(){
    this.crudServices.getRole().subscribe({
      next: (data:any) =>{
        this.role = data;
        console.log(data)
      }
    })
  }
  ngOnInit(): void {
  }

}
