import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ListingDocPageRoutingModule } from './listing-doc-routing.module';

import { ListingDocPage } from './listing-doc.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    ListingDocPageRoutingModule
  ],
  declarations: [ListingDocPage]
})
export class ListingDocPageModule {}
