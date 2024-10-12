import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { SaveFileModalComponent } from 'src/app/components/save-file-modal/save-file-modal.component';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QRCodePage implements OnInit {

  loadingIndicator: any;
  qrCodeValue: string = '';
  selectedQrType: string = '1';
  qrData: any = {
    "1": '',
    "2": '',
    "3": { name: '', org: '', email: '', phone: '', cell: '' },
    "4": '',
    "5": { phone: '', message: '' }
  };
  emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  ngOnInit(): void {

  }
  constructor(
    public modalCtrl: ModalController,
    public platform: Platform,
    private router: Router,
    public service: CommonService,
    public loadingCtrl: LoadingController,
  ) { }

  async showLoadingIndicator() {
    this.loadingIndicator = await this.loadingCtrl.create({
      cssClass: 'custom-loading-class',
      message: 'Generating QR Code...',
      showBackdrop: true,
    });
    await this.loadingIndicator.present();
  }
  async goToMyDocument(folderName: any) {
    const queryParams = {
      folderName: folderName,
    };
    this.router.navigate(['/listing-doc'], { queryParams });
  }
  onQrTypeChange() {
    this.qrCodeValue = '';
    this.qrData = {
      "1": '',
      "2": '',
      "3": { name: '', org: '', email: '', phone: '', cell: '' },
      "4": '',
      "5": { phone: '', message: '' }
    };
  }

  generateQrCode() {
    switch (this.selectedQrType) {
      case '1':
      case '2':
        this.qrCodeValue = this.qrData[this.selectedQrType];
        break;
      case '3':
        if (this.qrData[this.selectedQrType].name && this.qrData[this.selectedQrType].org && this.qrData[this.selectedQrType].phone && this.qrData[this.selectedQrType].cell && this.qrData[this.selectedQrType].email) {
          this.qrCodeValue = `BEGIN:VCARD\nVERSION:3.0\nN:${this.qrData[this.selectedQrType].name}\nORG:${this.qrData[this.selectedQrType].org}\nEMAIL;TYPE=INTERNET:${this.qrData[this.selectedQrType].email}\nTEL;TYPE=CELL:${this.qrData[this.selectedQrType].cell}\nTEL:${this.qrData[this.selectedQrType].phone}\nEND:VCARD`;
        }
        break;
      case '4':
        if (this.qrData[this.selectedQrType]) {
          this.qrCodeValue = `tel:${this.qrData[this.selectedQrType]}`;
        }
        break;
      case '5':
        if (this.qrData[this.selectedQrType].phone && this.qrData[this.selectedQrType].message) {
          this.qrCodeValue = `SMSTO:${this.qrData[this.selectedQrType].phone}:${this.qrData[this.selectedQrType].message}`;
        }
        break;
      default:
        this.service.showToastr("Please add QR code content.");
        break;
    }

  }

  async createQrImage() {
    try {
      const qrCanvas = document.querySelector("canvas");

      let qrImageDataUrl: string | undefined = '';
      if (qrCanvas) {
        qrImageDataUrl = qrCanvas.toDataURL("image/png");
      }

      if (!qrImageDataUrl) {
        this.service.showToastr("QR code not loaded.");
        return;
      }

      let digit = await this.service.generateRandom5Digit();
      let defaultFile = `QRCode-${digit}`;
      const modal = await this.modalCtrl.create({
        component: SaveFileModalComponent,
        backdropDismiss: false,
        breakpoints: [1],
        initialBreakpoint: 1,
        cssClass: 'save-file-modal',
        componentProps: {
          defaultFolder: 'QRCode',
          defaultFile: defaultFile
        },
      });

      modal.onDidDismiss().then(async (result: any) => {
        if (result.data) {
          let filePath = `cs_scanner/${result.data.folder}/${result.data.filename}.jpg`;
          this.showLoadingIndicator().then(async () => {
            await Filesystem.writeFile({
              path: filePath,
              data: qrImageDataUrl,
              directory: Directory.Data,
            }).then((filess: any) => {
              this.service.showToastr('Save Successfully.');
              this.qrCodeValue = '';
              this.qrData = {
                "1": '',
                "2": '',
                "3": { name: '', org: '', email: '', phone: '', cell: '' },
                "4": '',
                "5": { phone: '', message: '' }
              };
              this.loadingIndicator.dismiss();
              this.goToMyDocument(result.data.folder);
              
            }).catch((error: any) => {
              this.qrCodeValue = '';
              this.qrData = {
                "1": '',
                "2": '',
                "3": { name: '', org: '', email: '', phone: '', cell: '' },
                "4": '',
                "5": { phone: '', message: '' }
              };
              this.loadingIndicator.dismiss();
              this.service.showToastr('Something went wrong.')
            });
          });
        }
      });

      return await modal.present();

    } catch (error) {
      this.service.showToastr("QR code not loaded.");
    }
  }

  isFormValid(): boolean {
    switch (this.selectedQrType) {
      case '1':
      case '2':
        return this.qrData[this.selectedQrType].trim() !== '';
      case '3':
        return this.qrData[this.selectedQrType].name && this.qrData[this.selectedQrType].org &&
          this.qrData[this.selectedQrType].phone && this.qrData[this.selectedQrType].cell &&
          this.qrData[this.selectedQrType].email && this.emailPattern.test(this.qrData[this.selectedQrType].email);
      case '4':
        return this.qrData[this.selectedQrType].trim() !== '';
      case '5':
        return this.qrData[this.selectedQrType].phone && this.qrData[this.selectedQrType].message.trim() !== '';
      default:
        return false;
    }
  }
  ionViewDidLeave() {
    this.qrCodeValue = '';
    this.qrData = {
      "1": '',
      "2": '',
      "3": { name: '', org: '', email: '', phone: '', cell: '' },
      "4": '',
      "5": { phone: '', message: '' }
    };
    if (this.loadingIndicator) {
      this.loadingIndicator.dismiss();
    }
  }
}
