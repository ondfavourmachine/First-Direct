import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
// import { IconProp } from '@fortawesome/fontawesome-svg-core';
// import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
// import { faFileEdit } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  _tableHeaders: any = [];
  deleteModalOpen : boolean = false
  detailModal: Boolean = false;
  

  get tableHeaders(): [] {
    return this._tableHeaders;
  };

  @Input()
  set tableHeaders(tableHeaders: []) {
    this._tableHeaders = tableHeaders;
  };

  @Output() clicker = new EventEmitter();

  onClick(){
      this.clicker.emit()
  }

  constructor() { }

 
  ngOnInit(): void {
  }

}
