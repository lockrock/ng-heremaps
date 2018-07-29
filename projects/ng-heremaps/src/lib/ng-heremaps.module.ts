import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgHeremapsComponent } from './ng-heremaps.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [NgHeremapsComponent],
  exports: [NgHeremapsComponent],
  providers: [
    { provide: 'Document1', useValue: document }
  ],
  schemas: [
    
  ]
})
export class NgHeremapsModule { }
