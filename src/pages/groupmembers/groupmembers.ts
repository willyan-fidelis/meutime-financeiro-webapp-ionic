import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';
import {ApiProvider, FnReturnUserGroups_Results, FnReturnGroupUsers_Results, FnReturnGroupUsers, TUserGroupPrivilegesEnum} from '../../providers/api/api';
import {GroupProvider, GroupEvents } from '../../providers/group/group';
import {ConfigProvider } from '../../providers/config/config';
import {AlertProvider } from '../../providers/alert/alert';
import * as $ from 'jquery';

//TAB Pages --->
import { TabsComponent,TabInterfaceModel } from '../../components/tabs/tabs';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { GrouplistPage } from '../grouplist/grouplist';
import { GroupoverviewPage } from '../groupoverview/groupoverview';
//TAB Pages <---


@Component({
  selector: 'page-groupmembers',
  templateUrl: 'groupmembers.html',
})
export class GroupmembersPage {
  private groupDetail:      FnReturnUserGroups_Results;
  private groupmembers:     Array<FnReturnGroupUsers_Results> = this.group.EmptyGroupUsers();

  constructor(public alert: AlertProvider, public config: ConfigProvider, public events: Events, public group: GroupProvider, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.groupDetail = this.navParams.get('groupDetail');
  }

  ionViewWillEnter () {//https://blog.ionicframework.com/navigating-lifecycle-events/
    this.groupDetail = this.navParams.get('groupDetail');
    this.group.getgroupusers(this.groupDetail.TGroup_OID).then((data)=>{this.groupmembers = data.Results}).catch(()=>{this.alert.showOk("Atenção","Erro ao consultar jogadores. Tente novamente","Ok",()=>{});})
    this.events.subscribe(GroupEvents.OnDeleteUserFromGroupError,(data)=>{this.alert.showOk("Atenção","Erro ao deletar o jogadores. Talvez voce não tenha esta permição.","Ok",()=>{});})
    this.groupmembers[0].UserOID
  }
  ionViewWillLeave () {//https://blog.ionicframework.com/navigating-lifecycle-events/
    this.events.unsubscribe(GroupEvents.OnDeleteUserFromGroupError)
  }

  private copyText(element: HTMLElement){
    //https://codepen.io/shaikmaqsood/pen/XmydxJ
    //https://forum.ionicframework.com/t/jquery-in-ionic-and-typescript/54015
    //let $temp //= $("<input>");
    //$("body").append($temp);
    //$temp.val($(element).text()).select();

    //$(element).text().
    //document.execCommand("copy");
    //$temp.remove();

    $(function() {
      $('.allowCopy').click(function() {
        $(this).focus();
        $(this).select();
        document.execCommand('copy');
      });
   });
   
  }

  private copy() {
    //https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
    var copyText: any = document.getElementById("myInput");
    copyText.select();
    document.execCommand("copy");
    //alert("Copied the text: " + copyText.value);
    this.alert.showToast("Link copiado","botton",2000)
  }
  
  
  private dismiss() {
    this.viewCtrl.dismiss();
  }

  private deleteuserfromgroup(userToBeRemovedOID:number,Email:string){
    this.alert.showOkCancel("Atenção","Deseja mesmo apagar o jogador <b>" + Email + "</b> de seu grupo?", "Sim", "Cancelar", ()=>{this.group.deleteuserfromgroup(this.groupDetail.TGroup_OID,userToBeRemovedOID)}, ()=>{})
  }

  private userIsadmin(privileges: number): boolean{
    if(privileges == TUserGroupPrivilegesEnum.Admin){return true}else{return false}
  }

  //Barra de navegação TAB --->
  private tabObject: TabInterfaceModel = {Selected:"Nenhum",TabList:[{Name:"GroupoverviewPage",Page:GroupoverviewPage,Icon:"home",Text:"Home"},{Name:"GrouplistPage",Page:GrouplistPage,Icon:"list",Text:"Grupos"},{Name:"ContactPage",Page:ContactPage,Icon:"person",Text:"Conta"},{Name:"AboutPage",Page:AboutPage,Icon:"help",Text:"Ajuda"}]};
  private tabClick(tab: any){
    console.log("Tab is: ",tab);
  }
  //Barra de navegação TAB --->

}
