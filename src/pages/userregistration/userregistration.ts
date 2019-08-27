import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert';
import { ApiProvider} from '../../providers/api/api';
import { UserProvider, UserAccountEvents } from '../../providers/user/user';
import { GroupProvider, GroupEvents } from '../../providers/group/group';
import { ConfigProvider } from '../../providers/config/config';
import { Events } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { FirststepsPage } from '../firststeps/firststeps';
import { FieldsValidation, StringFormat } from '../../staticUtil/staticStringUtil';

/**
 * Generated class for the UserregistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-userregistration',
  templateUrl: 'userregistration.html',
})
export class UserregistrationPage {
  private groupOID: number = null;

  constructor(public group: GroupProvider, public platform: Platform, public events: Events, public config: ConfigProvider, public user: UserProvider, public alert: AlertProvider,public api: ApiProvider, public navCtrl: NavController) {

  }

  ionViewWillEnter () {//https://blog.ionicframework.com/navigating-lifecycle-events/
    this.events.subscribe(UserAccountEvents.OnCreateuser,(data)=>{this.alert.showOk("Atenção","Usuario criado com sucesso! Um email de confirmação foi enviado para sua caixa postal","Ok",()=>{this.navCtrl.setRoot(FirststepsPage);});})
    this.events.subscribe(UserAccountEvents.OnCreateuserWrongPwd,(data)=>{this.alert.showOk("Atenção","Senha incorreta.","Ok",()=>{});})
    this.events.subscribe(UserAccountEvents.OnCreateuserError,(data)=>{this.alert.showOk("Atenção","Não foi possível criar a conta. Revise os dados e tente novamente","Ok",()=>{});})

    this.platform.ready().then(() => {
      console.log(this.platform.getQueryParam("xparam1"));console.log(this.platform.getQueryParam("weblink"));
      if(this.platform.getQueryParam("xparam1") != null && this.platform.getQueryParam("weblink") == "groupinvitation"){
        this.groupOID = this.platform.getQueryParam("xparam1");
        this.group.getgroupdescripition(this.platform.getQueryParam("xparam1"))
        this.events.subscribe(GroupEvents.OnGotGroupDescription,(data)=>{this.alert.showOk("Aviso!","O usuario <b>"+data.Results[0].UserName+"("+data.Results[0].UserEmail+")</b> esta convidando você para participar de um grupo no MeuTime. Faça a inscrição e entre agora mesmo nop grupo <b>"+data.Results[0].Name+"</b>!","ok",()=>{;});})
        this.events.subscribe(GroupEvents.OnGotGroupDescriptionError,(data)=>{this.alert.showOk("Aviso!","Problemas ao entrar no grupo. Tente novamente!","ok",()=>{;});})
      }
    });
  }
  ionViewWillLeave () {//https://blog.ionicframework.com/navigating-lifecycle-events/
    this.events.unsubscribe(UserAccountEvents.OnCreateuser);
    this.events.unsubscribe(UserAccountEvents.OnCreateuserWrongPwd);
    this.events.unsubscribe(UserAccountEvents.OnCreateuserError);

    this.events.unsubscribe(GroupEvents.OnGotGroupDescription);
    this.events.unsubscribe(GroupEvents.OnGotGroupDescriptionError)
  }

  private createuser(email:string,pwd:string,pwdagain:string,name:string,phone:string,cpf:string){
    if(!FieldsValidation.emailIsValid(email)){this.alert.showOk("Aviso!","Email invalido.<br>Seu email deve estar no formato 'meuemail@xyz.com'.","ok",()=>{;});return}
    if(!FieldsValidation.passwordIsValid(pwd)){this.alert.showOk("Aviso!","Senha invalida.<br>Sua senha deve conter de 8 até 20 caracteres alfanuméricos (hífen e underline são permitidos).","ok",()=>{;});return}
    if(!FieldsValidation.fullNameIsValid(name)){this.alert.showOk("Aviso!","Nome inválido.<br>Digite novamente seu nome completo, com espaço entre nome e sobre nome.","ok",()=>{;});return}
    if(!FieldsValidation.phoneIsValid(phone)){this.alert.showOk("Aviso!","Telefone inválido.<br>Digite seu telefone no formato '11955335060'. O número deve ter de 10 a 11 caracteres começando com o codigo de área.","ok",()=>{;});return}
    if(!FieldsValidation.CPFIsValid(cpf)){this.alert.showOk("Aviso!","CPF inválido.<br>O número do CPF deve conter 11 caracteres numericos.","ok",()=>{;});return}

    this.user.createuser(email,pwd,pwdagain,name,phone,cpf,this.groupOID)
  }
  private gotologgin(){this.navCtrl.setRoot(LoginPage);}
  private getgroupdescripition(){}

  private formatPhone(phone: string):string{
    return StringFormat.toPhone(phone);
  }
  private formatCPF(cpf: string):string{
    return StringFormat.toCPF(cpf);
  }

}
