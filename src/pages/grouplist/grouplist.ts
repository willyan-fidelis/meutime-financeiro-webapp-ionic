import { Component } from '@angular/core';
import { NavController, ModalController, Events } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert';
import { ApiProvider, FnReturnUserGroups_Results, TUserGroupPrivilegesEnum} from '../../providers/api/api';
import { UserProvider } from '../../providers/user/user';
import { AppProvider } from '../../providers/app/app';
import { GroupProvider, GroupEvents, selectedGroupEnun } from '../../providers/group/group';
import { ConfigProvider } from '../../providers/config/config';
import { GroupdetailPage } from '../groupdetail/groupdetail';
import { AddgroupPage } from '../addgroup/addgroup';
import { MenuhomePage } from '../menuhome/menuhome';

//TAB Pages --->
import { TabsComponent,TabInterfaceModel } from '../../components/tabs/tabs';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
//import { GrouplistPage } from '../grouplist/grouplist';
import { GroupoverviewPage } from '../groupoverview/groupoverview';
//TAB Pages <---

import { HeaderComponent } from '../../components/header/header';

@Component({
  selector: 'page-grouplist',
  templateUrl: 'grouplist.html'
})
export class GrouplistPage {

  constructor(public app: AppProvider, public events: Events, public modalCtrl: ModalController, public config: ConfigProvider, public group: GroupProvider,public user: UserProvider, public alert: AlertProvider,public api: ApiProvider, public navCtrl: NavController) {
    //this.group.getUsergroups()[0]
  }

  //private abc = this.usergroups.getUsergroups();

  ionViewWillEnter () {//https://blog.ionicframework.com/navigating-lifecycle-events/
    //this.group.getUserGroupsAndCashFlow();

    //this.events.subscribe(GroupEvents.OnGotGroupUsers,(data)=>{
    //  if(this.app.pageFirstTimeLoaded("HomePage") && this.group.getUsergroups().length>0){this.events.subscribe(GroupEvents.OnGotUserGroupsAndCashFlow,()=>{if(this.group.getUsergroups().length>0){};});this.alert.showLoading("Carregando dados do grupo..",2000)};
    //})

    this.events.subscribe(GroupEvents.OnDeleteGroup,(data)=>{this.alert.showOk("Atenção","Grupo deletado!","Ok",()=>{this.group.getUserGroupsAndCashFlow();});})
    this.events.subscribe(GroupEvents.OnDeleteGroupError,(data)=>{this.alert.showOk("Atenção","Não foi possível apagar o grupo. Talvez voce não tenha esse provilégio ou existem cobranças lançadas nesse grupo!","Ok",()=>{});})
  }
  ionViewWillLeave () {//https://blog.ionicframework.com/navigating-lifecycle-events/
    this.events.unsubscribe(GroupEvents.OnGotUserGroupsAndCashFlow);
    this.events.unsubscribe(GroupEvents.OnGotGroupUsers)

    this.events.unsubscribe(GroupEvents.OnDeleteGroup);
    this.events.unsubscribe(GroupEvents.OnDeleteGroupError)
  }

  private testUserGroups(){

    //console.log("XXX", this.usergroups.getUsergroupscashin()[1][0].Name)
    this.group.calcCash();
  }

  private showUserGrouptDetais(index: number){
    this.group.setSelectedGroup(index);
      //let modal = this.modalCtrl.create(GroupoverviewPage,{showAsModal: true});
      //modal.present();
      
      this.navCtrl.setRoot(GroupoverviewPage,{showAsModal: true});
    }

  private addgroup(){this.navCtrl.push(AddgroupPage)}
  private gotomenu(){this.navCtrl.push(MenuhomePage)}
  private deletegroup(groupOID: number, name: string){
    this.alert.showOkCancel("Atenção","Deseja mesmo apagar o grupo " + name + " da sua lista?", "Sim", "Cancelar", ()=>{this.group.deletegroup(groupOID);}, ()=>{})
    this.group.setSelectedGroup(selectedGroupEnun.NONE)
  }
  private userIsadmin(group: FnReturnUserGroups_Results): boolean{
    if(group.UserPrivileges == TUserGroupPrivilegesEnum.Admin){return true}else{return false}
  }

  //Barra de navegação TAB --->
  private tabObject: TabInterfaceModel = {Selected:"GrouplistPage",TabList:[{Name:"GroupoverviewPage",Page:GroupoverviewPage,Icon:"home",Text:"Home"},{Name:"GrouplistPage",Page:GrouplistPage,Icon:"list",Text:"Grupos"},{Name:"ContactPage",Page:ContactPage,Icon:"person",Text:"Conta"},{Name:"AboutPage",Page:AboutPage,Icon:"help",Text:"Ajuda"}]};
  private tabClick(tab: any){
    console.log("Tab is: ",tab);
  }
  //Barra de navegação TAB --->

}
