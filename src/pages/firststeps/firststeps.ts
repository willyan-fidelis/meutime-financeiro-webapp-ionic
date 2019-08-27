import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';


/**
 * Generated class for the FirststepsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-firststeps',
  templateUrl: 'firststeps.html',
})
export class FirststepsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FirststepsPage');
  }

  slides = [
    {
      title: "Confirme seu email e vá em frente!",
      description: "Abra a sua caixa de email e click no link do MeuTime para confirmar seu cadastro.",
      image: "assets/imgs/email.jpg",
    },
    {
      title: "Crie ou participe de grupos",
      description: "Crie e chame seus amigos para entrar no seu grupo. Você também pode ser convidado para participar de outros grupos!",
      image: "assets/imgs/players.jpg",
    },
    {
      title: "Finanças",
      description: "Gerencie as finaças do seu time: Crie pagamentos recorrentes e muito mais!",
      image: "assets/imgs/payment.jpg",
    }
  ];

  private start(){this.navCtrl.setRoot(LoginPage);}

}
