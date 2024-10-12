import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InitialSliderPage } from './initial-slider.page';

const routes: Routes = [
  {
    path: '',
    component: InitialSliderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InitialSliderPageRoutingModule {}
