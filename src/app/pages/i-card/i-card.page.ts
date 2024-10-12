import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImagePicker, ImagePickerOptions } from '@awesome-cordova-plugins/image-picker/ngx';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { DocumentScanner, ResponseType } from 'capacitor-document-scanner';
import { SaveFileModalComponent } from 'src/app/components/save-file-modal/save-file-modal.component';
import { CommonService } from 'src/app/services/common.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

const pdf = pdfMake;
pdf.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-i-card',
  templateUrl: './i-card.page.html',
  styleUrls: ['./i-card.page.scss'],
})
export class ICardPage implements OnInit {

  document: any = {
    front: '',
    back: '',
  }
  savLoader: any
  constructor(
    public router: Router,
    public service: CommonService,
    public actionCtrl: ActionSheetController,
    public loader: LoadingController,
    public picker: ImagePicker,
    public modalCtrl: ModalController,

  ) { }

  ngOnInit() {

  }

  async goToMyDocument(folderName: any) {
    const queryParams = {
      folderName: folderName,
    };
    this.router.navigate(['/listing-doc'], { queryParams });
  }

  async showLoader() {
    this.savLoader = await this.loader.create({
      message: 'please wait...',
      showBackdrop: true,
    });
    await this.savLoader.present();
  }

  async uploadImage(key: 'front' | 'back') {
    const actionSheet = await this.actionCtrl.create({
      header: 'Upload Image',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera-outline',
          handler: async () => {
            const permission: any = await this.service.camaraCheckPermission();

            if (!permission.status) {
              console.log(permission.error);
              return;
            }

            await DocumentScanner.scanDocument({
              croppedImageQuality: 80,
              letUserAdjustCrop: true,
              maxNumDocuments: 1,
              responseType: ResponseType.Base64,
            })
              .then((images: any) => {
                if (images.scannedImages && images.scannedImages.length) {
                  this.document[key] =
                    'data:image/jpeg;base64,' + images.scannedImages[0];
                }
              })
              .catch((error: any) => {

              });
          },
        },
        {
          text: 'Gallery',
          icon: 'image-outline',
          handler: () => {
            const options: ImagePickerOptions = {
              quality: 100,
              outputType: 1,
              maximumImagesCount: 1,
            };

            this.picker.getPictures(options).then((results) => {
              if (results && results.length) {
                this.document[key] =
                  'data:image/jpeg;base64,' + results[0];
              }
            });
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async saveAsPDF() {

    if (!this.document.front) {
      this.service.showToastr('Please upload the front side of your ID card.');
      return;
    }

    if (!this.document.back) {
      this.service.showToastr('Please upload the back side of your ID card.');
      return;
    }

    let digit = await this.service.generateRandom5Digit();
    let defaultFile = `IDCard-${digit}`;

    const modal = await this.modalCtrl.create({
      component: SaveFileModalComponent,
      backdropDismiss: false,
      breakpoints: [1],
      initialBreakpoint: 1,
      cssClass: 'save-file-modal',
      componentProps: {
        defaultFolder: 'IDcard',
        defaultFile: defaultFile,
      },
    });

    modal.onDidDismiss().then((result: any) => {
      if (result.data) {
        this.showLoader().then(async () => {
          let filePath = `cs_scanner/${result.data.folder}/${result.data.filename}.pdf`;
          const data = [{
            image: this.document['front'],
            fit: [220, 220],
            alignment: 'center',
          }, {
            image: this.document['back'],
            fit: [220, 220],
            margin: [0, 30, 0, 0],
            alignment: 'center',
          }];

          let docDefinition: any = {
            pageSize: 'A4',
            pageMargins: [40, 20, 40, 20],
            compress: true,
            content: data,
            pageBreakBefore: (cr: any, followingNOP: any) => {
              return cr.headlineLevel === 1 && followingNOP.length === 0;
            },
            styles: {
              story: {
                alignment: 'center',
              }
            }
          };

          let pdfNoData = pdfMake.createPdf(docDefinition);

          try {
            pdfNoData.getBase64(async (base64: any) => {
              console.log("base64 ::::::::::", base64);
              let pdf_base64 = 'data:application/pdf;base64,' + base64;

              await Filesystem.writeFile({
                path: filePath,
                data: pdf_base64,
                directory: Directory.Data,
              }).then((filess: any) => {
                this.service.showToastr('Save Successfully.');
                this.savLoader.dismiss();
                this.document = {
                  front: '',
                  back: '',
                }
                this.goToMyDocument(result.data.folder);
              }).catch((error: any) => {
                this.document = {
                  front: '',
                  back: '',
                }
                this.savLoader.dismiss();
                this.service.showToastr('Something went wrong.')
              });
            });
          } catch (err) {
            this.service.showToastr('Something went wrong.')
          }

        });
      }
    });

    return await modal.present();

  }
  ionViewDidLeave() {
    this.document = {
      front: '',
      back: '',
    }
    if(this.savLoader) {
      this.savLoader.dismiss();
    }
  }
}
