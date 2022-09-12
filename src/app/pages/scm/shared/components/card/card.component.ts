import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
public _cardTitle: string;
public _figure: number;
  constructor() { }

  get cardTitle(): string{
    return this._cardTitle;
  }
  
  @Input()
  set cardTitle(cardTitle: string){
    this._cardTitle = cardTitle;
  }

  get figure(): number{
    return this._figure;
  }

  @Input()
  set figure(figure: number){
    this._figure = figure
  }
  @Output() clicker = new EventEmitter();


  direct() {
    this.clicker.emit()
  }

  ngOnInit(): void {
  }

}
