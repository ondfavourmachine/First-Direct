import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { IconProp } from '@fortawesome/fontawesome-svg-core';
// import { faPlus } from '@fortawesome/free-solid-svg-icons';
// import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-header-scm',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
public _headerTitle: string;
public _btnText1: string;
public _btnAction1: string;
public _btnText2: string;

//  addIcon = faPlusSquare as IconProp;

get headerTitle(): string{
  return this._headerTitle;
}

@Input()
set headerTitle(headerTitle: string){
  this._headerTitle = headerTitle;
}

get btnText1(): string{
  return this._btnText1;
}

@Input()
set btnText1(btnText1: string){
  this._btnText1 = btnText1;
}

get btnText2(): string{
  return this._btnText2;
}

@Input()
set btnText2(btnText2: string){
  this._btnText2 = btnText2;
}
get btnAction1(): string{
  return this._btnAction1;
}

@Input()
set btnAction1(btnAction1: string){
  this._btnAction1 = btnAction1;
}

@Output() clicker = new EventEmitter();

@Output() clicker2 = new EventEmitter();

onClick(){
    this.clicker.emit()
}
onClick2(){
    this.clicker2.emit()
}
  constructor() { }

  ngOnInit(): void {
  }

}
