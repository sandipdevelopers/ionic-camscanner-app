import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImageToPdfPage } from './image-to-pdf.page';

const routes: Routes = [
  {
    path: '',
    component: ImageToPdfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImageToPdfPageRoutingModule {}
