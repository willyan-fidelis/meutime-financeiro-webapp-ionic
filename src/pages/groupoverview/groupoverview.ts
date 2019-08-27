import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, Events } from 'ionic-angular';
import {ConfigProvider } from '../../providers/config/config';
import {GroupProvider, GroupEvents, selectedGroupEnun } from '../../providers/group/group';
import {AlertProvider } from '../../providers/alert/alert';

import { GroupdetailPage } from '../groupdetail/groupdetail';
import { GroupmembersPage } from '../groupmembers/groupmembers';
import { GroupinvitationsPage } from '../groupinvitations/groupinvitations';

import { FormatNumber } from '../../staticUtil/staticStringUtil';
import { AppProvider } from '../../providers/app/app';

//TAB Pages --->
import { TabsComponent,TabInterfaceModel } from '../../components/tabs/tabs';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { GrouplistPage } from '../grouplist/grouplist';
//import { GroupoverviewPage } from '../groupoverview/groupoverview';
//TAB Pages <---

@Component({
  selector: 'page-groupoverview',
  templateUrl: 'groupoverview.html',
})
export class GroupoverviewPage {

  private showAsModal: boolean = false;

  constructor(public app: AppProvider, public navParams: NavParams, public alert: AlertProvider, public group: GroupProvider, public events: Events, public modalCtrl: ModalController, public config: ConfigProvider, public viewCtrl: ViewController, public navCtrl: NavController) {
    
    this.ionViewDidLoad();
    if(this.app.pageFirstTimeLoaded("GroupoverviewPage")){this.group.getUserGroupsAndCashFlow();}
    

    this.events.subscribe(GroupEvents.OnGotGroupUsers,(data)=>{
      if(this.group.getUsergroups().length>0){this.events.subscribe(GroupEvents.OnGotUserGroupsAndCashFlow,()=>{if(this.group.getUsergroups().length>0){if(this.group.getSelectedGroup() == selectedGroupEnun.NONE){this.group.setSelectedGroup(0)}};});this.alert.showLoading("Carregando dados do grupo..",2000)};
    })

    this.events.subscribe(GroupEvents.OnDeleteGroup,(data)=>{this.alert.showOk("Atenção","Grupo deletado!","Ok",()=>{this.group.getUserGroupsAndCashFlow();});})
    this.events.subscribe(GroupEvents.OnDeleteGroupError,(data)=>{this.alert.showOk("Atenção","Não foi possível apagar o grupo. Talvez voce não tenha esse provilégio ou existem cobranças lançadas nesse grupo!","Ok",()=>{});})
  }

  ionViewDidLoad() {
    this.showAsModal = this.navParams.get("showAsModal");
  }

  private groupDetail(){
    return (this.group.getSelectedGroup() != selectedGroupEnun.NONE) ? this.group.getUsergroups()[this.group.getSelectedGroup()] : null;
  }
  private groupCashFlow(){
    return (this.group.getSelectedGroup() != selectedGroupEnun.NONE) ? this.group.groupsCashFlow[this.group.getSelectedGroup()] : null;
  }
  private groupCashIn(){
    return (this.group.getSelectedGroup() != selectedGroupEnun.NONE) ? this.group.getGroupCash()[this.group.getSelectedGroup()].UserToGroup : null;
  }
  private groupCashOut(){
    return (this.group.getSelectedGroup() != selectedGroupEnun.NONE) ? this.group.getGroupCash()[this.group.getSelectedGroup()].GroupToUser : null;
  }
  private groupCash(){
    return (this.group.getSelectedGroup() != selectedGroupEnun.NONE) ? this.group.getGroupCash()[this.group.getSelectedGroup()].All : null;
  }

  ionViewWillEnter () {//https://blog.ionicframework.com/navigating-lifecycle-events/
    
  }
  ionViewWillLeave () {//https://blog.ionicframework.com/navigating-lifecycle-events/
    this.events.unsubscribe(GroupEvents.OnGotUserGroupsAndCashFlow);
    this.events.unsubscribe(GroupEvents.OnGotGroupUsers)

    this.events.unsubscribe(GroupEvents.OnDeleteGroup);
    this.events.unsubscribe(GroupEvents.OnDeleteGroupError)
  }

  private dismiss() {
    this.viewCtrl.dismiss();
  }

  private show(): boolean{
    this.ionViewDidLoad();
    return this.group.getSelectedGroup() != selectedGroupEnun.NONE;
  }

  private showUserGrouptDetais(pageID: string){
      //let modal = this.modalCtrl.create(GroupdetailPage, {pageID: pageID, groupIndex: this.group.getSelectedGroup(), groupDetail: this.groupDetail,groupCashFlow: this.groupCashFlow() ,groupCashIn: this.groupCashIn(),groupCashOut: this.groupCashOut(),groupCash: this.groupCash()});
      //modal.present();
      this.navCtrl.setRoot(GroupdetailPage, {pageID: pageID, groupIndex: this.group.getSelectedGroup(), groupDetail: this.groupDetail,groupCashFlow: this.groupCashFlow() ,groupCashIn: this.groupCashIn(),groupCashOut: this.groupCashOut(),groupCash: this.groupCash()})
    }
  private showGroupMembers(){
    //let modal = this.modalCtrl.create(GroupmembersPage, {groupDetail: this.groupDetail()});
    //modal.present();
    this.navCtrl.setRoot(GroupmembersPage, {groupDetail: this.groupDetail()});
  }
  private showGroupInvitations(){
    let modal = this.modalCtrl.create(GroupinvitationsPage, {groupDetail: this.groupDetail()});
    modal.present();
  }
  
  private returnTotal(): string{
    return FormatNumber.toDecimal(this.groupCashFlow().TotalPayment.Total, 2)
  }

  //Barra de navegação TAB --->
  private tabObject: TabInterfaceModel = {Selected:"GroupoverviewPage",TabList:[{Name:"GroupoverviewPage",Page:GroupoverviewPage,Icon:"home",Text:"Home"},{Name:"GrouplistPage",Page:GrouplistPage,Icon:"list",Text:"Grupos"},{Name:"ContactPage",Page:ContactPage,Icon:"person",Text:"Conta"},{Name:"AboutPage",Page:AboutPage,Icon:"help",Text:"Ajuda"}]};
  private tabClick(tab: any){
    console.log("Tab is: ",tab);
  }
  //Barra de navegação TAB --->

}
