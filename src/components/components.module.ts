import { NgModule } from '@angular/core';
import { TabsComponent } from './tabs/tabs';
import { TabMonthNavComponent } from './tab-month-nav/tab-month-nav';
import { HeaderComponent } from './header/header';
@NgModule({
	declarations: [TabsComponent,
    TabsComponent,
    TabsComponent,
    TabsComponent,
    TabMonthNavComponent,
    HeaderComponent],
	imports: [],
	exports: [TabsComponent,
    TabsComponent,
    TabsComponent,
    TabsComponent,
    TabMonthNavComponent,
    HeaderComponent]
})
export class ComponentsModule {}
