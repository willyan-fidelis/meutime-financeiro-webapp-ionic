import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { ApiProvider, SpReturnUserDetails_Results, KeyValuePairModel } from '../api/api';
import { Events } from 'ionic-angular';


export enum UserAccountEvents {
    OnUserLogin             = "OnUserLogin",
    OnUserLoginError        = "OnUserLoginError",
    OnUserLogout            = "OnUserLogout",
    OnCreditCardChanged     = "OnCreditCardChanged",
    OnConfirmaccount        = "OnConfirmaccount",
    OnConfirmaccountError   = "OnConfirmaccountError",
    OnCreateuser            = "OnCreateuser",
    OnCreateuserError       = "OnCreateuserError",
    OnCreateuserWrongPwd    = "OnConfirmaccountError",
    OnRedefinePwd           = "OnRedefinePwd",
    OnRedefinePwdError      = "OnRedefinePwdError",
    OnRedefinePwdWrongPwd   = "OnRedefinePwdWrongPwd",

}


@Injectable()
export class UserProvider {

  constructor(public events: Events, public api: ApiProvider) {
      console.log('Hello UserAccountProvider Provider');
    }

    private user: SpReturnUserDetails_Results = {
      OID: 0,
      Name: "",
      Email: "",
      CPF: "",
      Password: "",
      SessionCode: "",
      Phone: "",
      AsaasID: "",
      db_banco: "",
      db_agencia: "",
      db_conta: "",
      db_nome: "",
      db_cpf: "",
      db_finalidade: "",
      db_tipo: "",
      TUserAccountStatus_OID: 0};
    private EmptyUser: SpReturnUserDetails_Results = {
      OID: 0,
      Name: "",
      Email: "",
      CPF: "",
      Password: "",
      SessionCode: "",
      Phone: "",
      AsaasID: "",
      db_banco: "",
      db_agencia: "",
      db_conta: "",
      db_nome: "",
      db_cpf: "",
      db_finalidade: "",
      db_tipo: "",
      TUserAccountStatus_OID: 0};
    private clearUser(){this.user = this.getEmptyUser()}
    public getUser():SpReturnUserDetails_Results{return this.user}
    public getEmptyUser():SpReturnUserDetails_Results{return this.EmptyUser}
    public userIsLoggedIn(){
      if(this.user.OID == 0){
        return false;
      }
      else{
        return true;
      }
    }

    public login(email:string,pwd:string, groupOID: number): Promise<boolean | null>{
      let parm = {email: email, pwd: pwd, groupOID: groupOID};
      return new Promise(resolve => {
        this.api.runSpUserLogin(parm).then((res)=>{
          if(res.Parameters.result==1){
            let parm = {email: email, session: res.Results[0].SessionCode, userOID: res.Results[0].OID};
            this.api.runSpReturnUserDetails(parm).then((res)=>{
              if(res.Parameters.result==1){
                this.user = res.Results[0];
                console.log("login ok!",this.user);
                this.events.publish(UserAccountEvents.OnUserLogin,JSON.parse(JSON.stringify(this.user)));
                resolve(true)
              }else{/*ERROR Place!*/this.events.publish(UserAccountEvents.OnUserLoginError,JSON.parse(JSON.stringify(this.user)));resolve(null);}});
          }else{/*ERROR Place!*/this.events.publish(UserAccountEvents.OnUserLoginError,JSON.parse(JSON.stringify(this.user)));resolve(null);}});
      });
    }

    public logout(): Promise<boolean | null>{
      let parm = {email: this.user.Email, session: this.user.SessionCode};
      return new Promise(resolve => {
        this.api.runSpUserLogoutAll(parm).then((res)=>{this.clearUser();console.log("logout ok!",this.user);this.events.publish(UserAccountEvents.OnUserLogout,JSON.parse(JSON.stringify(this.user)));if(res.Parameters.result==1){resolve(true)}else{/*ERROR Place!*/resolve(null);}});
      });
    }

    public changePwd(pwd: string, newPwd: string, newPwdAgain: string): Promise<boolean | null | number>{
      if (newPwd != newPwdAgain){return new Promise(resolve =>{resolve(-1);})}
      else{
        let parm = {email: this.user.Email, session: this.user.SessionCode, oldpwd: pwd, newpwd: newPwd};
        return new Promise(resolve => {
          this.api.runSpEditUserPwd(parm).then((res)=>{if(res.Parameters.result==1){this.user.Password=newPwd;resolve(true)}else{/*ERROR Place!*/resolve(null);}});
        });
      }
    }

    public editUserInfo(): Promise<boolean | null>{
      return new Promise(resolve =>{resolve(null);}) //Implementar no futuro!
    }

    public confirmaccount(email:string): Promise<boolean | null>{
      let parm = {email: email};
      return new Promise(resolve => {
        this.api.runSpActivateUserAccount(parm).then((res)=>{
          if(res.Parameters.result==1){
            this.events.publish(UserAccountEvents.OnConfirmaccount,null);
            resolve(true);
          }else{/*ERROR Place!*/this.events.publish(UserAccountEvents.OnConfirmaccountError,null);resolve(null);}});
      });
    }

    public createuser(email:string,pwd:string,pwdagain:string,name:string,phone:string,cpf:string,groupOID:number): Promise<boolean | null>{
      if(pwd != pwdagain){this.events.publish(UserAccountEvents.OnCreateuserWrongPwd,null);return}
      let parm = {email: email,pwd: pwd,name: name,phone: phone, cpf:cpf, groupOID:groupOID};
      return new Promise(resolve => {
        this.api.FnCreateUser(parm).then((res)=>{
          if(res.Parameters.result==1){
            this.events.publish(UserAccountEvents.OnCreateuser,null);
            resolve(true);
          }else{/*ERROR Place!*/this.events.publish(UserAccountEvents.OnCreateuserError,null);resolve(null);}});
      });
    }

    public redefinePwd(email: string, pwd: string, newPwd: string, newPwdAgain: string): Promise<boolean | null | number>{ //Função para quando o usuário esque a senha e não esta logado, recebendo um link por email.
      if (newPwd != newPwdAgain){this.events.publish(UserAccountEvents.OnRedefinePwdWrongPwd,null);return new Promise(resolve =>{resolve(-1);})}
      else{
        let parm = {email: email, oldpwd: pwd, newpwd: newPwd};
        return new Promise(resolve => {
          this.api.runStUserForgotPwdRegisterNewPwd(parm).then((res)=>{if(res.Parameters.result==1){this.events.publish(UserAccountEvents.OnRedefinePwd,null);resolve(true)}else{/*ERROR Place!*/this.events.publish(UserAccountEvents.OnRedefinePwdError,null);resolve(null);}});
        });
      }
    }

    //------------------------------------------------------------
    
    //------------------------------------------------------------

}
