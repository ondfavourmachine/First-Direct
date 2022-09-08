import { Component, OnChanges, Output, SimpleChanges, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-generic-modal',
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.css']
})
export class GenericModalComponent implements OnChanges{
    constructor()
    {
        console.log('construct')    
    }

    @Output() eventClick = new EventEmitter()
    ngOnChanges(changes: SimpleChanges): void {
        console.log('ngHook')
    }

    DoLogout()
    {
       this.eventClick.emit('logout')
    }

}