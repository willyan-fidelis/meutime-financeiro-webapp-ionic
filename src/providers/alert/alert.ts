import { Injectable } from '@angular/core';
import {  AlertController, LoadingController, ToastController  } from 'ionic-angular';


/*
  Generated class for the AlertServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertProvider {

  constructor(private toastCtrl: ToastController, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    console.log('Hello AlertServiceProvider Provider');
  }

  private alert: any;
  private loader: any;

  public showOk(_title: string, _subTitle: string, _okBtn: string, _callBackOk:(data?:any)=>void){
    this.alert = this.alertCtrl.create({
      title: _title,
      subTitle: _subTitle,
      enableBackdropDismiss: false,
      buttons: [{
        text: _okBtn,
        handler: data => {
          _callBackOk(data);
      }}]
    });
    this.alert.present();
  }
  public showOkCancel(_title: string, _subTitle: string, _okBtn: string, _cancelBtn:string, _callBackOk:(data?:any)=>void, _callBackCancel:(data?:any)=>void){
    this.alert = this.alertCtrl.create({
      title: _title,
      subTitle: _subTitle,
      enableBackdropDismiss: false,
      buttons: [
        {
        text: _okBtn,
        handler: data => {_callBackOk(data);}
      },
      {
      text: _cancelBtn,
      handler: data => {_callBackCancel(data);}
      }
      ]
    });
    this.alert.present();
  }
  public showOkWith1Input(_title: string, _message: string, _placeholder: string, _okBtn: string, _callBackOk:(text?:string)=>void){
    this.alert = this.alertCtrl.create({
      title: _title,
      message: _message,
      inputs: [
        {
          name: 'txt',
          placeholder: _placeholder
        }
      ],
      enableBackdropDismiss: false,
      buttons: [
        {
          text: _okBtn,
          handler: data => {_callBackOk(data.txt)}
        }
      ]
    });
    this.alert.present();
  }
  public showOkCancelWith1Input(_title: string, _message: string, _placeholder: string, _okBtn: string, _cancelBtn: string, _callBackOk:(text?: string)=>void){
    this.alert = this.alertCtrl.create({
      title: _title,
      message: _message,
      inputs: [
        {
          name: 'txt',
          placeholder: _placeholder
        }
      ],
      enableBackdropDismiss: false,
      buttons: [
        {
          text: _okBtn,
          handler: data => {_callBackOk(data.txt)}
        },
        {
          text: _cancelBtn,
          handler: data => {}
        }
      ]
    });
    this.alert.present();
  }

  public createOkCancelWithInputs(_title: string, _message: string, _input: Array<any>, _callBackOk:(data?:any)=>void, _callBackCancel:(data?:any)=>void, _okBtn: string, _cancelBtn: string){
    this.alert = this.alertCtrl.create({
      title: _title,
      message: _message,
      inputs: _input,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: _cancelBtn,
          handler: data => {_callBackCancel(data)}
        },
        {
          text: _okBtn,
          handler: data => {_callBackOk(data)}
        }
      ]
    });
    //this.alert.present();
  }
  public showOkCancelWithInputs(){
    this.alert.present();
  }
  public showServerError(_callBackOk:(data?:any)=>void){
    this.showOk('Erro!', 'Falha ao tentar conectar ao servidor e ao banco de dados! <br>Verifique sua conexão com a internet.', 'ok', _callBackOk)
  }
  // -------------------- Loading Object --------------------
  public showLoading(_text: string, time?: number) {
    this.loader = this.loadingCtrl.create({
      content: _text
    });
    if (time != 0 && time != null && time != undefined){
      setTimeout(()=>{this.loader.dismiss();}, time);
    }
    this.loader.present();
  }
  public dismissLoading(){
    this.loader.dismiss();
  }
  // -------------------- Loading Object --------------------

  public showToast(text: string, position: string, time: number) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: time,
      position: position
    });

    toast.present(toast);
  }

}
