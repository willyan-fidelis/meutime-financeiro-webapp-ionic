import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

//https://stackoverflow.com/questions/44294255/not-able-to-use-custom-names-in-input-output-with-ionic-3-and-angular

export interface TabModel{
  Name: string
  Page: string | any;
  Icon: string;
  Text: string;
}
export interface TabInterfaceModel{
  Selected: string
  TabList: Array<TabModel>;
}

@Component({
  selector: 'tabs',
  templateUrl: 'tabs.html'
})
export class TabsComponent {

  @Input('TabList')
  tabList: TabInterfaceModel;

  @Output()
  OnTabClickEvent: EventEmitter<TabModel> = new EventEmitter<TabModel>();

  
  constructor(public navCtrl: NavController) {
    console.log('Hello TabsComponent Component');
  }

  private tabClick(tab: TabModel) {
    this.OnTabClickEvent.emit(tab);
    this.navCtrl.setRoot(tab.Page)
}

}
