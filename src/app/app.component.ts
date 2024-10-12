import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SavefileService } from './services/savefile.service';
import { AlertController } from '@ionic/angular';
import { CommonService } from './services/common.service';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private networkStatusListener: any; // Use PluginListenerHandle
  private alert: HTMLIonAlertElement | null = null;

  constructor(
    private platform: Platform,
    public saveFile: SavefileService,
    public service: CommonService,
    private alertController: AlertController
  ) {

   
    this.platform.ready().then(async () => {

      try {
        const lottie = (window as any).lottie;
        if (lottie) {
          await lottie.splashscreen.hide();
          await lottie.splashscreen.show('public/assets/splash.json');
          setTimeout(async () => {
            await lottie.splashscreen.hide();
          }, 4000);
        }

        await this.saveFile.createDefaultFolder();
        await this.saveFile.readBaseDir();

      } catch (error) {
        console.error('An error occurred:', error);
      }
    });
  }

  async showNetworkAlert() {
    if (!this.alert) {
      this.alert = await this.alertController.create({
        header: 'Network Disconnected',
        message: 'Please check your internet connection.',
        backdropDismiss: false,
      });
      await this.alert.present();
    }
  }



  async hideNetworkAlert() {
    if (this.alert) {
      await this.alert.dismiss();
      this.alert = null;
    }
  }

  async checkForAppUpdate() {
    const updateAlert = await this.alertController.create({
      header: 'App Update Available',
      message: 'A new version of the app is available. Please update to the latest version.',
      buttons: [
        {
          text: 'Later',
          role: 'cancel',
        },
        {
          text: 'Update Now',
          handler: () => {
            this.service.rateApp();
          },
        },
      ],
    });
    await updateAlert.present();
  }

}
