import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { SignaturePageRoutingModule } from './signature-routing.module';

import { SignaturePage } from './signature.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    SignaturePageRoutingModule
  ],
  declarations: [SignaturePage]
})
export class SignaturePageModule {}
