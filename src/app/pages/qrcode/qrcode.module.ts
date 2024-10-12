import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { QRCodePageRoutingModule } from './qrcode-routing.module';

import { QRCodePage } from './qrcode.page';
import { QrCodeModule } from 'ng-qrcode';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    QrCodeModule, 
    SharedModule,
   FormsModule,
    QRCodePageRoutingModule
  ],
  declarations: [QRCodePage]
})
export class QRCodePageModule {}
