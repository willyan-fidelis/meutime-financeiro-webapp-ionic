import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { UserregistrationPage } from '../userregistration/userregistration';
import { ConfirmaccountPage } from '../confirmaccount/confirmaccount';
import { RedefineuserpwdPage } from '../redefineuserpwd/redefineuserpwd';
import { AppProvider } from '../../providers/app/app';

/**
 * Generated class for the BlankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-blank',
  templateUrl: 'blank.html',
})
export class BlankPage {

  constructor(app: AppProvider, platform: Platform, public navCtrl: NavController, public navParams: NavParams) {
    platform.ready().then(() => {
    });

    app.APIGetTime().then((time)=>{console.log("Time is: ",time);})

    //console.log("zzzyyyxxx", platform.getQueryParam("xxx"));//https://ionicframework.com/docs/api/platform/Platform/#getQueryParam
    if(platform.getQueryParam("weblink") != null){
      console.log("weblink is: ", platform.getQueryParam("weblink"))

      switch (platform.getQueryParam("weblink")) {
            case 'confirmaccount': //link para confirmação de cadastro de conta
                navCtrl.setRoot(ConfirmaccountPage);
                break;
            case 'redefinepwd':
                navCtrl.setRoot(RedefineuserpwdPage);
                break;
            default:
            navCtrl.setRoot(LoginPage);
        }
    }
    else{
      navCtrl.setRoot(LoginPage);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BlankPage');
  }

}
