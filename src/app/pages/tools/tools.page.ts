import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { AlertController } from '@ionic/angular';
import { Clipboard } from '@capacitor/clipboard';
@Component({
  selector: 'app-tools',
  templateUrl: './tools.page.html',
  styleUrls: ['./tools.page.scss'],
})
export class ToolsPage implements OnInit {

  constructor(
    public service: CommonService,
    public router: Router,
    private barcode: BarcodeScanner,
    public alert: AlertController
  ) { }

  ngOnInit() {
  }

  async goToDocument() {
    this.router.navigate(['documents']);
  }

  async goToImageToPDF() {
    this.router.navigate(['image-to-pdf']);
  }

  async goToMyDocument(folderName:any) {
    const queryParams = {
      folderName: folderName,
    };
    this.router.navigate(['/listing-doc'], { queryParams });
  }

  async goToIDCard() {
    this.router.navigate(['i-card']);
  }



  async goToCreateQR() {
    this.router.navigate(['qrcode']);
  }



  async goToSignature() {
    this.router.navigate(['signature']);
  }  
  async goToOCR() {
    this.router.navigate(['ocr']);
  }

  scanBarcode() {
    this.barcode.scan({
      prompt: '',
      showTorchButton: true,
      showFlipCameraButton: true
    }).then(async (resp: any) => {
      if(resp['text']) {
        this.showScanResult(resp);
      } else {
          this.service.showToastr('Scan result not found. Please try again.')
      }
    })
  }

  scanQrCode() {
    this.barcode.scan({
      prompt: '',
      showTorchButton: true,
      showFlipCameraButton: true
    }).then(async (resp: any) => {
      if(resp['text']) {
        this.showScanResult(resp);
      } else {
          this.service.showToastr('Scan result not found. Please try again.')
      }
    })
  }


  async showScanResult(scanData: any) {
    const alert = await this.alert.create({
      header: 'Scan Result',
      message: JSON.stringify(scanData['text']),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Copy',
          handler: async () => {
            await Clipboard.write({
              string: scanData['text'] || 'No Result'
            });

          }
        }
      ]
    });

    await alert.present();
  }
}
