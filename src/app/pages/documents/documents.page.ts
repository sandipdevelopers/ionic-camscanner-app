import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImagePickerOptions } from '@awesome-cordova-plugins/image-picker';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import {
  ActionSheetController,
  ModalController,
  LoadingController,
} from '@ionic/angular';
import { DocumentScanner, ResponseType } from 'capacitor-document-scanner';
import { CropImageComponent } from 'src/app/components/crop-image/crop-image.component';
import { SaveFileModalComponent } from 'src/app/components/save-file-modal/save-file-modal.component';
import { CommonService } from 'src/app/services/common.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

const pdf = pdfMake;
pdf.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-documents',
  templateUrl: './documents.page.html',
  styleUrls: ['./documents.page.scss'],
})
export class DocumentsPage implements OnInit {
  savLoader: any;
  nameformat = /[`!#$%^&*()+\=\[\]{};':"\\|,<>\/?~]/;
  printSize: any = 'A3';
  constructor(
    public service: CommonService,
    public modalCtrl: ModalController,
    private actionCtrl: ActionSheetController,
    public loader: LoadingController,
    private picker: ImagePicker,
    private router: Router
  ) { }
  ngOnInit() { }

  async replaceImage(index: any) {
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
                  this.service.uploadedDocument[index] =
                    'data:image/jpeg;base64,' + images.scannedImages[0];
                }
              })
              .catch((error: any) => { });
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
                this.service.uploadedDocument[index] =
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
    if (!this.service.uploadedDocument.length) {
      return;
    }
    let digit = await this.service.generateRandom5Digit();
    let defaultFile = `Document-${digit}`;
    const modal = await this.modalCtrl.create({
      component: SaveFileModalComponent,
      backdropDismiss: false,
      breakpoints: [1],
      initialBreakpoint: 1,
      cssClass: 'save-file-modal',
      componentProps: {
        defaultFolder: 'Documents',
        defaultFile: defaultFile,
      },
    });

    modal.onDidDismiss().then((result: any) => {
      if (result.data) {
        if (!this.service.uploadedDocument.length) {
          return;
        }
        this.showLoader().then(async () => {
          let filePath = `cs_scanner/${result.data.folder}/${result.data.filename}.pdf`;
          let data = [];
          let i;
          let fit = [830, 1150];

          for (i in this.service.uploadedDocument) {
            if (i == '0') {
              data.push({
                image: this.service.uploadedDocument[i],
                fit: fit,
                alignment: 'center',
              });
            } else {
              data.push({
                image: this.service.uploadedDocument[i],
                fit: fit,
                alignment: 'center',
                headlineLevel: 1
              });
            }
          }

          let docDefinition: any = {
            pageSize: this.printSize,
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
              }).then(async (filess: any) => {
                this.service.showToastr('Save Successfully.');
                this.service.uploadedDocument = [];
                this.savLoader.dismiss();
                this.goToMyDocument(result.data.folder);
              }).catch((error: any) => {
                this.service.uploadedDocument = [];
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

  async saveAsImage() {
    if (!this.service.uploadedDocument.length) {
      return;
    }

    let digit = await this.service.generateRandom5Digit();
    let defaultFile = `Image-${digit}`;
    const modal = await this.modalCtrl.create({
      component: SaveFileModalComponent,
      backdropDismiss: false,
      breakpoints: [1],
      initialBreakpoint: 1,
      cssClass: 'save-file-modal',
      componentProps: {
        defaultFolder: 'Documents',
        defaultFile: defaultFile,
      },
    });

    modal.onDidDismiss().then(async (result: any) => {
      if (result.data) {
        if (!this.service.uploadedDocument.length) {
          return;
        }

        this.showLoader().then(() => {
          let count = 0;
          const saveImg = async () => {
            try {
              if (count < this.service.uploadedDocument.length) {
                let tt = count + 1;
                let filePath = `cs_scanner/${result.data.folder}/${result.data.filename +'-' + tt}.jpg`;

                await Filesystem.writeFile({
                  path: filePath,
                  data: this.service.uploadedDocument[count],
                  directory: Directory.Data,
                });

                count++;
                saveImg();
              } else {
                this.service.showToastr('Save Successfully.');
               this.service.uploadedDocument = [];
                this.savLoader.dismiss(); 
                this.goToMyDocument(result.data.folder);
              }
            } catch (error) {
              console.error('Error saving file:', error);
              this.service.showToastr('An error occurred while saving the document.');
              this.savLoader.dismiss();
            }
          };

          saveImg();
        });
      }
    });
    return await modal.present();
  }

  swipeImagePrev(index: any) {
    if (index <= 0 || index >= this.service.uploadedDocument.length) {
      return;
    }
    const item = this.service.uploadedDocument[index];

    this.service.uploadedDocument.splice(index, 1);

    this.service.uploadedDocument.splice(index - 1, 0, item);
  }
  swipeImageNext(index: any) {
    if (index < 0 || index >= this.service.uploadedDocument.length - 1) {
      return;
    }

    const item = this.service.uploadedDocument[index];

    this.service.uploadedDocument.splice(index, 1);

    this.service.uploadedDocument.splice(index + 1, 0, item);
  }

  
  async cropImage(index: any) {
    const modal = await this.modalCtrl.create({
      component: CropImageComponent,
      componentProps: {
        imageSrc: this.service.uploadedDocument[index],
      },
    });

    modal.onDidDismiss().then((result: any) => {
      if (result.data) {
        this.service.uploadedDocument[index] = result.data;
      }
    });

    return await modal.present();
  }

  deleteImages(index: any) {
    this.service.uploadedDocument.splice(index, 1);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionCtrl.create({
      header: 'Upload Image',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera-outline',
          handler: () => {
            this.uploadFromCamera();
          },
        },
        {
          text: 'Gallery',
          icon: 'image-outline',
          handler: () => {
            this.uploadFromGallery();
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

  async uploadFromCamera() {
    const permission: any = await this.service.camaraCheckPermission();

    if (!permission.status) {
      console.log(permission.error);
      return;
    }
    await DocumentScanner.scanDocument({
      croppedImageQuality: 80,
      letUserAdjustCrop: true,
      responseType: ResponseType.Base64,
    })
      .then((images: any) => {
        for (let i in images.scannedImages) {
          this.service.uploadedDocument.push(
            'data:image/jpeg;base64,' + images.scannedImages[i]
          );
        }
      })
      .catch((error: any) => {
        this.service.showToastr('Something went wrong.')
      });
  }

  async uploadFromGallery() {
    const options: ImagePickerOptions = {
      quality: 100,
      outputType: 1,
      maximumImagesCount: 50 - this.service.uploadedDocument.length,
    };

    this.picker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.service.uploadedDocument.push(
          'data:image/jpeg;base64,' + results[i]
        );
      }
    }).catch((error: any) => {
      this.service.showToastr('Something went wrong.')
    });
  }

  async uploadImages() {
    await this.presentActionSheet();
  }

  async showLoader() {
    this.savLoader = await this.loader.create({
      message: 'Please Wait...',
      showBackdrop: true,
    });
    await this.savLoader.present();
  }

  async goToMyDocument(folderName: any) {

    const queryParams = {
      folderName: folderName,
    };
    this.router.navigate(['/listing-doc'], { queryParams });
  }

  ionViewDidLeave() {
    this.service.uploadedDocument = [];
    if(this.savLoader) {
      this.savLoader.dismiss();
    }
  }
}
