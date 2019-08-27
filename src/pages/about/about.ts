import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//TAB Pages --->
import { TabsComponent,TabInterfaceModel } from '../../components/tabs/tabs';
//import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { GrouplistPage } from '../grouplist/grouplist';
import { GroupoverviewPage } from '../groupoverview/groupoverview';
//TAB Pages <---

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController) {

  }

  //Barra de navegação TAB --->
  private tabObject: TabInterfaceModel = {Selected:"AboutPage",TabList:[{Name:"GroupoverviewPage",Page:GroupoverviewPage,Icon:"home",Text:"Home"},{Name:"GrouplistPage",Page:GrouplistPage,Icon:"list",Text:"Grupos"},{Name:"ContactPage",Page:ContactPage,Icon:"person",Text:"Conta"},{Name:"AboutPage",Page:AboutPage,Icon:"help",Text:"Ajuda"}]};
  private tabClick(tab: any){
    console.log("Tab is: ",tab);
  }
  //Barra de navegação TAB --->

}
