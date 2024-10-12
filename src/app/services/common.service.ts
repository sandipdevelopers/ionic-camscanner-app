import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Camera } from '@capacitor/camera';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { NativeMarket } from "@capacitor-community/native-market";


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  app_name = 'Document Scanner';
  uploadedDocument: any[] = []

  constructor(
    private router: Router,
    public picker: ImagePicker,
    public toastr: ToastController,
    private actionCtrl: ActionSheetController,
    private http: HttpClient,
  ) { }


  commonNavigation(url: string) {
    this.router.navigate([url])
  }
  async generateRandom5Digit() {
    return Math.floor(10000 + Math.random() * 90000);
  }

  formatFileSize(bytes: any) {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  getFileExtension(fileName: any) {
    if (fileName.includes('.')) {
      return fileName.split('.').pop().toLowerCase();
    } else {
      return ''; 
    }
  }
  async showToastr(message: any) {

    let toast = await this.toastr.create({
      message: message,
      color: 'dark',
      duration: 1500,
      animated: true,
      position: 'top'
    });

    await toast.present();
  }
  async camaraCheckPermission() {
    return new Promise(async (resolve, reject) => {
      try {
        // Check current permissions
        const permStatus = await Camera.checkPermissions();
        if (permStatus.camera === 'granted' && permStatus.photos === 'granted') {
          resolve({ status: true });
        } else {
          // Request permissions if not already granted
          const permRequest = await Camera.requestPermissions();
          if (permRequest.camera === 'granted' && permRequest.photos === 'granted') {
            resolve({ status: true });
          } else {
            resolve({ status: false, error: 'Permission denied: Camera or Photos' });
          }
        }
      } catch (error) {
        // Handle any errors during the permission check/request process
        resolve({ status: false, error: 'Failed to check or request permissions for Camera or Photos' });
      }
    });
  }


  convertBase64ToBlob(base64: any) {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }


  rateApp() {
    NativeMarket.openStoreListing({
      appId: '12121212121212',
    });
  }



  isFristTimeApp(): boolean {
    let isFristTime = localStorage.getItem('isFristTime')
    return isFristTime ? true : false
  }
}
