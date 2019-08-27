import { Injectable } from '@angular/core';

/*
  Classe para armazenar confirações estaticas da aplicação, como por exemplo caminhos/endereços de imagens consumidas pelas paginas...
*/

//Classe armazena apenas Strings
@Injectable()
export class ConfigProvider {

  constructor() {
    console.log('Hello ConfigProvider Provider');
    //this.mute_ConsoleLog();
  }
  //https://coderwall.com/p/1l4cba/silence-javascript-console-output ---------------------------->>>
  private ___log: any = console.log;
  /**
   * Silences console.log
   * Undo this effect by calling unmute().
   */
  private mute_ConsoleLog() {
      console.log = function(){};
  }
  /**
   * Un-silences console.log
   */
  private unmute_ConsoleLog() {
      console.log = this.___log;
  }
  //https://coderwall.com/p/1l4cba/silence-javascript-console-output ----------------------------<<<

  private localHost: any = {
    LoginPage: {
      imgPath_campo : "../../assets/imgs/campo.jpg", //Imagem de fundo pagina de loggin
      imgPath_logo1 : "../../assets/imgs/logo1.jpeg", //Imagem do logo que aparece no cabeçalho da pagina
      imgPath_logo3 : "../../assets/imgs/logo3.png", //Imagem do logo que aparece no cabeçalho da pagina
    },
    server: {
        APIAddress : "http://localhost/meutimev1/php/api/", //Endereço da API PHP
    }
  };

  private remoteHost: any = {
    LoginPage: {
      imgPath_campo : "../../app/assets/imgs/campo.jpg", //Imagem de fundo pagina de loggin
      imgPath_logo1 : "../../app/assets/imgs/logo1.jpeg", //Imagem do logo que aparece no cabeçalho da pagina
      imgPath_logo3 : "../../app/assets/imgs/logo3.png", //Imagem do logo que aparece no cabeçalho da pagina
    },
    server: {
        APIAddress : "https://meutime.co/php/data/meutimev1/api/", //Endereço da API PHP
    }
  };

  public host: any = this.remoteHost; //localHost//remoteHost

  // //---------- Local Server ---------->>>
  // public LoginPage: any = {
  //   imgPath_campo : "../../assets/imgs/campo.jpg", //Imagem de fundo pagina de loggin
  //   imgPath_logo1 : "../../assets/imgs/logo1.jpeg", //Imagem do logo que aparece no cabeçalho da pagina
  // };
  // public host: any = {
  //   APIAddress : "http://localhost/meutimev1/php/api/", //Endereço da API PHP
  // };
  // //---------- Local Server <<<----------

  //---------- Remote Server ---------->>>
  // public LoginPage: any = {
  //   imgPath_campo : "../../app/assets/imgs/campo.jpg", //Imagem de fundo pagina de loggin
  //   imgPath_logo1 : "../../app/assets/imgs/logo1.jpeg", //Imagem do logo que aparece no cabeçalho da pagina
  // };
  // public host: any = {
  //   APIAddress : "http://meutime.co/php/data/meutimev1/api/", //Endereço da API PHP
  // };
  //---------- Remote Server <<<----------

}
