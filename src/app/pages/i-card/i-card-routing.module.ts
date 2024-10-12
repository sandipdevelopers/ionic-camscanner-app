import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ICardPage } from './i-card.page';

const routes: Routes = [
  {
    path: '',
    component: ICardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ICardPageRoutingModule {}
