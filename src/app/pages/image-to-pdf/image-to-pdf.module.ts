import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ImageToPdfPageRoutingModule } from './image-to-pdf-routing.module';

import { ImageToPdfPage } from './image-to-pdf.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    ImageToPdfPageRoutingModule
  ],
  declarations: [ImageToPdfPage]
})
export class ImageToPdfPageModule {}
