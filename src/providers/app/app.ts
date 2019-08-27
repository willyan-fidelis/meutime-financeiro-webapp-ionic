import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { ApiProvider, KeyValuePairModel } from '../api/api';
import { StaticStringUtil, DateTimeModel } from '../../staticUtil/staticStringUtil';
/*
  App Provider é responsavel por:
  - gerenciar eventos como 'OnFirstTimeLoadedPage'
  - gerenciamento dinamico de temas da aplicação, trocando tema css de light para black por exemplo
  - gerenciar solicitações ao acesso de url's da barra de nagegação(plataform.url)
  - gerencia a pagina favorita do usuario
  - gerenciar todas subscribes da aplicação
*/
@Injectable()
export class AppProvider {

  constructor(public http: Http, public api: ApiProvider) {
    console.log('Hello AppProvider Provider');
  }

  private firstTimeLoadedList: Array<string> = [];

  public pageFirstTimeLoaded(page: string):boolean { //Retorna true se for a primeira vez que o metodo foi chamado com espeficica pagina
    let ret: boolean = true;

    let _item: Array<string> = this.firstTimeLoadedList.filter((elem, index, array) => { if(elem == page){ret=false;return true;} });

    if(ret == true){this.firstTimeLoadedList.push(page);}
    return ret;
  }
  //public set_pageFirstTimeLoaded(page: string):void {
  //  this.firstTimeLoadedList.push(page);
  //}


  private time: DateTimeModel;
  public GetTime(): DateTimeModel {
    return this.time;
  }
  public APIGetTime(): Promise<DateTimeModel>{
    
    //Agora montamos a requisição http, antes de exuta-la:
    let data: KeyValuePairModel[]
        data = [
          {key:"method", value:"Time"},
        ];
    
    //Executa a requisição:
    return new Promise((resolve,reject) => {

      this.api.get('APIGenericRequest.php'+this.api.phpSerialize(data),"updateManualCashFlow").then((data)=>{
        if(data.Result == true){
          let time: DateTimeModel = StaticStringUtil.mysqlDateTimeUnSerialize(data.Now);

          resolve(time)
        }else{reject(false);}
      }).catch(()=>{reject(false);});

    });
  }

}
