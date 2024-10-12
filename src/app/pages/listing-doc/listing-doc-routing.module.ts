import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListingDocPage } from './listing-doc.page';

const routes: Routes = [
  {
    path: '',
    component: ListingDocPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListingDocPageRoutingModule {}
