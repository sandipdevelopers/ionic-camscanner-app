import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { initalGuard } from './guards/inital.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'signature',
    loadChildren: () => import('./pages/signature/signature.module').then(m => m.SignaturePageModule)
  },
  {
    path: 'qrcode',
    loadChildren: () => import('./pages/qrcode/qrcode.module').then(m => m.QRCodePageModule)
  },
  {
    path: 'ocr',
    loadChildren: () => import('./pages/ocr/ocr.module').then(m => m.OCRPageModule)
  },
  {
    path: 'documents',
    loadChildren: () => import('./pages/documents/documents.module').then(m => m.DocumentsPageModule)
  },
  {
    path: 'i-card',
    loadChildren: () => import('./pages/i-card/i-card.module').then(m => m.ICardPageModule)
  },
  {
    path: 'listing-doc',
    loadChildren: () => import('./pages/listing-doc/listing-doc.module').then(m => m.ListingDocPageModule)
  },
  {
    path: 'image-to-pdf',
    loadChildren: () => import('./pages/image-to-pdf/image-to-pdf.module').then(m => m.ImageToPdfPageModule)
  },
  {
    path: 'tools',
    loadChildren: () => import('./pages/tools/tools.module').then(m => m.ToolsPageModule)
  },
  {
    path: 'initial-slider',
    canActivate:[initalGuard],
    loadChildren: () => import('./pages/initial-slider/initial-slider.module').then(m => m.InitialSliderPageModule)
  },
  {
    path: '',
    redirectTo: 'initial-slider',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
