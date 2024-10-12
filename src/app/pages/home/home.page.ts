import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';
import { SavefileService } from 'src/app/services/savefile.service';
import { DocumentScanner, ResponseType } from 'capacitor-document-scanner';
import {
  ImagePicker,
  ImagePickerOptions,
} from '@awesome-cordova-plugins/image-picker/ngx';
import { FileOpener } from '@capacitor-community/file-opener';
import { Filesystem } from '@capacitor/filesystem';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  recentFile: any[] = [];
  constructor(
    public service: CommonService,
    public router: Router,
    private alertCtrl: AlertController,
    private actionCtrl: ActionSheetController,
    private picker: ImagePicker,
    private loadingController: LoadingController,
    public saveFile: SavefileService,
    public socialSharing: SocialSharing,
  ) { }

  async ngOnInit() {
  }
  async  ionViewDidEnter() {
    setTimeout(async () => {
      await this.saveFile.loadRecentFile();
      
    }, 200);

  }
  shareUs() { }

  async goToTools() {
    try {
      this.router.navigate(['/tools']);
    } catch (error) { }
  }

  async goToDocument() {
    this.router.navigate(['documents']);
  }

  async goToMyDocument(folderName: any) {
    const queryParams = {
      folderName: folderName,
    };
    this.router.navigate(['/listing-doc'], { queryParams });
  }

  async presentCreateFolderAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Create New Folder',
      inputs: [
        {
          name: 'folderName',
          type: 'text',
          placeholder: 'Enter folder name',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Create folder cancelled');
          },
        },
        {
          text: 'Create',
          handler: async (data) => {
            const folderName = data.folderName.trim();
            if (folderName) {
              await this.createFolder(folderName, alert);
            } else {
              console.log('Folder name is required');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async createFolder(folderName: string, alert: HTMLIonAlertElement) {
    const loading = await this.loadingController.create({
      message: 'Creating folder...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      await this.saveFile.createUserFolder(folderName);
      console.log(`Folder '${folderName}' created successfully`);
    } catch (error) {
      console.error('Error creating folder:', error);
    } finally {
      await loading.dismiss();
      await alert.dismiss();
    }
  }

  onCreateFolderClick() {
    this.presentCreateFolderAlert();
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
      return; // Permission denied, exit the function
    }
    try {
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
          if (this.service.uploadedDocument.length) {
            this.goToDocument();
          }
        })
        .catch((error: any) => {
          console.log('error::', JSON.stringify(error));
        });
    } catch (error) {
      console.log('error::', JSON.stringify(error));
    }
  }

  async uploadFromGallery() {
    const permission: any = await this.service.camaraCheckPermission();

    if (!permission.status) {
      console.log(permission.error);
      return; // Permission denied, exit the function
    }
    try {
      const options: ImagePickerOptions = {
        quality: 100,
        outputType: 1,
        maximumImagesCount: 50 - this.service.uploadedDocument.length,
      };
      await this.picker.getPictures(options).then((results) => {
        console.log('results ::::::::::::::::::::', results);

        for (var i = 0; i < results.length; i++) {
          this.service.uploadedDocument.push(
            'data:image/jpeg;base64,' + results[i]
          );
        }

        if (this.service.uploadedDocument.length) {
          this.goToDocument();
        }
      });
    } catch (error) {
      console.log('error::', JSON.stringify(error));
    }
  }

  async uploadImages() {
    await this.presentActionSheet();
  }



  async fileAction(file: any) {
    const actionSheet = await this.actionCtrl.create({
      header: 'File Actions',
      buttons: [
        {
          text: 'View',
          icon: 'eye',
          handler: () => {
            this.viewFile(file.uri, this.getFileType(file.name));
          },
        },
        {
          text: 'Share',
          icon: 'share',
          handler: () => {
            this.shareFile(file.uri, file.name);
          },
        },
        {
          text: 'Delete',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            this.deleteFile(file.uri);
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

  getFileType(fileName: string): string {
    const extension = fileName.split('.').pop();
    let mimeType = '';
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      // Add more cases as needed
      default:
        mimeType = 'application/octet-stream'; // fallback for unknown types
    }
    return mimeType;
  }

  async viewFile(filePath: string, contentType: string) {
    try {
      await FileOpener.open({
        filePath,
        contentType,
        openWithDefault: true,
      });
    } catch (error) {
      this.service.showToastr('Something went wrong.')
      console.error('Error opening file', error);
    }
  }

  async shareFile(filePath: string, fileName: string) {
    try {
      console.log("filePath", filePath);

      this.socialSharing.share('Share Document', fileName, filePath, '')
    } catch (error) {
      this.service.showToastr('Something went wrong.')
      console.error('Error sharing file', error);
    }
  }

  async deleteFile(filePath: string) {


    const alert = await this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: `Are you sure you want to delete this file?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Deletion canceled');
          }
        }, {
          text: 'Delete',
          handler: async () => {
            try {
              await Filesystem.deleteFile({
                path: filePath,
              }).then(async (resp: any) => {
                this.service.showToastr('Deleted Successfully.');
                await this.saveFile.loadRecentFile();
              }).catch((error: any) => {
                this.service.showToastr('Something went wrong.')
                console.error('Error deleting file', JSON.stringify(error));
              });

            } catch (error) {
              console.error('Error deleting file', error);
            }
          }
        }
      ]
    });

    await alert.present();


  }
}
