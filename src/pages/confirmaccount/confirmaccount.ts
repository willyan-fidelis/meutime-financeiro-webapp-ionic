import { Component } from '@angular/core';
import { NavController, NavParams, Platform, Events } from 'ionic-angular';
import {ApiProvider} from '../../providers/api/api';
import {UserProvider, UserAccountEvents } from '../../providers/user/user';
import {ConfigProvider } from '../../providers/config/config';
import {AlertProvider } from '../../providers/alert/alert';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ConfirmaccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-confirmaccount',
  templateUrl: 'confirmaccount.html',
})
export class ConfirmaccountPage {

  constructor(public events: Events, platform: Platform, public config: ConfigProvider, public user: UserProvider, public alert: AlertProvider,public api: ApiProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.alert.showLoading("Estamos verificando seus dados.<br>A um segundo de fazer parte do MeuTime!")
    platform.ready().then(() => {
      if(platform.getQueryParam("xparam1") != null){
        this.user.confirmaccount(platform.getQueryParam("xparam1"))
        this.events.subscribe(UserAccountEvents.OnConfirmaccount,(data)=>{this.alert.dismissLoading();this.alert.showOk("Aviso!","Confirmação realizada com sucesso!","ok",()=>{navCtrl.setRoot(LoginPage);});})
        this.events.subscribe(UserAccountEvents.OnConfirmaccountError,(data)=>{this.alert.dismissLoading();navCtrl.setRoot(LoginPage);})
      }
      else{
        this.alert.dismissLoading();
        this.alert.showOk("Aviso!","Problemas com a URL de confirmação da conta!","ok",()=>{navCtrl.setRoot(LoginPage);});
      }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmaccountPage');
  }

  private login(email:string,pwd:string){this.alert.showLoading("Aguarde..");this.user.confirmaccount(email).then(()=>{this.alert.dismissLoading();})}
}
