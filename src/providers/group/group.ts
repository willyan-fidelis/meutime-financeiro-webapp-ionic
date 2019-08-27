import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import {ApiProvider, KeyValuePairModel, FnReturnUserGroups_Results, FnReturnGroupUsers_Results, FnReturnGroupUsers, SpReturnGroupDescription, ApiResultEnum} from '../api/api';
import {UserProvider} from '../user/user';
import { Events } from 'ionic-angular';
import { StaticStringUtil, DateTimeModel } from '../../staticUtil/staticStringUtil';

export enum selectedGroupEnun{
  NONE = -1,
}

export enum TFinancialTransactionStatusEnum { //Referencia externa: TFinancialTransactionStatus_OID
  nok_Requerido = -10,
  nok_Rejeitado = 20,
  nok_EmDisputa = 30,
  nok_Estornado = 40,
  ok_Pago = 1000,
  ok_Aprovado = 1100,
  ok_Disponivel = 1200,
  ok_NaoEstornado = 1300,
}
export enum TFinancialTransactionStatusConciseEnum { //Status consiso(resumido)
  ok = 1,
  nok = 2,
  open = 3,
}

export enum GroupEvents {
    OnGroupRequest                  ="OnGroupRequest",
    OnGotUsergroupsList             = "OnGotUsergroupsList",
    OnGotUsergropsCashIn            = "OnGotUsergropsCashIn",
    OnGotUsergropsCashOut           = "OnGotUsergropsCashOut",
    OnGotUserGroupsAndCashFlow      = "OnGotUserGroupsAndCashFlow",
    OnCreateGroup                   = "OnCreateGroup",
    OnCreateGroupError              = "OnCreateGroupError",
    OnDeleteGroup                   = "OnDeleteGroup",
    OnDeleteGroupError              = "OnDeleteGroupError",
    OnGotGroupUsers                 = "OnGotGroupUsers",
    OnGotGroupUsersError            = "OnGotGroupUsersError",
    OnGotGroupDescription           = "OnGotGroupDescription",
    OnGotGroupDescriptionError      = "OnGotGroupDescriptionError",
    OnDeleteUserFromGroupError      = "OnDeleteUserFromGroupError",
}

export interface CashFlowModel {
      Input:  number;
      Output: number;
      Total:  number;
}

export interface CashFlowResumeModel {
  TotalPayment:  CashFlowModel;
  PlataformPayment:  CashFlowModel;
  ManualPayment: CashFlowModel;
}

export enum CashTypeEnum { //Referencia externa: TCashTypeEnum
  SlipPayment = 1,
  CreditPayment = 2,
  ManualPayment = 10,
  SlipSubscription = 20,
  CreditSubscription = 21,
}
export enum CashTypeConciseEnum { //Status consiso(resumido)
  PlataformPayment = 1, //Dinheiro recebido na plataforma. Dinheiro 'real' de fato
  ManualPayment = 2, //Acordo de assinatura
  SubscriptionAgreement = 3,  //Dinheiro fora da plataforma, recebido manualmente, sem nosso controle
}


export enum CashFlowTypeEnum { //Referencia externa: TCashFlowType
  UserToGroup   = 1, //Fluxo positivo para o grupo
  GroupToUser   = 2, //Fluxo positivo para o usuario
  //UserToUser    = 3, //Not Used Yet - Maybe never will be :*)
  //GroupToGroup  = 4, //Not Used Yet - Maybe never will be :*)
}

export interface GroupCashFlowModel {
  //Dados recebidos diretamente da request:
  Name:                        string;
  Email:                       string;
  Date:                        string;
  TFinancialTransactionStatus: number;
  CleanValue:                  number;
  GrossValue:                  number;
  Fee:                         number;
  Description:                 string;
  CashOID:                     number;
  TCashFlowType_OID:           number;
  TCashType_OID:               number;
  AsaasID:                     string;
  AsaasDetail:                 string;
  //Dados criados no momento do recebimento da request:
  DateTimeModel:               DateTimeModel;
  TFinancialTransactionStatusConcise: number;
}

export interface GroupCashFlowResponseModel {
  All:              Array<GroupCashFlowModel> | null;
  UserToGroup:      Array<GroupCashFlowModel> | null;
  GroupToUser:      Array<GroupCashFlowModel> | null;
  Result:           boolean;
}

export enum TCashTypeEnum { //referencia externa: TCashType
  ok = 1,
  nok = 2,
  open = 3,
}

@Injectable()
export class GroupProvider {

  private groupCash: Array<GroupCashFlowResponseModel> = [];
  public getGroupCash():Array<GroupCashFlowResponseModel>{ return this.groupCash; }

  constructor(public http: Http, public user: UserProvider, public events: Events, public api: ApiProvider) {
      console.log('Hello UsergroupsProvider Provider');
    }

    private selectedGroup: number = selectedGroupEnun.NONE;
    public setSelectedGroup(groupIndex: number): void{
      this.selectedGroup = groupIndex;
    }
    public getSelectedGroup(): number{
      return this.selectedGroup;
    }

    //Função para fazer for assincrtono, de tal forma que espera a função assincrona terminar par pular para proxima iteração:
    //https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
    //https://medium.com/@alcidesqueiroz/javascript-ass%C3%ADncrono-callbacks-promises-e-async-functions-9191b8272298
    private async asyncFor(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }
    //Usergroups
    private usergroups: Array<FnReturnUserGroups_Results> =
    [
     //  {
     //   TGroup_OID: 0,
     //   Name: "Sem Grupos",
     //   Description: "",
     //   Date: "",
     //   DateTimeModel: {Year:"",Month:"",Day:"",Hour:"",Minute:"",Second:""},
     //   Value: "",
     //   Fee: "",
     //   SubLink: "",
     //   OwnerName: "",
     //   OwnerEmail: "",
     //   OwnerPhone: "",
     //   UserPrivileges: 0,
     // },
   ];

    public getUsergroups(): Array<FnReturnUserGroups_Results>{return this.usergroups};

    

    //Grana por grupo do usuario:
    public groupsCashFlow: Array<CashFlowResumeModel> = [];

    //public getGroupsCashFlow(): CashFlowModel{return this.clearGroupsCashFlow()}


    //Empty Objects:
    public EmptyGroupUsers():Array<FnReturnGroupUsers_Results>{
      return JSON.parse(JSON.stringify(
        [{
          UserOID: 0,
          Name: "",
          Email: "",
          Phone: "",
          UserPrivileges: 0,
        }]
      ))
    }

    public calcCash(){


      this.groupCash.forEach((element, index, array)=>{
        if(this.groupsCashFlow[index] != null){this.groupsCashFlow[index].TotalPayment.Total = 0;this.groupsCashFlow[index].TotalPayment.Input = 0;}

        this.groupCash[index].UserToGroup.forEach((element, j, array)=>{
          //So computamos transações ok:
          if(TFinancialTransactionStatusConciseEnum.ok == element.TFinancialTransactionStatusConcise){
            //TotalPayment:
            this.groupsCashFlow[index].TotalPayment.Total = Number(this.groupsCashFlow[index].TotalPayment.Total) + Number(element.CleanValue)
            this.groupsCashFlow[index].TotalPayment.Input = Number(this.groupsCashFlow[index].TotalPayment.Input) + Number(element.CleanValue)
            
            //PlataformPayment:
            if(element.TCashType_OID >= 1 && element.TCashType_OID < 10){
              this.groupsCashFlow[index].PlataformPayment.Total = Number(this.groupsCashFlow[index].PlataformPayment.Total) + Number(element.CleanValue)
              this.groupsCashFlow[index].PlataformPayment.Input = Number(this.groupsCashFlow[index].PlataformPayment.Input) + Number(element.CleanValue)
            }

            //ManualPayment:
            if(element.TCashType_OID >= 10 && element.TCashType_OID < 20){
              this.groupsCashFlow[index].ManualPayment.Total = Number(this.groupsCashFlow[index].ManualPayment.Total) + Number(element.CleanValue)
              this.groupsCashFlow[index].ManualPayment.Input = Number(this.groupsCashFlow[index].ManualPayment.Input) + Number(element.CleanValue)
            }
            
          }
        })
      })

      this.groupCash.forEach((element, index, array)=>{
        if(this.groupsCashFlow[index] != null){this.groupsCashFlow[index].TotalPayment.Output = 0;}

        this.groupCash[index].GroupToUser.forEach((element, j, array)=>{
          //So computamos transações ok:
          if(TFinancialTransactionStatusConciseEnum.ok == element.TFinancialTransactionStatusConcise){
            //TotalPayment:
            this.groupsCashFlow[index].TotalPayment.Total = Number(this.groupsCashFlow[index].TotalPayment.Total) - Number(element.CleanValue)
            this.groupsCashFlow[index].TotalPayment.Output = Number(this.groupsCashFlow[index].TotalPayment.Output) + Number(element.CleanValue)
            
            //PlataformPayment:
            if(element.TCashType_OID >= 1 && element.TCashType_OID < 10){
              this.groupsCashFlow[index].PlataformPayment.Total = Number(this.groupsCashFlow[index].PlataformPayment.Total) - Number(element.CleanValue)
              this.groupsCashFlow[index].PlataformPayment.Output = Number(this.groupsCashFlow[index].PlataformPayment.Output) + Number(element.CleanValue)
            }

            //ManualPayment:
            if(element.TCashType_OID >= 10 && element.TCashType_OID < 20){
              this.groupsCashFlow[index].ManualPayment.Total = Number(this.groupsCashFlow[index].ManualPayment.Total) - Number(element.CleanValue)
              this.groupsCashFlow[index].ManualPayment.Output = Number(this.groupsCashFlow[index].ManualPayment.Output) + Number(element.CleanValue)
            }

          }
        })
      })

      console.log("Flow iss: ",this.groupsCashFlow)
    }
    //Pega o fluxo de grana:
    public async  getUserGroupsAndCashFlow(){

      //Busca todos os grupos do usuário:
      let parm = {email: this.user.getUser().Email, session: this.user.getUser().SessionCode, userOID: this.user.getUser().OID};
      await this.api.FnReturnUserGroups(parm).then((res)=>{if(res.Parameters.result==ApiResultEnum.OK){this.usergroups = res.Results;}else if(res.Parameters.result==ApiResultEnum.OK_EMPTY_LIST){this.usergroups = [];}else{/*ERROR Place!*/;}});
      this.events.publish(GroupEvents.OnGotGroupUsers,this.usergroups);

      

      await this.asyncFor(this.usergroups, async (elem, index, array) => {
        await this.getGroupCashFlow(elem.TGroup_OID).then((data)=>{  this.groupCash[index] = data; }).catch(()=>{ this.groupsCashFlow = []; this.groupCash = []; });//NEW

        //let parm = {email: this.user.getUser().Email, session: this.user.getUser().SessionCode, groupOID: elem.TGroup_OID};
        //await this.api.runSpReturnUserInGroupCashIn(parm).then((res)=>{if(res.Parameters.result==ApiResultEnum.OK){this.usergroupscashin[index]=res.Results;}else{/*ERROR Place!*/;}});
        //await this.api.runSpReturnUserInGroupCashOut(parm).then((res)=>{if(res.Parameters.result==ApiResultEnum.OK){this.usergroupscashout[index]=res.Results;}else{/*ERROR Place!*/;}});
        //await this.api.runSpReturnUserInGroupCash(parm).then((res)=>{if(res.Parameters.result==ApiResultEnum.OK){this.usergroupscash[index]=res.Results;}else{/*ERROR Place!*/;}});
        this.groupsCashFlow[index] = {TotalPayment:{Input:0,Output:0,Total:0,},PlataformPayment:{Input:0,Output:0,Total:0,},ManualPayment:{Input:0,Output:0,Total:0,}};
      })

      this.events.publish(GroupEvents.OnGotUserGroupsAndCashFlow);
      this.events.publish(GroupEvents.OnGroupRequest);
      //console.log(this.usergroupscashin,this.usergroupscashout,this.usergroupscash)
      console.log("Hello: ",this.groupCash)
      this.calcCash();

    }

    public creategroup(dateToPay:DateTimeModel,name:string,desc:string,value:number): Promise<boolean | null>{
      let parm = {email:this.user.getUser().Email,session:this.user.getUser().SessionCode,DateToPay: dateToPay,name: name,desc: desc,value: value,userOID: this.user.getUser().OID};
      return new Promise(resolve => {
        this.api.FnCreateGroup(parm).then((res)=>{
          if(res.Parameters.result==ApiResultEnum.OK){
            this.events.publish(GroupEvents.OnCreateGroup,null);this.events.publish(GroupEvents.OnGroupRequest);
            resolve(true);
          }else{/*ERROR Place!*/this.events.publish(GroupEvents.OnCreateGroupError,null);this.events.publish(GroupEvents.OnGroupRequest);resolve(null);}});
      });
    }
    public deletegroup(groupOID:number): Promise<boolean | null>{
      let parm = {email:this.user.getUser().Email,session:this.user.getUser().SessionCode,groupOID: groupOID,userOID: this.user.getUser().OID};
      return new Promise(resolve => {
        this.api.FnDeleteGroup(parm).then((res)=>{
          if(res.Parameters.result==ApiResultEnum.OK){
            this.events.publish(GroupEvents.OnDeleteGroup,null);this.events.publish(GroupEvents.OnGroupRequest);
            resolve(true);
          }
          else if(res.Parameters.result==ApiResultEnum.OK_EMPTY_LIST){
            this.usergroups = [];
            this.events.publish(GroupEvents.OnDeleteGroup,null);this.events.publish(GroupEvents.OnGroupRequest);
            resolve(true);
          }
          else{/*ERROR Place!*/this.events.publish(GroupEvents.OnDeleteGroupError,null);resolve(null);}});
      });
    }
    public getgroupusers(groupOID:number): Promise<FnReturnGroupUsers | null>{
      let parm = {email:this.user.getUser().Email,session:this.user.getUser().SessionCode,groupOID: groupOID};
      return new Promise((resolve,reject) => {
        this.api.FnReturnGroupUsers(parm).then((res)=>{
          if(res.Parameters.result==ApiResultEnum.OK){
            this.events.publish(GroupEvents.OnGotGroupUsers,res);this.events.publish(GroupEvents.OnGroupRequest);
            resolve(res);
          }
          else{/*ERROR Place!*/this.events.publish(GroupEvents.OnGotGroupUsersError,null);this.events.publish(GroupEvents.OnGroupRequest);reject(null);}});
      });
    }
    public deleteuserfromgroup(groupOID:number,userToBeRemovedOID:number): Promise<FnReturnGroupUsers | null>{ //Deleta um jogador do grupo
      let parm = {email:this.user.getUser().Email,session:this.user.getUser().SessionCode,groupOID: groupOID, userToBeRemovedOID:userToBeRemovedOID,userOID:this.user.getUser().OID};
      return new Promise(resolve => {
        this.api.FnDeleteUserFromGroup(parm).then((res)=>{
          if(res.Parameters.result==ApiResultEnum.OK){
            this.events.publish(GroupEvents.OnGotGroupUsers,res);this.events.publish(GroupEvents.OnGroupRequest);
            resolve(res);
          }
          else{/*ERROR Place!*/this.events.publish(GroupEvents.OnDeleteUserFromGroupError,null);this.events.publish(GroupEvents.OnGroupRequest);resolve(null);}});
      });
    }
    public getgroupdescripition(groupOID:number): Promise<SpReturnGroupDescription | null>{
      let parm = {groupOID: groupOID};
      return new Promise(resolve => {
        this.api.runSpReturnGroupDescription(parm).then((res)=>{
          if(res.Parameters.result==ApiResultEnum.OK){
            this.events.publish(GroupEvents.OnGotGroupDescription,res);this.events.publish(GroupEvents.OnGroupRequest);
            resolve(res);
          }else{/*ERROR Place!*/this.events.publish(GroupEvents.OnGotGroupDescriptionError,null);this.events.publish(GroupEvents.OnGroupRequest);resolve(null);}});
      });
    }

    //Novas funções devem ser implementadas diretamente nessa classe, sem a necessidade de cliar uma chamada http antes em APIService

    private getGroupCashFlow(groupOID: number): Promise<GroupCashFlowResponseModel>{
    
    
      //Agora montamos a requisição http, antes de exuta-la:
      let data: KeyValuePairModel[]
          data = [
            {key:"method", value:"GroupCashFlow"},
            {key:"email", value:this.user.getUser().Email},
            {key:"session", value:this.user.getUser().SessionCode},
            {key:"startDate", value:"2015-03-09 19:45:00"},
            {key:"endDate", value:"2030-03-09 19:45:00"},
            {key:"groupOID", value:groupOID}
          ];
      
      //Executa a requisição:
      return new Promise((resolve,reject) => {
        this.http.get(  this.api.getHost()+'APIGroupRequest.php'+this.api.phpSerialize(data)).map((res: Response) => res/*.json()*/)
          .subscribe(data => {
            console.log("Sucess: 'getGroupCashFlow'. Data: ", data)
            console.log("Sucess: 'getGroupCashFlow'. Json: ", data.json())
            //let res = data.json();

            let res: GroupCashFlowResponseModel = data.json();

            if(res.Result == true){

              

            if(res.Result == true){
              for (let elem of res.All){
                //Formata a data:
                elem.DateTimeModel = StaticStringUtil.mysqlDateTimeUnSerialize(elem.Date);

                //Formata Status consiso(resumido):
                if(elem.TFinancialTransactionStatus < 0){elem.TFinancialTransactionStatusConcise = TFinancialTransactionStatusConciseEnum.open}
                else if(elem.TFinancialTransactionStatus >= 1000){elem.TFinancialTransactionStatusConcise = TFinancialTransactionStatusConciseEnum.ok}
                else{elem.TFinancialTransactionStatusConcise = TFinancialTransactionStatusConciseEnum.nok}

              }
            }
            if(res.Result == true){
              for (let elem of res.GroupToUser){
                //Formata a data:
                elem.DateTimeModel = StaticStringUtil.mysqlDateTimeUnSerialize(elem.Date);

                //Formata Status consiso(resumido):
                if(elem.TFinancialTransactionStatus < 0){elem.TFinancialTransactionStatusConcise = TFinancialTransactionStatusConciseEnum.open}
                else if(elem.TFinancialTransactionStatus >= 1000){elem.TFinancialTransactionStatusConcise = TFinancialTransactionStatusConciseEnum.ok}
                else{elem.TFinancialTransactionStatusConcise = TFinancialTransactionStatusConciseEnum.nok}

              }
            }
            if(res.Result == true){
              for (let elem of res.UserToGroup){
                //Formata a data:
                elem.DateTimeModel = StaticStringUtil.mysqlDateTimeUnSerialize(elem.Date);

                //Formata Status consiso(resumido):
                if(elem.TFinancialTransactionStatus < 0){elem.TFinancialTransactionStatusConcise = TFinancialTransactionStatusConciseEnum.open}
                else if(elem.TFinancialTransactionStatus >= 1000){elem.TFinancialTransactionStatusConcise = TFinancialTransactionStatusConciseEnum.ok}
                else{elem.TFinancialTransactionStatusConcise = TFinancialTransactionStatusConciseEnum.nok}

              }
            }

              resolve(res);}else{let ret: GroupCashFlowResponseModel = {Result:false, All: null, UserToGroup: null, GroupToUser: null};reject(ret);}
          },  err => {
            let ret: GroupCashFlowResponseModel = {Result:false, All: null, UserToGroup: null, GroupToUser: null};
            //this.events.publish(PaymentEvents.OnPayTodayAndSubscribeNextMonthWithCCError);
            reject(/*JSON.parse(err._body)*/ret);//console.log(err._body)
              console.log("Erro: 'getGroupCashFlow'")
            });
  
      });
    }

    public createManualCashFlow(userOID: number,groupOID: number,value: number,description: string, cashflowtype: number): Promise<boolean>{
    
    
      //Agora montamos a requisição http, antes de exuta-la:
      let data: KeyValuePairModel[]
          data = [
            {key:"method", value:"createManualCashFlow"},
            {key:"userOID", value:userOID},
            {key:"groupOID", value:groupOID},
            {key:"value", value:value},
            {key:"description", value:description},
            {key:"cashflowtype", value:cashflowtype}
          ];
      
      //Executa a requisição:
      return new Promise((resolve,reject) => {

        this.api.get('APIGroupRequest.php'+this.api.phpSerialize(data)+this.AddUserAndSessionPHPQueryParams(),"createManualCashFlow").then((data)=>{
          if(data.Result == true){
            resolve(true)
          }else{reject(false);}
        }).catch(()=>{reject(false);});
  
      });
    }
    public deleteManualCashFlow(CashOID: number): Promise<boolean>{
    
    
      //Agora montamos a requisição http, antes de exuta-la:
      let data: KeyValuePairModel[]
          data = [
            {key:"method", value:"deleteManualCashFlow"},
            {key:"CashOID", value:CashOID},
          ];
      
      //Executa a requisição:
      return new Promise((resolve,reject) => {

        this.api.get('APIGroupRequest.php'+this.api.phpSerialize(data)+this.AddUserAndSessionPHPQueryParams(),"deleteManualCashFlow").then((data)=>{
          if(data.Result == true){
            resolve(true)
          }else{reject(false);}
        }).catch(()=>{reject(false);});
  
      });
    }
    public updateManualCashFlow(CashOID: number,value:number,desc:string,status:number): Promise<boolean>{
    
    
      //Agora montamos a requisição http, antes de exuta-la:
      let data: KeyValuePairModel[]
          data = [
            {key:"method", value:"updateManualCashFlow"},
            {key:"CashOID", value:CashOID},
            {key:"value", value:value},
            {key:"desc", value:desc},
            {key:"status", value:status},
          ];
      
      //Executa a requisição:
      return new Promise((resolve,reject) => {

        this.api.get('APIGroupRequest.php'+this.api.phpSerialize(data)+this.AddUserAndSessionPHPQueryParams(),"updateManualCashFlow").then((data)=>{
          if(data.Result == true){
            resolve(true)
          }else{reject(false);}
        }).catch(()=>{reject(false);});
  
      });
    }

    public AddUserAndSessionPHPQueryParams(): string{
      let data: KeyValuePairModel[]
          data = [
            {key:"email", value:this.user.getUser().Email},
            {key:"session", value:this.user.getUser().SessionCode},
          ];
      return this.api.phpSerialize(data, true);
    }

    
}
