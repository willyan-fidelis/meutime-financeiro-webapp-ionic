import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert';
import { ApiProvider} from '../../providers/api/api';
import { UserProvider, UserAccountEvents } from '../../providers/user/user';
import { ConfigProvider } from '../../providers/config/config';
import { Events } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { FieldsValidation } from '../../staticUtil/staticStringUtil';

//TAB Pages --->
import { TabsComponent,TabInterfaceModel } from '../../components/tabs/tabs';
import { AboutPage } from '../about/about';
import { GrouplistPage } from '../grouplist/grouplist';
import { GroupoverviewPage } from '../groupoverview/groupoverview';
//TAB Pages <---

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public events: Events, public config: ConfigProvider, public user: UserProvider, public alert: AlertProvider,public api: ApiProvider, public navCtrl: NavController) {
    //Mapeamos aqui os eventes que queremos interceptar:
    this.events.subscribe(UserAccountEvents.OnUserLogout,(data)=>{/*console.log("LOGIN!!!!! ",data);navCtrl.setRoot(LoginPage);*/})
  }

  private changePwd(){
    
    this.alert.createOkCancelWithInputs("Troca de Senha","Digite sua senha atual e duas vezes a senha desejada.",[{name:"ActualPwd",placeholder:"Senha Atual",type:"password"},{name:"newPwd",placeholder:"Nova Senha",type:"password"},{name:"newPwdAgain",placeholder:"Confirme Nova Senha",type:"password"}],(data)=>{
      //console.log("Data arrived: ",data);
      if(!FieldsValidation.passwordIsValid(data.newPwd)){this.alert.showOk("Aviso!","Senha invalida.<br>Sua senha deve conter de 8 até 20 caracteres alfanuméricos (hífen e underline são permitidos).","ok",()=>{;});return}
      this.user.changePwd(data.ActualPwd,data.newPwd,data.newPwdAgain).then((res)=>{
        if(res==-1){
          this.alert.showOk("Atenção","A Senha não foi alterada. Revise e tente novamente!","Ok",()=>{})
        }
        if(res==true){
          this.alert.showOk("Atenção","A Senha foi alterada com sucesso!","Ok",()=>{})
        }
      })
    },()=>{},"Ok","Cancelar");
    this.alert.showOkCancelWithInputs();
    }

  private logout(){this.user.logout();console.log("Saindo..");this.alert.showOk("Ate Breve","Aguardamos voce me breve..","Ok",()=>{this.navCtrl.setRoot(LoginPage);})}

  //Barra de navegação TAB --->
  private tabObject: TabInterfaceModel = {Selected:"ContactPage",TabList:[{Name:"GroupoverviewPage",Page:GroupoverviewPage,Icon:"home",Text:"Home"},{Name:"GrouplistPage",Page:GrouplistPage,Icon:"list",Text:"Grupos"},{Name:"ContactPage",Page:ContactPage,Icon:"person",Text:"Conta"},{Name:"AboutPage",Page:AboutPage,Icon:"help",Text:"Ajuda"}]};
  private tabClick(tab: any){
    console.log("Tab is: ",tab);
  }
  //Barra de navegação TAB --->

}
