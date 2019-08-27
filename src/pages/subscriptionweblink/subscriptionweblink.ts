import { Component } from '@angular/core';
import { NavController, Platform, Events } from 'ionic-angular';
import { ApiProvider,cardModel} from '../../providers/api/api';
import { UserProvider, UserAccountEvents } from '../../providers/user/user';
import { GroupProvider, GroupEvents } from '../../providers/group/group';
import { ConfigProvider } from '../../providers/config/config';
import { AlertProvider } from '../../providers/alert/alert';

/**
 * Generated class for the SubscriptionweblinkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-subscriptionweblink',
  templateUrl: 'subscriptionweblink.html',
})
export class SubscriptionweblinkPage {

  constructor(public group: GroupProvider, public platform: Platform,public events: Events, public config: ConfigProvider, public user: UserProvider, public alert: AlertProvider,public api: ApiProvider, public navCtrl: NavController) {
    this.group.getgroupdescripition(this.platform.getQueryParam("xparam1"))
    this.events.subscribe(GroupEvents.OnGotGroupDescription,(data)=>{this.alert.showOk("Aviso!","O usuario <b>"+data.Results[0].UserName+"("+data.Results[0].UserEmail+")</b> esta convidando você para participar de um grupo no MeuTime. Faça o login e entre agora mesmo no grupo <b>"+data.Results[0].Name+"</b>! Se ainda não é cadastrado, faça agora mesmo seu cadastro!","ok",()=>{;});})
    this.events.subscribe(GroupEvents.OnGotGroupDescriptionError,(data)=>{this.alert.showOk("Aviso!","Problemas ao entrar no grupo. Tente novamente!","ok",()=>{;});})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubscriptionweblinkPage');
  }

  private userFound: boolean = false;
  private userData: any={
      name: "",
      email: "",
      cpf: "",
      debt:"",
      asaasID:"",
      club:"",
    };
  private card: cardModel = {
    cc_name: "",
    cc_number: "",
    cc_month: "",
    cc_year: "",
    cc_ccv: "",
    cch_name: "",
    cch_email: "",
    cch_cpf: "",
    cch_phone: "",
  }

}
