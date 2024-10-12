import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ToolsPageRoutingModule } from './tools-routing.module';
import { ToolsPage } from './tools.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    ToolsPageRoutingModule
  ],
  declarations: [ToolsPage]
})
export class ToolsPageModule {}
