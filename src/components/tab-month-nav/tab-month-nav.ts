import { Component, Input, Output, EventEmitter } from '@angular/core';
//https://stackoverflow.com/questions/44294255/not-able-to-use-custom-names-in-input-output-with-ionic-3-and-angular

@Component({
  selector: 'tab-month-nav',
  templateUrl: 'tab-month-nav.html'
})
export class TabMonthNavComponent {

  // @Input('InitYear')
  // initYear: number = 2019;
  // @Input('InitYear')
  // initMonth: number = 1;

  @Input('TabValue')
  tabValue: number;

  @Output()
  OnNextClickEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  OnPreviousClickEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  OnCurrentClickEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  text: string;

  constructor() {
    console.log('Hello TabMonthNavComponent Component');
    this.text = 'Hello World';
  }

  private nextClick() {
    this.OnNextClickEvent.emit(true);
  }
  private previousClick() {
    this.OnPreviousClickEvent.emit(true);
  }
  private currentClick() {
    this.OnCurrentClickEvent.emit(true);
  }

}
