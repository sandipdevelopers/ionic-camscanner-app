import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CropImageComponent } from 'src/app/components/crop-image/crop-image.component';
import { SaveFileModalComponent } from 'src/app/components/save-file-modal/save-file-modal.component';
import { LottieAnimationComponent } from 'src/app/components/lottie-animation/lottie-animation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations:[CropImageComponent,SaveFileModalComponent,LottieAnimationComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  exports:[CommonModule,IonicModule,CropImageComponent,SaveFileModalComponent,LottieAnimationComponent,FormsModule,
    ReactiveFormsModule,],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
