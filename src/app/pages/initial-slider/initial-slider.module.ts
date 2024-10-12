import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { InitialSliderPageRoutingModule } from './initial-slider-routing.module';

import { InitialSliderPage } from './initial-slider.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    InitialSliderPageRoutingModule
  ],
  declarations: [InitialSliderPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class InitialSliderPageModule {}
