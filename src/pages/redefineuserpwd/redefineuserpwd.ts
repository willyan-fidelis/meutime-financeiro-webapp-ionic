import { Component } from '@angular/core';
import { NavController, NavParams, Platform, Events } from 'ionic-angular';
import {ApiProvider} from '../../providers/api/api';
import {UserProvider, UserAccountEvents } from '../../providers/user/user';
import {ConfigProvider } from '../../providers/config/config';
import {AlertProvider } from '../../providers/alert/alert';
import { LoginPage } from '../login/login';

/**
 * Generated class for the RedefineuserpwdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-redefineuserpwd',
  templateUrl: 'redefineuserpwd.html',
})
export class RedefineuserpwdPage {

  private user_email: string = "";
  constructor(public events: Events, public platform: Platform, public config: ConfigProvider, public user: UserProvider, public alert: AlertProvider,public api: ApiProvider, public navCtrl: NavController, public navParams: NavParams) {
    //this.alert.showLoading("Estamos verificando seus dados.<br>A um segundo de fazer parte do MeuTime!")
    platform.ready().then(() => {
      if(platform.getQueryParam("xparam1") != null && platform.getQueryParam("xparam2") != null){
        this.user_email = platform.getQueryParam("xparam1");
        //this.user.confirmaccount(platform.getQueryParam("xparam1"))
        this.events.subscribe(UserAccountEvents.OnRedefinePwd,(data)=>{this.alert.showOk("Atenção","Senha redefinada com sucesso!","Ok",()=>{this.navCtrl.setRoot(LoginPage);});})
        this.events.subscribe(UserAccountEvents.OnRedefinePwdWrongPwd,(data)=>{this.alert.showOk("Atenção","Senhas diferentes.","Ok",()=>{});})
        this.events.subscribe(UserAccountEvents.OnRedefinePwdError,(data)=>{this.alert.showOk("Atenção","Problemas na alteração da senha. Revise os dados e tente novamente","Ok",()=>{});})
      }
      else{
        //this.alert.dismissLoading();
        //this.alert.showOk("Aviso!","Problemas com a URL de confirmação da conta!","ok",()=>{navCtrl.setRoot(LoginPage);});
      }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RedefineuserpwdPage');
  }

  private redefinePwd(newpwd:string,newpwdAgain:string){this.alert.showLoading("Aguarde..");this.user.redefinePwd(this.platform.getQueryParam("xparam1"), this.platform.getQueryParam("xparam2"), newpwd, newpwdAgain).then(()=>{this.alert.dismissLoading();})}

  private gotologgin(){this.navCtrl.setRoot(LoginPage);}
  }
