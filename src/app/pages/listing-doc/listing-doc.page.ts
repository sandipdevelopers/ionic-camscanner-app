import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SavefileService } from 'src/app/services/savefile.service';
import { FileOpener } from '@capacitor-community/file-opener';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import {  Filesystem } from '@capacitor/filesystem';
import { CommonService } from 'src/app/services/common.service';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

@Component({
  selector: 'app-listing-doc',
  templateUrl: './listing-doc.page.html',
  styleUrls: ['./listing-doc.page.scss'],
})
export class ListingDocPage implements OnInit {
  folderName: any = '';
  document: any[] = []
  savLoader: any 
  isSpinner = true;
  constructor(
    private route: ActivatedRoute,
    public saveFile: SavefileService,
    public service: CommonService,
    public loader: LoadingController,
    public actionCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public socialSharing: SocialSharing,
  ) { }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.folderName = this.route.snapshot.queryParamMap.get('folderName');
    this.readFolder(this.folderName)
  }

  segmentChange() {
    this.readFolder(this.folderName)
  }
  readFolder(folderName: any) {
    this.showLoader().then(() => {
      this.isSpinner = true
      this.saveFile.readFolder(folderName).then((resp: any) => {
        this.document =[];
        if (resp.length) {
          this.document = resp
        }
        this.savLoader.dismiss();
        this.isSpinner = false
      }).catch((error: any) => {
        this.document =[];
        this.savLoader.dismiss();
        this.isSpinner = false
      })
    })

  }

  async showLoader() {
    this.savLoader = await this.loader.create({
      message: 'please wait...',
      showBackdrop: true,
    });
    await this.savLoader.present();
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
      this.socialSharing.share('Share Document',fileName,filePath,'')
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
                this.readFolder(this.folderName)
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
