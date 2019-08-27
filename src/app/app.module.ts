import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { GrouplistPage } from '../pages/grouplist/grouplist';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { GroupdetailPage } from '../pages/groupdetail/groupdetail';
import { GroupoverviewPage } from '../pages/groupoverview/groupoverview';
import { UserregistrationPage } from '../pages/userregistration/userregistration';
import { BlankPage } from '../pages/blank/blank';
import { ConfirmaccountPage } from '../pages/confirmaccount/confirmaccount';
import { FirststepsPage } from '../pages/firststeps/firststeps';
import { RedefineuserpwdPage } from '../pages/redefineuserpwd/redefineuserpwd';
import { AddgroupPage } from '../pages/addgroup/addgroup';
import { GroupmembersPage } from '../pages/groupmembers/groupmembers';
import { MenuhomePage } from '../pages/menuhome/menuhome';
import { GroupinvitationsPage } from '../pages/groupinvitations/groupinvitations';
import { SubscriptionweblinkPage } from '../pages/subscriptionweblink/subscriptionweblink';

import { TabsComponent } from '../components/tabs/tabs';
import { TabMonthNavComponent } from '../components/tab-month-nav/tab-month-nav';
import { HeaderComponent } from '../components/header/header';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AlertProvider } from '../providers/alert/alert';
import { ApiProvider } from '../providers/api/api';
import { HttpModule, Http } from '@angular/http';
import { UserProvider } from '../providers/user/user';
import { ConfigProvider } from '../providers/config/config';
import { GroupProvider } from '../providers/group/group';
import { AppProvider } from '../providers/app/app';
import { PaymentProvider } from '../providers/payment/payment';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    GrouplistPage,
    TabsPage,
    LoginPage,
    GroupdetailPage,
    GroupoverviewPage,
    UserregistrationPage,
    BlankPage,
    ConfirmaccountPage,
    FirststepsPage,
    RedefineuserpwdPage,
    AddgroupPage,
    GroupmembersPage,
    MenuhomePage,
    GroupinvitationsPage,
    SubscriptionweblinkPage,
    TabsComponent,
    TabMonthNavComponent,
    HeaderComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    GrouplistPage,
    TabsPage,
    LoginPage,
    GroupdetailPage,
    GroupoverviewPage,
    UserregistrationPage,
    BlankPage,
    ConfirmaccountPage,
    FirststepsPage,
    RedefineuserpwdPage,
    AddgroupPage,
    GroupmembersPage,
    MenuhomePage,
    GroupinvitationsPage,
    SubscriptionweblinkPage,
    TabsComponent,
    TabMonthNavComponent,
    HeaderComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AlertProvider,
    ApiProvider,
    UserProvider,
    ConfigProvider,
    GroupProvider,
    AppProvider,
    PaymentProvider
  ]
})
export class AppModule {}
