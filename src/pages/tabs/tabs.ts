import { Component } from '@angular/core';
import { NavController, ModalController, Events } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { GrouplistPage } from '../grouplist/grouplist';
import { GroupoverviewPage } from '../groupoverview/groupoverview';

import {UserProvider } from '../../providers/user/user';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  
  tab0Root = GroupoverviewPage;
  tab1Root = GrouplistPage;
  tab2Root = ContactPage;
  tab3Root = AboutPage;

  constructor(public navCtrl: NavController, public user: UserProvider) {
    //this.user.userIsLoggedIn()
  }

  private setRoot(page: any){
    this.navCtrl.setRoot(page);
  }
}
