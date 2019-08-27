//Static Class - String Utilities
//Classe com metodos/utilidades para manipulção de textos/strings.

export class StaticStringUtil{

  //Metodo que transforma uma string em DateTimeModel:
  static mysqlDateTimeUnSerialize(time: string): DateTimeModel{
    return {Year:time.substring(0, 4),Month:time.substring(5, 7),Day:time.substring(8, 10),Hour:time.substring(11, 13),Minute:time.substring(14, 16),Second:time.substring(17, 19),};
  }

  static mysqlDateTimeSerialize(time: DateTimeModel):string {
    return time.Year+"-"+time.Month+"-"+time.Day+" "+time.Hour+":"+time.Minute+":"+time.Second;  //'2019-01-22 21:22:22';
  }

}

export class FieldsValidation{
  
  static emailIsValid (email: string): boolean {
    return StringValidation.emailValidation_Type1(email);
  }

  static passwordIsValid (pwd: string): boolean {
    return StringValidation.alphanumericPlusHyphensPlusUnderscoreValidation(pwd) && StringValidation.lengthValidadtion(pwd,8,20);
  }
  static CPFIsValid (cpf: string): boolean {
    return StringValidation.numericValidation(cpf) && StringValidation.lengthValidadtion(cpf,11,11);
  }
  static CEPIsValid (number: string): boolean {
    return StringValidation.numericValidation(number) && StringValidation.lengthValidadtion(number,8,8);
  }
  static CreditCardNumberIsValid (number: string): boolean {
    return StringValidation.numericValidation(number) && StringValidation.lengthValidadtion(number,16,16);
  }
  static CreditCardCCVIsValid (number: string): boolean {
    return StringValidation.numericValidation(number) && StringValidation.lengthValidadtion(number,3,3);
  }
  static fullNameIsValid (name: string): boolean {
    return StringValidation.alphanumericValidationPlusSpace(name) && StringValidation.lengthValidadtion(name,5,45);
  }
  static phoneIsValid (phone: string): boolean {
    return StringValidation.alphanumericValidationPlusSpace(phone) && StringValidation.lengthValidadtion(phone,10,11);
  }
  static textIsValid (text: string, min: number, max: number): boolean {
    return StringValidation.lengthValidadtion(text,min,max);
  }
  static numberIsValid (value: number | string, min: number, max: number): boolean {
    return typeof Number(value) === 'number' && Number(value) !== NaN && value !== null && value !== undefined && (value>=min && value<=max);
  }
}

class StringValidation{

  static lengthValidadtion(text: string, min: number, max: number): boolean {
      if(text == null || text == undefined){return false}
    
      if(text.length >= min && text.length <= max) {
          return true;
      }

      return false;     
  }

  static alphanumericValidationPlusSpace(text: string):boolean {
      if(text == null || text == undefined){return false}

      //https://stackoverflow.com/questions/16667329/special-character-validation
      if( /[^a-zA-Z0-9 ]/.test(text) ) {
          return false;
      }
      return true;     
  }

  static numericValidation(text: string):boolean {
    if(text == null || text == undefined){return false}

    //https://stackoverflow.com/questions/16667329/special-character-validation
    if( /[^0-9]/.test(text) ) {
        return false;
    }
    return true;     
}

  static alphanumericPlusHyphensPlusUnderscoreValidation(text: string):boolean {
    if(text == null || text == undefined){return false}

      //https://stackoverflow.com/questions/16667329/special-character-validation
      if( /[^a-zA-Z0-9\-_]/.test( text ) ) {
          return false;
      }
      return true;     
  }

  static emailValidation_Type1 (email: string):boolean {
      if(email == null || email == undefined){return false}

      //https://tylermcginnis.com/validate-email-address-javascript/
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

}

export class StringFormat{
  static toPhone(text: string):string{

    if(text == null || text == undefined){return ""}

    let formateString: string = "";
    for (var i = 0; i < text.length; i++) {
      //alert(text.charAt(i));

      switch(true) {//https://stackoverflow.com/questions/2994135/javascript-switch-using-intervals
        case (i == 0):
          formateString = formateString + "(" + text.charAt(i);
          break;
        case (i == 1):
        formateString = formateString  + text.charAt(i) + ")";
          break;
        case (i >= 2 && i <= 10):
        formateString = formateString  + text.charAt(i);
          break;
        default:
          // code block
      }
    }
    return formateString;
  }

  static toCPF(text: string):string{

    if(text == null || text == undefined){return ""}

    let formateString: string = "";
    for (var i = 0; i < text.length; i++) {
      //alert(text.charAt(i));

      switch(true) {//https://stackoverflow.com/questions/2994135/javascript-switch-using-intervals
        case (i >= 0 && i <= 1):
          formateString = formateString + text.charAt(i);
          break;
        case (i == 2):
          formateString = formateString + text.charAt(i) + ".";
          break;
        case (i >= 3 && i <= 4):
          formateString = formateString + text.charAt(i);
          break;
        case (i == 5):
          formateString = formateString + text.charAt(i) + ".";
          break;
        case (i >= 6 && i <= 7):
          formateString = formateString + text.charAt(i);
          break;
        case (i == 8):
          formateString = formateString + text.charAt(i) + "-";
          break;
          case (i >= 9 && i <= 10):
          formateString = formateString + text.charAt(i);
        break;
        default:
          // code block
      }
    }
    return formateString;
  }
}

export class FormatNumber{
  static toDecimal(value: number, decimalPlaces: number): string{
    //https://stackoverflow.com/questions/6134039/format-number-to-always-show-2-decimal-places/6134070
    return parseFloat((Math.round(value * 100) / 100).toString()).toFixed(decimalPlaces);
  }
}

export interface DateTimeModel {
      Year: string,
      Month: string,
      Day: string,
      Hour: string,
      Minute: string,
      Second: string,
}
