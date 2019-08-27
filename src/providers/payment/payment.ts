import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import {ApiProvider, KeyValuePairModel} from '../api/api';
import { Events } from 'ionic-angular';
import {UserProvider} from '../user/user';
import {GroupProvider} from '../group/group';
import { StaticStringUtil, DateTimeModel } from '../../staticUtil/staticStringUtil';


export enum PaymentEvents {
  OnPayTodayAndSubscribeNextMonthWithCC             = "OnPayTodayAndSubscribeNextMonthWithCC",
  OnPayTodayAndSubscribeNextMonthWithCCError        = "OnPayTodayAndSubscribeNextMonthWithCCError",
}

//Stored Procedures - User Interface:
export interface CreditCardPaymentModel {
      cc_name: string;
      cc_number: string;
      cc_month: string;
      cc_year: string;
      cc_ccv: string;
      cch_name: string;
      cch_email: string;
      cch_cpf: string;
      cch_postalcode: string;
      cch_address_number: string;
      cch_phone: string;
}

export interface APIPayment_PayAndSubscribe{
      Result: number;
}

@Injectable()
export class PaymentProvider {

  constructor(public http: Http, public events: Events, public api: ApiProvider, public user: UserProvider, public group: GroupProvider) {
    console.log('Hello PaymentProvider Provider');
  }

  //Stored Procedures Call: - User interface:
  public PayTodayAndSubscribeNextMonthWithCC(groupIndex: number,cc: CreditCardPaymentModel): Promise<APIPayment_PayAndSubscribe>{
    
    
    //Agora montamos a requisição http, antes de exuta-la:
    let data: KeyValuePairModel[]
        data = [
          {key:"method", value:"PayTodayAndSubscribeNextMonthWithCC"},
          {key:"CUSTOMER_ID", value:this.user.getUser().AsaasID},
          {key:"value", value:this.group.getUsergroups()[groupIndex].Value},
          {key:"fee", value:this.group.getUsergroups()[groupIndex].Fee},
          {key:"description", value:"Mensalidade MeuTime: " + this.group.getUsergroups()[groupIndex].Description + ". Email: " + this.user.getUser().Email},
          {key:"dayToPay", value:StaticStringUtil.mysqlDateTimeUnSerialize(this.group.getUsergroups()[groupIndex].DateToPay).Day},
          {key:"cc_name", value:cc.cc_name},
          {key:"cc_number", value:cc.cc_number},
          {key:"cc_month", value:cc.cc_month},
          {key:"cc_year", value:cc.cc_year},
          {key:"cc_ccv", value:cc.cc_ccv},
          {key:"cch_name", value:cc.cch_name},
          {key:"cch_email", value:cc.cch_email},
          {key:"cch_cpf", value:cc.cch_cpf},
          {key:"cch_postalcode", value:cc.cch_postalcode},
          {key:"cch_address_number", value:cc.cch_address_number},
          {key:"cch_phone", value:cc.cch_phone},

          {key:"user_name", value:this.user.getUser().Name},
          {key:"user_email", value:this.user.getUser().Email},
          {key:"user_phone", value:this.user.getUser().Phone},
          {key:"user_cpf", value:this.user.getUser().CPF},
        ];
    
    //Executa a requisição:
    return new Promise((resolve,reject) => {
      this.http.get(  this.api.getHost()+'APIPayment.php'+this.api.phpSerialize(data)).map((res: Response) => res/*.json()*/)
        .subscribe(data => {
          console.log("Sucess: 'PayTodayAndSubscribeNextMonthWithCC'. Details: ", data)
          let res = data.json();
          if(res.Result == 1){this.events.publish(PaymentEvents.OnPayTodayAndSubscribeNextMonthWithCC);resolve(res);}else{let ret: APIPayment_PayAndSubscribe = {Result:null};reject(ret);}
        },  err => {
          let ret: APIPayment_PayAndSubscribe = {Result:null};
          this.events.publish(PaymentEvents.OnPayTodayAndSubscribeNextMonthWithCCError);
          reject(/*JSON.parse(err._body)*/ret);//console.log(err._body)
            console.log("Erro: 'PayTodayAndSubscribeNextMonthWithCC'")
          });

    });
  }

  public testPayTodayAndSubscribeNextMonthWithCC(): Promise<APIPayment_PayAndSubscribe>{
    let cc: CreditCardPaymentModel;
    return new Promise(resolve => {
      this.PayTodayAndSubscribeNextMonthWithCC(0,cc).then((res)=>{if(res.Result==1){resolve(res)}else{/*ERROR Place!*/resolve(res);}});
    });
  }

}
