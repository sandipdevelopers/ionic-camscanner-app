import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { OCRPageRoutingModule } from './ocr-routing.module';

import { OCRPage } from './ocr.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    OCRPageRoutingModule
  ],
  declarations: [OCRPage]
})
export class OCRPageModule {}
