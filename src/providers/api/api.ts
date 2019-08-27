//import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers } from '@angular/http';
import { URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import {ConfigProvider} from '../config/config';
import { StaticStringUtil, DateTimeModel } from '../../staticUtil/staticStringUtil';


export interface KeyValuePairModel {
    key: string;
    value: any;
}
//Stored Procedure - Genreal Answer:
export interface StGenericAnswer { //Todas as respostas das Stored Procedure utilizam este model
    result: number;
}

export interface StSimple { //Usado para transações simples, onde só se avalia o 'Parameters.result' ou 'Results' so que de forma temporaria/Local
    Parameters: StGenericAnswer;
    Results:Array<{
      DontCare: any;
    }> | null
}

//Stored Procedures - User Interface:
export interface SpReturnUserDetails_Results {
      OID: number;
      Name: string;
      Email: string;
      CPF: string;
      Password: string;
      SessionCode: string;
      Phone: string;
      AsaasID: string;
      db_banco: string;
      db_agencia: string;
      db_conta: string;
      db_nome: string;
      db_cpf: string;
      db_finalidade: string;
      db_tipo: string;
      TUserAccountStatus_OID: number;
}
export interface SpReturnUserDetails {
      Parameters: StGenericAnswer;
      Results:Array<SpReturnUserDetails_Results> | null
}
export interface SpUserLogoutAll {
    Parameters: StGenericAnswer;
    Results:Array<{
      Email: string;
    }> | null
}
export interface SpUserLogin {
    Parameters: StGenericAnswer;
    Results:Array<{
      SessionCode: string;
      OID: number;
    }> | null
}
export interface SpEditUserPwd {
    Parameters: StGenericAnswer;
    Results:Array<{
      newpwd: string;
    }> | null
}

//Stored Procedures - Group(cashIN,cashOUT, UserGroups) Interface:
export interface FnReturnUserGroups_Results {
      TGroup_OID: number;
      Name: string;
      Description: string;
      Date: string;
      DateToPay: string,
      DateTimeModel: DateTimeModel;
      DateToPayModel:DateTimeModel;
      Value: string;
      Fee: string;
      SubLink: string;
      OwnerName: string;
      OwnerEmail: string;
      OwnerPhone: string;
      UserPrivileges: number;
}
export interface FnReturnUserGroups {
      Parameters: StGenericAnswer;
      Results:Array<FnReturnUserGroups_Results> | null
}



export interface FnReturnGroupUsers_Results {
      UserOID: number;
      Name: string;
      Email: string;
      Phone: string;
      UserPrivileges: number;
}
export interface FnReturnGroupUsers {
      Parameters: StGenericAnswer;
      Results:Array<FnReturnGroupUsers_Results> | null
}

export interface SpReturnGroupDescription_Results {
      Name: string;
      Description: string;
      Value: number;
      DateToPay: string;
      UserName: string;
      UserEmail: string;
}
export interface SpReturnGroupDescription {
      Parameters: StGenericAnswer;
      Results:Array<SpReturnGroupDescription_Results> | null
}


export enum TUserAccountStatusEnum {
    Ativa = 1,
    AguardandoConfirmacao = 2,
    Suspensa = 3,
    BloquedaMeuTime = 4,
}



export enum TUserGroupPrivilegesEnum {
    User = 1,     //Usuario - Jogador
    Admin = 2,    //Administrador - Jogador e Admin
    Partner = 3,  //Parceiro - Donos de quadra, parceiros comerciais, pessoas fisicas ou juridicas que recebem ou pagam para o grupo.
}
export enum ApiResultEnum {
    OK = 1,
    OK_EMPTY_LIST = 2,
    NOK_GENERAL_ERROR = -100
}

export interface cardModel {
    cc_name: string;
    cc_number: string;
    cc_month: string;
    cc_year: string;
    cc_ccv: string;
    cch_name: string;
    cch_email: string;
    cch_cpf: string;
    cch_phone: string;
}

@Injectable()
export class ApiProvider {

  constructor(public config: ConfigProvider,public http: Http) {
    console.log('Hello ApiProvider Provider');
  }

  private host: string = this.config.host.server.APIAddress;//"http://localhost/meutimev1/php/api/";
  public getHost():string{return this.host}
  //private host: string = "http://meutime.co/";


  public getEmptySpResultsObj(){return this.EmptySpResultsObject}
  private EmptySpResultsObject: {
    FnReturnUserGroups: FnReturnUserGroups,
    spReturnUserDetails: SpReturnUserDetails,
    spUserLogoutAll: SpUserLogoutAll,
    spUserLogin: SpUserLogin,
    spEditUserPwd: SpEditUserPwd} =

    {
    FnReturnUserGroups : {
    Parameters: {result:-1},
    Results:[{
      TGroup_OID: 0,
      Name: "",
      Description: "",
      Date: "",
      DateToPay: "",
      DateTimeModel: {Year:"",Month:"",Day:"",Hour:"",Minute:"",Second:""},
      DateToPayModel: {Year:"",Month:"",Day:"",Hour:"",Minute:"",Second:""},
      Value: "",
      Fee: "",
      SubLink: "",
      OwnerName: "",
      OwnerEmail: "",
      OwnerPhone: "",
      UserPrivileges: 0},],
    },
    spReturnUserDetails: {
      Parameters: {result:-1},
      Results:[{
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
        TUserAccountStatus_OID: 0,}],
    },
    spUserLogoutAll:{
      Parameters: {result:-1},
      Results:[{
        Email: ""}],
    },
    spUserLogin:{
      Parameters: {result:-1},
      Results:[{
        SessionCode: "",
        OID:0},],
    },
    spEditUserPwd:{
      Parameters: {result:-1},
      Results:[{
        newpwd: ""}],
    },
  };

  //PHP Serialize Function:
  public phpSerialize(_data: KeyValuePairModel[], appendToReqEnd?: boolean){
      
      let stg: string;
      if(appendToReqEnd == true){ stg ="&";}else{stg ="/?"} //appendToReqEnd: Adiciona no final da requisição

      for (let element of _data){
        stg = stg + element.key+"="+element.value+"&";
      }
      stg = stg.substring(0, stg.length-1);//Remove the last '&' character.
      //ConsoleLogService.log("HttpService","Serialized: "+ stg);
      return stg;
    }


  //Stored Procedures Call: - User interface:
  public runSpReturnUserDetails(parm:{email: string, session: string, userOID: number}): Promise<SpReturnUserDetails>{
    let data: KeyValuePairModel[]
        data = [
          {key:"email", value:parm.email},
          {key:"session", value:parm.session},
          {key:"userOID", value:parm.userOID}
        ];
    return new Promise(resolve => {
      //this.http.get(  this.host+'SpReturnUserDetails.php/?email=tf@gmail.com&session=xzz&userOID=1').map((res: Response) => res/*.json()*/)
      this.http.get(  this.host+'SpReturnUserDetails.php'+this.phpSerialize(data)).map((res: Response) => res/*.json()*/)
        .subscribe(data => {
          console.log("Sucess: 'runSpReturnUserDetails'. Details: ", data.json())
          resolve(data.json());
        },  err => {
          let ret: SpReturnUserDetails = {Parameters:{result:-1000}, Results:null };
          resolve(/*JSON.parse(err._body)*/ret);//console.log(err._body)
            console.log("Erro: 'runSpReturnUserDetails'")
          });

    });
  }

  public testSpReturnUserDetails(): Promise<SpReturnUserDetails>{
    let parm = {email: "tf@gmail.com", session: "xzz", userOID: 1};
    return new Promise(resolve => {
      this.runSpReturnUserDetails(parm).then((res)=>{if(res.Parameters.result==1){resolve(res)}else{/*ERROR Place!*/resolve(res);}});
    });
  }

  public runSpUserLogoutAll(parm:{email: string, session: string}): Promise<SpUserLogoutAll>{
    let data: KeyValuePairModel[]
        data = [
          {key:"email", value:parm.email},
          {key:"session", value:parm.session}
        ];
    return new Promise(resolve => {
      //this.http.get(  this.host+'SpUserLogoutAll.php/?email=tf@gmail.com&session=xzz').map((res: Response) => res/*.json()*/)
      this.http.get(  this.host+'SpUserLogoutAll.php'+this.phpSerialize(data)).map((res: Response) => res/*.json()*/)
        .subscribe(data => {
          console.log("Sucess: 'runSpUserLogoutAll'. Details: ", data.json())
          resolve(data.json());
        },  err => {
          let ret: SpUserLogoutAll = {Parameters:{result:-1000}, Results:null };
          resolve(/*JSON.parse(err._body)*/ret);//console.log(err._body)
            console.log("Erro: 'runSpUserLogoutAll'")
          });

    });
  }

  public testSpUserLogoutAll(): Promise<SpUserLogoutAll>{
    let parm = {email: "tf@gmail.com", session: "xzz"};
    return new Promise(resolve => {
      this.runSpUserLogoutAll(parm).then((res)=>{if(res.Parameters.result==1){resolve(res)}else{/*ERROR Place!*/resolve(res);}});
    });
  }

  public runSpUserLogin(parm:{email: string, pwd: string,groupOID: number}): Promise<SpUserLogin>{
    let data: KeyValuePairModel[]
        data = [
          {key:"email", value:parm.email},
          {key:"pwd", value:parm.pwd},
          {key:"groupOID", value:parm.groupOID},
        ];
    return new Promise(resolve => {
      //this.http.get(  this.host+'SpUserLogin.php/?email=tf@gmail.com&pwd=123').map((res: Response) => res/*.json()*/)
      this.http.get(  this.host+'SpUserLogin.php'+this.phpSerialize(data)).map((res: Response) => res/*.json()*/)
        .subscribe(data => {
          console.log("Sucess: 'runSpUserLogin'. Details: ", data.json())
          resolve(data.json());
        },  err => {
          let ret: SpUserLogin = {Parameters:{result:-1000}, Results:null };
          resolve(/*JSON.parse(err._body)*/ret);//console.log(err._body)
            console.log("Erro: 'runSpUserLogin'")
          });

    });
  }

  public testSpUserLogin(): Promise<SpUserLogin>{
    let parm = {email: "tf@gmail.com", pwd: "123456",groupOID:0};
    return new Promise(resolve => {
      this.runSpUserLogin(parm).then((res)=>{if(res.Parameters.result==1){resolve(res)}else{/*ERROR Place!*/resolve(res);}});
    });
  }

  public runSpEditUserPwd(parm:{email: string, session: string, oldpwd: string, newpwd: string}): Promise<SpEditUserPwd>{
    let data: KeyValuePairModel[]
        data = [
          {key:"email", value:parm.email},
          {key:"session", value:parm.session},
          {key:"oldpwd", value:parm.oldpwd},
          {key:"newpwd", value:parm.newpwd},
        ];
    return new Promise(resolve => {
      //this.http.get(  this.host+'SpEditUserPwd.php/?email=tf@gmail.com&session=xzz&oldpwd=123&newpwd=1234').map((res: Response) => res/*.json()*/)
      this.http.get(  this.host+'SpEditUserPwd.php'+this.phpSerialize(data)).map((res: Response) => res/*.json()*/)
        .subscribe(data => {
          console.log("Sucess: 'runSpEditUserPwd'. Details: ", data.json())
          resolve(data.json());
        },  err => {
          let ret: SpEditUserPwd = {Parameters:{result:-1000}, Results:null };
          resolve(/*JSON.parse(err._body)*/ret);//console.log(err._body)
            console.log("Erro: 'runSpEditUserPwd'")
          });

    });
  }

  public testSpEditUserPwd(): Promise<SpEditUserPwd>{
    let parm = {email: "tf@gmail.com", session: "xzz", oldpwd: "123456", newpwd: "123"};
    return new Promise(resolve => {
      this.runSpEditUserPwd(parm).then((res)=>{if(res.Parameters.result==1){resolve(res)}else{/*ERROR Place!*/resolve(res);}});
    });
  }

  //Stored Procedures Call: - Group(cashIN,cashOUT, UserGroups) Interface:
  public FnReturnUserGroups(parm:{email: string, session: string, userOID: number}): Promise<FnReturnUserGroups>{
    let data: KeyValuePairModel[]
        data = [
          {key:"email", value:parm.email},
          {key:"session", value:parm.session},
          {key:"userOID", value:parm.userOID}
        ];
    return new Promise(resolve => {
      //this.http.get(  this.host+'SpReturnUserDetails.php/?email=tf@gmail.com&session=xzz&userOID=1').map((res: Response) => res/*.json()*/)
      this.http.get(  this.host+'FnReturnUserGroups.php'+this.phpSerialize(data)).map((res: Response) => res/*.json()*/)
        .subscribe(data => {
          console.log("Sucess: 'FnReturnUserGroups'. Details: ", data.json())

          let res: FnReturnUserGroups = data.json();

          if(res.Parameters.result == 1){
            for (let elem of res.Results){
              elem.DateTimeModel = StaticStringUtil.mysqlDateTimeUnSerialize(elem.Date);
              elem.DateToPayModel = StaticStringUtil.mysqlDateTimeUnSerialize(elem.DateToPay);
            }
          }
          console.log("Date and Time: ", res.Results);


          resolve(res);
        },  err => {
          let ret: FnReturnUserGroups = {Parameters:{result:-1000}, Results:null };
          resolve(/*JSON.parse(err._body)*/ret);//console.log(err._body)
            console.log("Erro: 'runSpReturnUserDetails'")
          });

    });
  }

  public testFnReturnUserGroups(): Promise<FnReturnUserGroups>{
    let parm = {email: "tf@gmail.com", session: "xzz", userOID: 1};
    return new Promise(resolve => {
      this.FnReturnUserGroups(parm).then((res)=>{if(res.Parameters.result==1){resolve(res)}else{/*ERROR Place!*/resolve(res);}});
    });
  }

  public runSpActivateUserAccount(parm:{email: string}): Promise<StSimple>{
    let data: KeyValuePairModel[]
        data = [
          {key:"email", value:parm.email},
        ];
    return new Promise(resolve => {
      //this.http.get(  this.host+'SpUserLogin.php/?email=tf@gmail.com&pwd=123').map((res: Response) => res/*.json()*/)
      //console.log("XXXZZZ",this.host+'SpActivateUserAccount.php'+this.phpSerialize(data))
      this.http.get(  this.host+'SpActivateUserAccount.php'+this.phpSerialize(data)).map((res: Response) => res/*.json()*/)
        .subscribe(data => {
          console.log("Sucess: 'runSpActivateUserAccount'. Details: ", data.json())
          resolve(data.json());
        },  err => {
          let ret: StSimple = {Parameters:{result:-1000}, Results:null };
          resolve(/*JSON.parse(err._body)*/ret);//console.log(err._body)
            console.log("Erro: 'runSpActivateUserAccount'")
          });

    });
  }

  public testActivateUserAccount(): Promise<StSimple>{ //Não foi testada ainda.
    let parm = {email: "tf@gmail.com", pwd: "123456"};
    return new Promise(resolve => {
      this.runSpActivateUserAccount(parm).then((res)=>{if(res.Parameters.result==1){resolve(res)}else{/*ERROR Place!*/resolve(res);}});
    });
  }

  public FnCreateUser(parm:{email: string,pwd: string,name: string,phone: string, cpf:string,groupOID:number}): Promise<StSimple>{
    let data: KeyValuePairModel[]
        data = [
          {key:"email", value:parm.email},
          {key:"pwd", value:parm.pwd},
          {key:"name", value:parm.name},
          {key:"phone", value:parm.phone},
          {key:"cpf", value:parm.cpf},
          {key:"groupOID", value:parm.groupOID},
        ];
    return new Promise(resolve => {
      //this.http.get(  this.host+'SpUserLogin.php/?email=tf@gmail.com&pwd=123').map((res: Response) => res/*.json()*/)
      //console.log("XXXZZZ",this.host+'SpActivateUserAccount.php'+this.phpSerialize(data))
      this.http.get(  this.host+'FnCreateUser.php'+this.phpSerialize(data)).map((res: Response) => res/*.json()*/)
        .subscribe(data => {
          console.log("Sucess: 'FnCreateUser'. Details: ", data);
          resolve(data.json());
        },  err => {
          let ret: StSimple = {Parameters:{result:-1000}, Results:null };
          resolve(/*JSON.parse(err._body)*/ret);//console.log(err._body)
            console.log("Erro: 'FnCreateUser'")
          });

    });
  }

  public testStCreateUser(): Promise<StSimple>{ //Não foi testada ainda.
    let parm = {email: "abc@gmail.com", pwd: "123", name: "123", phone: "123",cpf:"123",groupOID:0};
    return new Promise(resolve => {
      this.FnCreateUser(parm).then((res)=>{if(res.Parameters.result==1){resolve(res)}else{/*ERROR Place!*/resolve(res);}});
    });
  }

  public runStUserForgotPwdRegisterNewPwd(parm:{email: string, oldpwd: string, newpwd: string}): Promise<StSimple>{ //Redefinição de senha para usuario não logado, quando se esquece da senha.
    let data: KeyValuePairModel[]
        data = [
          {key:"email", value:parm.email},
          {key:"oldpwd", value:parm.oldpwd},
          {key:"newpwd", value:parm.newpwd},
        ];
    return new Promise(resolve => {
      //this.http.get(  this.host+'SpUserLogin.php/?email=tf@gmail.com&pwd=123').map((res: Response) => res/*.json()*/)
      //console.log("XXXZZZ",this.host+'SpActivateUserAccount.php'+this.phpSerialize(data))
      this.http.get(  this.host+'StUserForgotPwdRegisterNewPwd.php'+this.phpSerialize(data)).map((res: Response) => res/*.json()*/)
        .subscribe(data => {
          console.log("Sucess: 'StUserForgotPwdRegisterNewPwd'. Details: ", data.json())
          resolve(data.json());
        },  err => {
          let ret: StSimple = {Parameters:{result:-1000}, Results:null };
          resolve(/*JSON.parse(err._body)*/ret);//console.log(err._body)
            console.log("Erro: 'StUserForgotPwdRegisterNewPwd'")
          });

    });
  }

  public testStUserForgotPwdRegisterNewPwd(): Promise<StSimple>{ //Não foi testada ainda.
    let parm = {email: "tf@gmail.com", oldpwd: "123456", newpwd: "123"};
    return new Promise(resolve => {
      this.runStUserForgotPwdRegisterNewPwd(parm).then((res)=>{if(res.Parameters.result==1){resolve(res)}else{/*ERROR Place!*/resolve(res);}});
    });
  }

  public FnCreateGroup(parm:{email: string,session: string,DateToPay: DateTimeModel,name: string, desc: string, value: number, userOID: number}): Promise<StSimple>{ //Redefinição de senha para usuario não logado, quando se esquece da senha.
    let data: KeyValuePairModel[]
        data = [
          {key:"email", value:parm.email},
          {key:"session", value:parm.session},
          {key:"DateToPay", value:StaticStringUtil.mysqlDateTimeSerialize(parm.DateToPay)},
          {key:"name", value:parm.name},
          {key:"desc", value:parm.desc},
          {key:"value", value:parm.value},
          {key:"ownerOID", value:parm.userOID},
        ];
    return new Promise(resolve => {
      //this.http.get(  this.host+'SpUserLogin.php/?email=tf@gmail.com&pwd=123').map((res: Response) => res/*.json()*/)
      //console.log("XXXZZZ",this.host+'SpActivateUserAccount.php'+this.phpSerialize(data))
      this.http.get(  this.host+'FnCreateGroup.php'+this.phpSerialize(data)).map((res: Response) => res/*.json()*/)
        .subscribe(data => {
          console.log("Sucess: 'FnCreateGroup'. Details: ", data.json())
          resolve(data.json());
        },  err => {
          let ret: StSimple = {Parameters:{result:-1000}, Results:null };
          resolve(/*JSON.parse(err._body)*/ret);//console.log(err._body)
            console.log("Erro: 'FnCreateGroup'")
          });

    });
  }

  public testFnCreateGroup(): Promise<StSimple>{ //Não foi testada ainda.
    let date: DateTimeModel = {Year:"",Month:"",Day:"",Hour:"",Minute:"",Second:""}
    let parm = {email:"",session:"",DateToPay:date,name: "Grupo do Joao", desc: "Futeba as Terças", value: 55, userOID: 1};
    return new Promise(resolve => {
      this.FnCreateGroup(parm).then((res)=>{if(res.Parameters.result==1){resolve(res)}else{/*ERROR Place!*/resolve(res);}});
    });
  }

  public FnDeleteGroup(parm:{email: string,session: string, groupOID: number, userOID: number}): Promise<StSimple>{ //Redefinição de senha para usuario não logado, quando se esquece da senha.
    let data: KeyValuePairModel[]
        data = [
          {key:"email", value:parm.email},
          {key:"session", value:parm.session},
          {key:"groupOID", value:parm.groupOID},
          {key:"userOID", value:parm.userOID},
        ];
    return new Promise(resolve => {
      //this.http.get(  this.host+'SpUserLogin.php/?email=tf@gmail.com&pwd=123').map((res: Response) => res/*.json()*/)
      //console.log("XXXZZZ",this.host+'SpActivateUserAccount.php'+this.phpSerialize(data))
      this.http.get(  this.host+'FnDeleteGroup.php'+this.phpSerialize(data)).map((res: Response) => res/*.json()*/)
        .subscribe(data => {
          console.log("Sucess: 'FnDeleteGroup'. Details: ", data.json())
          resolve(data.json());
        },  err => {
          let ret: StSimple = {Parameters:{result:-1000}, Results:null };
          resolve(/*JSON.parse(err._body)*/ret);//console.log(err._body)
            console.log("Erro: 'FnDeleteGroup'")
          });

    });
  }

  public testFnDeleteGroup(): Promise<StSimple>{ //Não foi testada ainda.
    let parm = {email:"",session:"",groupOID: 80, userOID: 1};
    return new Promise(resolve => {
      this.FnDeleteGroup(parm).then((res)=>{if(res.Parameters.result==1){resolve(res)}else{/*ERROR Place!*/resolve(res);}});
    });
  }

  public FnReturnGroupUsers(parm:{email: string,session: string, groupOID: number}): Promise<FnReturnGroupUsers>{ //Redefinição de senha para usuario não logado, quando se esquece da senha.
    let data: KeyValuePairModel[]
        data = [
          {key:"email", value:parm.email},
          {key:"session", value:parm.session},
          {key:"groupOID", value:parm.groupOID},
        ];
    return new Promise(resolve => {
      //this.http.get(  this.host+'SpUserLogin.php/?email=tf@gmail.com&pwd=123').map((res: Response) => res/*.json()*/)
      //console.log("XXXZZZ",this.host+'SpActivateUserAccount.php'+this.phpSerialize(data))
      this.http.get(  this.host+'FnReturnGroupUsers.php'+this.phpSerialize(data)).map((res: Response) => res/*.json()*/)
        .subscribe(data => {
          console.log("Sucess: 'FnReturnGroupUsers'. Details: ", data.json())
          resolve(data.json());
        },  err => {
          let ret: FnReturnGroupUsers = {Parameters:{result:-1000}, Results:null };
          resolve(/*JSON.parse(err._body)*/ret);//console.log(err._body)
            console.log("Erro: 'FnReturnGroupUsers'")
          });

    });
  }

  public testFnReturnGroupUsers(): Promise<FnReturnGroupUsers>{ //Não foi testada ainda.
    let parm = {email:"",session:"",groupOID: 1};
    return new Promise(resolve => {
      this.FnReturnGroupUsers(parm).then((res)=>{if(res.Parameters.result==1){resolve(res)}else{/*ERROR Place!*/resolve(res);}});
    });
  }

  public FnDeleteUserFromGroup(parm:{email: string,session: string, groupOID: number, userToBeRemovedOID: number, userOID: number}): Promise<FnReturnGroupUsers>{ //Redefinição de senha para usuario não logado, quando se esquece da senha.
    let data: KeyValuePairModel[]
        data = [
          {key:"email", value:parm.email},
          {key:"session", value:parm.session},
          {key:"groupOID", value:parm.groupOID},
          {key:"userToBeRemovedOID", value:parm.userToBeRemovedOID},
          {key:"userOID", value:parm.userOID},
        ];
    return new Promise(resolve => {
      //this.http.get(  this.host+'SpUserLogin.php/?email=tf@gmail.com&pwd=123').map((res: Response) => res/*.json()*/)
      console.log("XXXZZZ",this.host+'FnDeleteUserFromGroup.php'+this.phpSerialize(data))
      this.http.get(  this.host+'FnDeleteUserFromGroup.php'+this.phpSerialize(data)).map((res: Response) => res/*.json()*/)
        .subscribe(data => {
          console.log("Sucess: 'FnDeleteUserFromGroup'. Details: ", data.json())
          resolve(data.json());
        },  err => {
          let ret: FnReturnGroupUsers = {Parameters:{result:-1000}, Results:null };
          resolve(/*JSON.parse(err._body)*/ret);//console.log(err._body)
            console.log("Erro: 'FnDeleteUserFromGroup'")
          });

    });
  }

  public testFnDeleteUserFromGroup(): Promise<FnReturnGroupUsers>{ //Não foi testada ainda.
    let parm = {email:"",session:"",groupOID: 1,userToBeRemovedOID: 1,userOID: 1};
    return new Promise(resolve => {
      this.FnDeleteUserFromGroup(parm).then((res)=>{if(res.Parameters.result==1){resolve(res)}else{/*ERROR Place!*/resolve(res);}});
    });
  }

  public runSpReturnGroupDescription(parm:{groupOID: number}): Promise<SpReturnGroupDescription>{ //Redefinição de senha para usuario não logado, quando se esquece da senha.
    let data: KeyValuePairModel[]
        data = [
          {key:"groupOID", value:parm.groupOID},
        ];
    return new Promise(resolve => {
      //this.http.get(  this.host+'SpUserLogin.php/?email=tf@gmail.com&pwd=123').map((res: Response) => res/*.json()*/)
      //console.log("XXXZZZ",this.host+'SpActivateUserAccount.php'+this.phpSerialize(data))
      this.http.get(  this.host+'SpReturnGroupDescription.php'+this.phpSerialize(data)).map((res: Response) => res/*.json()*/)
        .subscribe(data => {
          console.log("Sucess: 'runSpReturnGroupDescription'. Details: ", data.json())
          resolve(data.json());
        },  err => {
          let ret: SpReturnGroupDescription = {Parameters:{result:-1000}, Results:null };
          resolve(/*JSON.parse(err._body)*/ret);//console.log(err._body)
            console.log("Erro: 'runSpReturnGroupDescription'")
          });

    });
  }

  public testSpReturnGroupDescription(): Promise<SpReturnGroupDescription>{ //Não foi testada ainda.
    let parm = {groupOID: 1};
    return new Promise(resolve => {
      this.runSpReturnGroupDescription(parm).then((res)=>{if(res.Parameters.result==1){resolve(res)}else{/*ERROR Place!*/resolve(res);}});
    });
  }

  public UtilSendEmail(parm:{title: string,content: string}): Promise<StSimple>{ //Redefinição de senha para usuario não logado, quando se esquece da senha.
    let data: KeyValuePairModel[]
        data = [
          {key:"title", value:parm.title},
          {key:"content", value:parm.content},
        ];
    return new Promise(resolve => {
      //this.http.get(  this.host+'SpUserLogin.php/?email=tf@gmail.com&pwd=123').map((res: Response) => res/*.json()*/)
      //console.log("XXXZZZ",this.host+'SpActivateUserAccount.php'+this.phpSerialize(data))
      this.http.get(  this.host+'UtilSendEmail.php'+this.phpSerialize(data)).map((res: Response) => res/*.json()*/)
        .subscribe(data => {
          console.log("Sucess: 'UtilSendEmail'. Details: ", data.json())
          resolve(data.json());
        },  err => {
          let ret: StSimple = {Parameters:{result:-1000}, Results:null };
          resolve(/*JSON.parse(err._body)*/ret);//console.log(err._body)
            console.log("Erro: 'UtilSendEmail'")
          });

    });
  }

  public testUtilSendEmail(): Promise<StSimple>{ //Não foi testada ainda.
    let parm = {title: "",content: ""};
    return new Promise(resolve => {
      this.UtilSendEmail(parm).then((res)=>{if(res.Parameters.result==1){resolve(res)}else{/*ERROR Place!*/resolve(res);}});
    });
  }

  public APIasaasPay(parm:{asaasID: string, card: cardModel, debt: string}): Promise<any>{
    let data: KeyValuePairModel[]
        data = [
          {key:"asaasID", value:parm.asaasID},
          {key:"debt", value:parm.debt},
          {key:"cc_ccv", value:parm.card.cc_ccv},
          {key:"cc_name", value:parm.card.cc_name},
          {key:"cc_year", value:parm.card.cc_year},
          {key:"cch_cpf", value:parm.card.cch_cpf},
          {key:"cc_month", value:parm.card.cc_month},
          {key:"cch_name", value:parm.card.cch_name},
          {key:"cc_number", value:parm.card.cc_number},
          {key:"cch_email", value:parm.card.cch_email},
          {key:"cch_phone", value:parm.card.cch_phone},
        ];
        console.log(this.host+'asaas_sub.php'+this.phpSerialize(data));
    return new Promise(resolve => {
      //this.http.get(  'http://localhost/pdv/php/api/SpReturnUserTransactionItens.php/?email=willyan_fidelis@hotmail.com&session=xzz&transactionOID=4').map((res: Response) => res/*.json()*/)
      this.http.get(  this.host+'asaas_sub.php'+this.phpSerialize(data)).map((res: Response) => res/*.json()*/)
        .subscribe(data => {
          console.log("Sucess: 'getUserInfoAPI'. Details: ", data.json())
          resolve(data.json());
        },  err => {
          let ret: {Parameters:{result:-1000}, Results:null };
          resolve(/*JSON.parse(err._body)*/ret);//console.log(err._body)
            console.log("Erro: 'getUserInfoAPI'")
          });

    });
  }

  public testAPIasaasPay(): Promise<any>{
    let parm = {asaasID: "xxx", card: {
      cc_name: "1",
      cc_number: "2",
      cc_month: "3",
      cc_year: "4",
      cc_ccv: "5",
      cch_name: "6",
      cch_email: "7",
      cch_cpf: "8",
      cch_phone: "9",
    },
    debt:"",
   };
    return new Promise(resolve => {
      this.APIasaasPay(parm).then((res)=>{if(res){resolve(res)}else{/*ERROR Place!*/resolve(res);}});
    });
  }

  //-------------------------------------------------
  public isJson(str: string | any): boolean {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  public isJsonResponse(data: Response): boolean {
    try {
      data.json();
    } catch (e) {
        return false;
    }
    return true;
  }

  //Requisição HTTP que retorna um JSON:
  //Use like this: this.api.get('XYZ.php'+this.api.phpSerialize(data),"XYZ").then((data)=>{}).catch(()=>{});
  public get(request: string, requestDebugName: string): Promise<any>{
    //Executa a requisição:
    let req: string = this.getHost()+request;
    console.log("Starting GET request for the URL: ",req);
    return new Promise((resolve,reject) => {
      this.http.get( req ).map((res: Response) => res/*.json()*/)
        .subscribe(data => {
          
          
          if(this.isJsonResponse(data)){
            console.log("Sucess GET Request(Response with valid JSON): '"+requestDebugName+"'. JSON recived: ", data.json())
            let res: any = data.json();
            resolve(res);
          }else{
            console.log("Erro GET Request(Response with invalid JSON): '"+requestDebugName+"'. Text recived: ", data);
            reject(null);
          }
          
        },  err => {
          console.log("Erro GET Request(no response): '"+requestDebugName+"'");
          reject(false);
          });

    });
  }
  
  //-------------------------------------------------

}
