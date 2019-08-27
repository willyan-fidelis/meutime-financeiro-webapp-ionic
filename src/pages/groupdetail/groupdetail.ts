import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ApiProvider, FnReturnGroupUsers_Results } from '../../providers/api/api';
import { CashTypeEnum, GroupProvider, TFinancialTransactionStatusConciseEnum, selectedGroupEnun, } from '../../providers/group/group';
import { UserProvider } from '../../providers/user/user';
import { AlertProvider } from '../../providers/alert/alert';
import { PaymentProvider, CreditCardPaymentModel } from '../../providers/payment/payment';
import { FieldsValidation } from '../../staticUtil/staticStringUtil';
import { FormatNumber } from '../../staticUtil/staticStringUtil';
import { AppProvider } from '../../providers/app/app';


//TAB Pages --->
import { TabsComponent,TabInterfaceModel } from '../../components/tabs/tabs';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { GrouplistPage } from '../grouplist/grouplist';
import { GroupoverviewPage } from '../groupoverview/groupoverview';
//TAB Pages <---

import { HeaderComponent } from '../../components/header/header';
import { TabMonthNavComponent } from '../../components/tab-month-nav/tab-month-nav';

@Component({
  selector: 'page-groupdetail',
  templateUrl: 'groupdetail.html',
})
export class GroupdetailPage {

  private groupIndex: number;
  private pageID: string = "A"; // A = Detalhes do Grupo | B = Fluxo de Caixa | C = Estrato Financeiro

  private groupmembers:     Array<FnReturnGroupUsers_Results> = this.group.EmptyGroupUsers();

  private TransStatus = TFinancialTransactionStatusConciseEnum;

  constructor(public app: AppProvider, public group: GroupProvider, public payment: PaymentProvider, public alert: AlertProvider, public user: UserProvider, public api: ApiProvider,public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.groupIndex = this.navParams.get('groupIndex');
    this.pageID = this.navParams.get('pageID');

    this.group.getgroupusers(this.groupDetail().TGroup_OID).then((data)=>{this.groupmembers = data.Results}).catch(()=>{this.alert.showOk("Atenção","Erro ao consultar jogadores. Tente novamente","Ok",()=>{});})

    console.log("X",this.groupDetail(),this.groupCashFlow(),this.groupCashIn(),this.groupCashOut(),this.groupCash());

    app.APIGetTime().then((time)=>{this.selectedMonth = Number(time.Month);this.currentMonth = Number(time.Month);/*placeholder*/;})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupdetailPage');
  }

  private groupDetail(){
    return  (this.group.getSelectedGroup() != selectedGroupEnun.NONE) ? this.group.getUsergroups()[this.group.getSelectedGroup()] : null;
  }
  private groupCashFlow(){
    return (this.group.getSelectedGroup() != selectedGroupEnun.NONE) ? this.group.groupsCashFlow[this.group.getSelectedGroup()] : null;
  }
  private groupCashIn(){
    let array =  (this.group.getSelectedGroup() != selectedGroupEnun.NONE) ? this.group.getGroupCash()[this.group.getSelectedGroup()].UserToGroup : null;
    array = array.filter((elem,index,array)=>{return (/*(elem .TCashType_OID == CashTypeEnum.ManualPayment) &&*/ (this.selectedMonth == Number(elem.DateTimeModel.Month))) })
    return array
  }
  private groupCashOut(){
    let array =  (this.group.getSelectedGroup() != selectedGroupEnun.NONE) ? this.group.getGroupCash()[this.group.getSelectedGroup()].GroupToUser : null;
    array = array.filter((elem,index,array)=>{return (/*(elem .TCashType_OID == CashTypeEnum.ManualPayment) &&*/ (this.selectedMonth == Number(elem.DateTimeModel.Month))) })
    return array
  }
  //Apenas dinheiro que entrou ou saiu, mas confirmado:
  private groupCash(){
    let array =  (this.group.getSelectedGroup() != selectedGroupEnun.NONE) ? this.group.getGroupCash()[this.group.getSelectedGroup()].All : null;
    array = array.filter((elem,index,array)=>{return ((elem .TFinancialTransactionStatusConcise == TFinancialTransactionStatusConciseEnum.ok) && (this.selectedMonth == Number(elem.DateTimeModel.Month))) })
    return array
  }

  private getUserList(){
    return this.groupmembers;
    
  }

  private dismiss() {
    this.viewCtrl.dismiss();
  }

  

  private requestTransfer(db_valor,db_banco,db_banco_outros,db_tipoconta,db_numeroconta,db_agencia,db_nometitular,db_cpftitular,db_descricao){

    if(!FieldsValidation.textIsValid(db_banco,1,100)){this.alert.showOk("Aviso!","Escolha um banco.","ok",()=>{;});return}
    if(!FieldsValidation.textIsValid(db_tipoconta,1,100)){this.alert.showOk("Aviso!","Escolha um tipo de conta.","ok",()=>{;});return}
    if(!FieldsValidation.textIsValid(db_agencia,1,100)){this.alert.showOk("Aviso!","Escolha uma agencia.","ok",()=>{;});return}
    if(!FieldsValidation.textIsValid(db_numeroconta,1,100)){this.alert.showOk("Aviso!","Defina o número da conta.","ok",()=>{;});return}
    if(!FieldsValidation.textIsValid(db_nometitular,1,100)){this.alert.showOk("Aviso!","Defina o nome do titular.","ok",()=>{;});return}
    if(!FieldsValidation.CPFIsValid(db_cpftitular)){this.alert.showOk("Aviso!","CPF inválido.<br>O número do CPF deve conter 11 caracteres numericos.","ok",()=>{;});return}
    if(!FieldsValidation.textIsValid(db_descricao,1,100)){this.alert.showOk("Aviso!","Faça uma breve descrição.","ok",()=>{;});return}

    if(!FieldsValidation.numberIsValid(db_valor,5,1000)){this.alert.showOk("Aviso!","Preencha um valor válido para o resgate. Valores entre 5 até 1000 reais.","ok",()=>{;});return}


    if(db_banco_outros == "" || db_banco_outros == undefined){db_banco_outros="Nenhum"}
    if(db_descricao == "" || db_descricao == undefined){db_descricao="Nenhuma"}

    let msg: string =
    "Usuário logado: "        + "<b>"+this.user.getUser().Email+"</b> <br> <br>" +
    "Valor para resgate: "    + "<b>"+db_valor+"</b> <br>" +
    "Dados bancarios: "       + "<br>" +
    "Banco: "                 + "<b>"+db_banco+"</b> <br>" +
    "Outro Banco: "           + "<b>"+db_banco_outros+"</b> <br>" +
    "Tipo Conta: "            + "<b>"+db_tipoconta+"</b> <br>" +
    "Numero da Conta: "       + "<b>"+db_numeroconta+"</b> <br>" +
    "Agencia: "               + "<b>"+db_agencia+"</b> <br>" +
    "Nome Titular: "          + "<b>"+db_nometitular+"</b> <br>" +
    "CPF Titular: "           + "<b>"+db_cpftitular+"</b> <br>" +
    "Descrição: "             + "<b>"+db_descricao+"</b> <br>";

    let parm:{title: string,content: string} = {title: "Solicitação de Transferencia",content: msg};

    this.api.UtilSendEmail(parm);

    this.alert.showOk("Solicitação enviada","Em algumas horas sua solicitação será processada.","Ok",()=>{});
  }

  
  private getCashIn(){
    if(this.groupCashIn() != null && this.groupCashIn() != undefined){
      return this.groupCashIn()
    }
    else{
      return []
    }
  }

  //----------------------------
  private manualCash(){
    let array = this.groupCash().filter((elem,index,array)=>{return ((elem .TCashType_OID == CashTypeEnum.ManualPayment) && (this.selectedMonth == Number(elem.DateTimeModel.Month))) })
    console.log("Manual: ",array)
    return array
  }
  private manualPay_pageID: string = "1";
  private addCashFlow(userOID:number,groupOID:number,value:number,desc:string,cashflowtype:number){
    this.group.createManualCashFlow(userOID,groupOID,value,desc,cashflowtype).then(()=>{this.alert.showOk("Atenção","Entrada criada com sucesso!","Ok",()=>{this.group.getUserGroupsAndCashFlow(); this.manualPay_pageID = "1"; }); }).catch(()=>{this.alert.showOk("Atenção","Erro na adição do registro!","Ok",()=>{});})
  }
  private deleteCashFlow(CashOID: number){
    this.group.deleteManualCashFlow(CashOID).then(()=>{this.alert.showOk("Atenção","Entrada apagada com sucesso!","Ok",()=>{this.group.getUserGroupsAndCashFlow(); this.manualPay_pageID = "1"; }); }).catch(()=>{this.alert.showOk("Atenção","Erro ao apagar do registro!","Ok",()=>{});})
  }
  private editCashFlow(CashOID: number, value: number, desc: string, status: number ){
    this.group.updateManualCashFlow(CashOID,value,desc,status).then(()=>{this.alert.showOk("Atenção","Entrada alterada com sucesso!","Ok",()=>{this.group.getUserGroupsAndCashFlow(); this.manualPay_pageID = "1"; }); }).catch(()=>{this.alert.showOk("Atenção","Erro ao editar o registro!","Ok",()=>{});})
  }
  private changeStatusCashFlow(CashOID: number, value: number, desc: string, status: number ){
    let _status: number = 0;
    if(status<0){_status=20}else if(status > 0 && status < 1000){_status=1000}else{_status=-10}
    this.group.updateManualCashFlow(CashOID,value,desc,_status).then(()=>{this.alert.showOk("Atenção","Entrada alterada com sucesso!","Ok",()=>{this.group.getUserGroupsAndCashFlow(); this.manualPay_pageID = "1"; }); }).catch(()=>{this.alert.showOk("Atenção","Erro ao editar o registro!","Ok",()=>{});})
  }
  //----------------------------

  private copy() {
    //https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
    var copyText: any = document.getElementById("myInput");
    copyText.select();
    document.execCommand("copy");
    //alert("Copied the text: " + copyText.value);
    this.alert.showToast("Link copiado","botton",2000)
  }

  private returnTotal(): string{
    return FormatNumber.toDecimal(this.groupCashFlow().TotalPayment.Total, 2)
  }
  private returnInput(): string{
    return FormatNumber.toDecimal(this.groupCashFlow().TotalPayment.Input, 2)
  }
  private returnOutput(): string{
    return FormatNumber.toDecimal(this.groupCashFlow().TotalPayment.Output, 2)
  }
  private returnTotalAvailableForWithdrawal(): string{
    return FormatNumber.toDecimal(this.groupCashFlow().PlataformPayment.Total, 2)
  }



  private returnTax(): string{
    return FormatNumber.toDecimal(Number(this.groupDetail().Fee) * Number(this.groupDetail().Value)/100, 2)
  }
  private returnValueToPay(): string{
    return FormatNumber.toDecimal((Number(this.groupDetail().Value) + Number(this.groupDetail().Fee) * Number(this.groupDetail().Value)/100), 2)
  }


  public card: CreditCardPaymentModel = {cc_ccv:"",cc_month:"",cc_name:"",cc_number:"",cc_year:"",cch_address_number:"",cch_cpf:"",cch_email:"",cch_name:"",cch_phone:"",cch_postalcode:""};
  public PayTodayAndSubscribeNextMonthWithCC(){
    if(!FieldsValidation.CreditCardCCVIsValid(this.card.cc_ccv)){this.alert.showOk("Aviso!","Preencha o campo 'Cartão de credito - CCV' corretamente.","ok",()=>{;});return}
    if(!FieldsValidation.CreditCardNumberIsValid(this.card.cc_number)){this.alert.showOk("Aviso!","Preencha o campo 'Cartão de credito - Número' corretamente.","ok",()=>{;});return}
    if(!FieldsValidation.textIsValid(this.card.cc_month,1,100)){this.alert.showOk("Aviso!","Preencha o campo 'Cartão de credito - Mês' corretamente.","ok",()=>{;});return}
    if(!FieldsValidation.textIsValid(this.card.cc_year,1,100)){this.alert.showOk("Aviso!","Preencha o campo 'Cartão de credito - Ano' corretamente.","ok",()=>{;});return}
    if(!FieldsValidation.textIsValid(this.card.cc_name,1,100)){this.alert.showOk("Aviso!","Preencha o campo 'Cartão de credito - Nome' corretamente.","ok",()=>{;});return}
    if(!FieldsValidation.textIsValid(this.card.cch_address_number,1,100)){this.alert.showOk("Aviso!","Preencha o campo 'Proprietário cartão - Número Endereço' corretamente.","ok",()=>{;});return}
    if(!FieldsValidation.CEPIsValid(this.card.cch_postalcode)){this.alert.showOk("Aviso!","Preencha o campo 'Proprietário cartão - CEP' corretamente.","ok",()=>{;});return}
    if(!FieldsValidation.CPFIsValid(this.card.cch_cpf)){this.alert.showOk("Aviso!","Preencha o campo 'Proprietário cartão - CPF' corretamente.","ok",()=>{;});return}
    if(!FieldsValidation.emailIsValid(this.card.cch_email)){this.alert.showOk("Aviso!","Preencha o campo 'Proprietário cartão - Email' corretamente.","ok",()=>{;});return}
    if(!FieldsValidation.textIsValid(this.card.cch_name,1,100)){this.alert.showOk("Aviso!","Preencha o campo 'Proprietário cartão - Nome' corretamente.","ok",()=>{;});return}
    if(!FieldsValidation.phoneIsValid(this.card.cch_phone)){this.alert.showOk("Aviso!","Preencha o campo 'Proprietário cartão - Telefone' corretamente.","ok",()=>{;});return}


    this.alert.showOkCancel("Atenção","Deseja mesmo realizar a inscrição no grupo?","Sim","Cancelar",()=>{
      let cc: CreditCardPaymentModel = {cc_ccv:this.card.cc_ccv, cc_month:this.card.cc_month, cc_name:this.card.cc_name, cc_number:this.card.cc_number, cc_year:this.card.cc_year, cch_address_number:this.card.cch_address_number, cch_cpf:this.card.cch_cpf, cch_email:this.card.cch_email, cch_name:this.card.cch_name, cch_phone:this.card.cch_phone, cch_postalcode:this.card.cch_postalcode};
      this.payment.PayTodayAndSubscribeNextMonthWithCC(this.groupIndex,cc).then((data)=>{this.alert.showOk("Atenção","Incrição realizada com sucesso.","Ok",()=>{});}).catch((data)=>{this.alert.showOk("Atenção","Problemas para realizar sua incrição. Revise os dados do cartão e tente novamente.","Ok",()=>{});});
    },()=>{})
    
  }

  private st_showpayment: boolean = false;
  public showpayment(){
    this.st_showpayment = !this.st_showpayment;
  }

  //Seleção do mes --->
  private currentMonth: number = 1;
  private selectedMonth: number = 1;
  private addAndSubMonth(add: boolean){
    this.selectedMonth = Number(this.selectedMonth);
    if(add == true){
      this.selectedMonth = (this.selectedMonth < 12)?  this.selectedMonth + 1 : 1;
    }else{
      this.selectedMonth = (this.selectedMonth > 1)?  this.selectedMonth - 1 : 12;
    }
    this.selectedMonth = Number(this.selectedMonth);
    console.log(this.selectedMonth);
  }
  //Seleção do mes <---

  //Barra de navegação TAB --->
  private tabObject: TabInterfaceModel = {Selected:"Nenhum",TabList:[{Name:"GroupoverviewPage",Page:GroupoverviewPage,Icon:"home",Text:"Home"},{Name:"GrouplistPage",Page:GrouplistPage,Icon:"list",Text:"Grupos"},{Name:"ContactPage",Page:ContactPage,Icon:"person",Text:"Conta"},{Name:"AboutPage",Page:AboutPage,Icon:"help",Text:"Ajuda"}]};
  private tabClick(tab: any){
    console.log("Tab is: ",tab);
  }
  //Barra de navegação TAB --->

}
