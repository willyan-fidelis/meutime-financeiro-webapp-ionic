import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AlertProvider } from '../../providers/alert/alert';
import {ApiProvider} from '../../providers/api/api';
import {UserProvider, UserAccountEvents } from '../../providers/user/user';
import {GroupProvider, GroupEvents } from '../../providers/group/group';
import {ConfigProvider } from '../../providers/config/config';
import { Events } from 'ionic-angular';
import { StaticStringUtil, DateTimeModel } from '../../staticUtil/staticStringUtil';
import { FieldsValidation } from '../../staticUtil/staticStringUtil';

/**
 * Generated class for the AddgroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-addgroup',
  templateUrl: 'addgroup.html',
})
export class AddgroupPage {

  private dateToPay: DateTimeModel = {Year:"2019",Month:"01",Day:"",Hour:"23",Minute:"59",Second:"59"}

  constructor(public group: GroupProvider, public events: Events, public config: ConfigProvider, public user: UserProvider, public alert: AlertProvider,public api: ApiProvider, public navCtrl: NavController) {

  }

  ionViewWillEnter () {//https://blog.ionicframework.com/navigating-lifecycle-events/
    this.events.subscribe(GroupEvents.OnCreateGroup,(data)=>{this.alert.showOk("Atenção","Grupo criado com sucesso!","Ok",()=>{this.navCtrl.pop();});})
    this.events.subscribe(GroupEvents.OnCreateGroupError,(data)=>{this.alert.showOk("Atenção","Não foi possível criar o grupo. Revise os dados e tente novamente","Ok",()=>{});})

  }
  ionViewWillLeave () {//https://blog.ionicframework.com/navigating-lifecycle-events/
    this.events.unsubscribe(GroupEvents.OnCreateGroup);
    this.events.unsubscribe(GroupEvents.OnCreateGroupError);
    this.group.getUserGroupsAndCashFlow();
  }

  private creategroup(name:string,desc:string,value:number){
    if(!FieldsValidation.textIsValid(name,1,30)){this.alert.showOk("Aviso!","O nome precisa ter de 3 a 50 caractereres.","ok",()=>{;});return}
    if(!FieldsValidation.textIsValid(desc,1,30)){this.alert.showOk("Aviso!","A descrição precisa ter de 3 a 100 caractereres.","ok",()=>{;});return}
    if(this.dateToPay.Day == ""){this.alert.showOk("Aviso!","Escolha um dia de pagamento.","ok",()=>{;});return}
    if(!FieldsValidation.numberIsValid(value,5,1000)){this.alert.showOk("Aviso!","Preencha um valor válido para mensalidade. Valores entre 5 até 1000 reais.","ok",()=>{;});return}

    this.group.creategroup(this.dateToPay,name,desc,value)
  }

}
