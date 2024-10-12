import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.component.html',
  styleUrls: ['./crop-image.component.scss'],
})
export class CropImageComponent  {
  @Input() imageSrc: string = '';

  cropper: any;

  constructor(
    private modalController: ModalController,
    private alertCtrl: AlertController
    
  ) { 
    setTimeout(()=> {
      let cropObj = (<any>document).getElementById('crop-image');
      this.cropper = new Cropper(cropObj)
    }, 500);

  }


  async saveCrop() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Are you sure you want to save croped image?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            
          }
        }, {
          text: 'Yes',
          handler: () => {
            const canvas = this.cropper.getCroppedCanvas();
            const croppedImage = canvas.toDataURL('image/png');
            this.modalController.dismiss(croppedImage);
          }
        }
      ]
    });

    await alert.present();
  }
}
