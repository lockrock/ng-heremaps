import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';



import { AppComponent } from './app.component';
import { CONFIG } from './here-maps.conf';
import { NgHeremapsModule, } from 'ng-heremaps';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgHeremapsModule
  ],
  providers: [
    { provide: 'HereMapsConfig', useValue: CONFIG },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
