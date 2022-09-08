import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  @Input() item
  @Output('confirmEvent') 
  confirmForm = new EventEmitter<any>();
  payload = {
    action: ''
  }
  
  constructor() { }

  ngOnInit(): void {
  }

  proceed() {
    if(this.item == 'add') {
      this.payload.action = 'add'
    }

    if(this.item == 'pub') {
      this.payload.action = 'pub'
    }

    if(this.item == 'save') {
      this.payload.action = 'save'
    }

    if(this.item == 'del') {
      // alert('del');
      this.payload.action = 'del'
    }
    this.confirmForm.emit(this.payload);
    $('#confirm').modal('hide');
  }

}
