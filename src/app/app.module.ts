import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgHeremapsModule } from 'projects/ng-heremaps/src/public_api';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgHeremapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
