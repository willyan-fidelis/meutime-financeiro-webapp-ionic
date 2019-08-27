import { Component } from '@angular/core';
import { ConfigProvider } from '../../providers/config/config';

@Component({
  selector: 'header',
  templateUrl: 'header.html'
})
export class HeaderComponent {

  text: string;

  constructor(public config: ConfigProvider) {
    console.log('Hello HeaderComponent Component');
    this.text = 'Hello World';
  }

}
