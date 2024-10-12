import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ICardPageRoutingModule } from './i-card-routing.module';

import { ICardPage } from './i-card.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    ICardPageRoutingModule
  ],
  declarations: [ICardPage]
})
export class ICardPageModule {}
