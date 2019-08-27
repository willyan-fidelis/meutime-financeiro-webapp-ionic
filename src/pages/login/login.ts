import { Component } from '@angular/core';
import { NavController, Platform, Events } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert';
import { ApiProvider} from '../../providers/api/api';
import { UserProvider, UserAccountEvents } from '../../providers/user/user';
import { GroupProvider, GroupEvents } from '../../providers/group/group';
import { ConfigProvider } from '../../providers/config/config';
//import { TabsPage } from '../tabs/tabs';
import { GroupoverviewPage } from '../groupoverview/groupoverview';
import { UserregistrationPage } from '../userregistration/userregistration';
import { SubscriptionweblinkPage } from '../subscriptionweblink/subscriptionweblink';
import { FieldsValidation } from '../../staticUtil/staticStringUtil';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  private gotosubscriptionpage: boolean = false;
  private groupOID: number = null;
  constructor(public group: GroupProvider, public platform: Platform,public events: Events, public config: ConfigProvider, public user: UserProvider, public alert: AlertProvider,public api: ApiProvider, public navCtrl: NavController) {

  }

  ionViewWillEnter () {//https://blog.ionicframework.com/navigating-lifecycle-events/


    this.platform.ready().then(() => {
      //console.log(this.platform.getQueryParam("xparam1"));console.log(this.platform.getQueryParam("weblink"));
      if(this.platform.getQueryParam("xparam1") != null && this.platform.getQueryParam("weblink") == "groupinvitation"){
        this.groupOID = this.platform.getQueryParam("xparam1");
        this.group.getgroupdescripition(this.platform.getQueryParam("xparam1"))
        this.events.subscribe(GroupEvents.OnGotGroupDescription,(data)=>{this.alert.showOk("Aviso!","O usuario <b>"+data.Results[0].UserName+"("+data.Results[0].UserEmail+")</b> esta convidando você para participar de um grupo no MeuTime. Faça o login e entre agora mesmo no grupo <b>"+data.Results[0].Name+"</b>! Se ainda não é cadastrado, faça agora mesmo seu cadastro!","ok",()=>{;});})
        this.events.subscribe(GroupEvents.OnGotGroupDescriptionError,(data)=>{this.alert.showOk("Aviso!","Problemas ao entrar no grupo. Tente novamente!","ok",()=>{;});})
      }
      else if(this.platform.getQueryParam("xparam1") != null && this.platform.getQueryParam("weblink") == "subscriptionweblink"){
        this.gotosubscriptionpage = true;
        this.group.getgroupdescripition(this.platform.getQueryParam("xparam1"))
        this.events.subscribe(GroupEvents.OnGotGroupDescription,(data)=>{this.alert.showOk("Aviso!","O usuario <b>"+data.Results[0].UserName+"("+data.Results[0].UserEmail+")</b> esta convidando você para participar de um grupo no MeuTime. Faça o login e entre agora mesmo no grupo <b>"+data.Results[0].Name+"</b>! Se ainda não é cadastrado, faça agora mesmo seu cadastro!","ok",()=>{;});})
        this.events.subscribe(GroupEvents.OnGotGroupDescriptionError,(data)=>{this.alert.showOk("Aviso!","Problemas ao entrar no grupo. Tente novamente!","ok",()=>{;});})
      }

      if(this.gotosubscriptionpage == false){
        this.events.subscribe(UserAccountEvents.OnUserLogin,(data)=>{console.log("LOGIN!!!!! ",data);this.navCtrl.setRoot(GroupoverviewPage);})
        this.events.subscribe(UserAccountEvents.OnUserLoginError,(data)=>{this.alert.showOk("Atenção","Não foi possivel localizar o usuário. Revise os dados e tente novamente.","Ok",()=>{});})
      }
      else{
        this.events.subscribe(UserAccountEvents.OnUserLogin,(data)=>{console.log("LOGIN!!!!! ",data);this.navCtrl.setRoot(SubscriptionweblinkPage);})
        this.events.subscribe(UserAccountEvents.OnUserLoginError,(data)=>{this.alert.showOk("Atenção","Não foi possivel localizar o usuário. Revise os dados e tente novamente.","Ok",()=>{});})
      }

    });
  }
  ionViewWillLeave () {//https://blog.ionicframework.com/navigating-lifecycle-events/
    this.events.unsubscribe(UserAccountEvents.OnUserLogin);
    this.events.unsubscribe(UserAccountEvents.OnUserLoginError);

    this.events.unsubscribe(GroupEvents.OnGotGroupDescription);
    this.events.unsubscribe(GroupEvents.OnGotGroupDescriptionError)
  }

  private testApi(){
    //this.api.testSpReturnUserDetails();
    //this.api.testSpUserLogoutAll();
    //this.api.testSpUserLogin();
    //this.api.testSpEditUserPwd();
    //this.api.testSpReturnUserGroups();
    //this.api.testSpReturnUserInGroupCashIn();
    //this.api.testSpReturnUserInGroupCashOut();
  }


  private login(email:string,pwd:string){
    if(!FieldsValidation.emailIsValid(email)){this.alert.showOk("Aviso!","Email invalido!","ok",()=>{;});return}
    if(!FieldsValidation.passwordIsValid(pwd)){this.alert.showOk("Aviso!","Senha invalida!","ok",()=>{;});return}

    this.alert.showLoading("Aguarde..");this.user.login(email,pwd,this.groupOID).then(()=>{this.alert.dismissLoading();})
  }

  private createaccount(){this.navCtrl.setRoot(UserregistrationPage);}

  private forgotpassword(){this.navCtrl.setRoot(UserregistrationPage);}


}
