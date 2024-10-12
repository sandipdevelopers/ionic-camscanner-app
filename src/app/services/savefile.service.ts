import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { CommonService } from './common.service';
import { Capacitor } from '@capacitor/core';


@Injectable({
  providedIn: 'root',
})
export class SavefileService {
  allFolder: any = [];
  recentFile: any = [];
  constructor(
    public alertController: AlertController,
    private modalCtrl: ModalController,
    private actionCtrl: ActionSheetController,
    public service: CommonService,
  ) { }

  async checkPermission() {

    return new Promise(async (resolve, reject) => {
      try {
        const permStatus = await Filesystem.checkPermissions();
        if (permStatus.publicStorage === 'granted') {
          resolve({ status: true });
        } else {
          const permRequest = await Filesystem.requestPermissions();
          if (permRequest.publicStorage === 'granted') {
            resolve({ status: true });
          } else {
            resolve({ status: false, error: 'Permission denied' });
          }
        }
      } catch (error) {
        resolve({
          status: false,
          error: 'Failed to check or request permissions',
        });
      }
    });
  }

  async createDefaultFolder() {
    try {
      const permissionResp: any = await this.checkPermission();

      if (permissionResp.status) {
        try {
          await Filesystem.mkdir({
            path: 'cs_scanner',
            directory: Directory.Data,
            recursive: true,
          });

          await Filesystem.mkdir({
            path: 'cs_scanner/Documents',
            directory: Directory.Data,
            recursive: true,
          });


          await Filesystem.mkdir({
            path: 'cs_scanner/IDcard',
            directory: Directory.Data,
            recursive: true,
          });

          await Filesystem.mkdir({
            path: 'cs_scanner/QRCode',
            directory: Directory.Data,
            recursive: true,
          });

          await Filesystem.mkdir({
            path: 'cs_scanner/Signature',
            directory: Directory.Data,
            recursive: true,
          });

          await Filesystem.mkdir({
            path: 'cs_scanner/PhotoToPdf',
            directory: Directory.Data,
            recursive: true,
          });

          console.log('Default folders created successfully');
        } catch (error) {
          console.error('Error creating folders:', error);
        }
      } else {
        console.error('Permission not granted:', permissionResp.error);
      }
    } catch (error) {
      console.error('Error occurred during folder creation:', error);
    }
  }

  async createUserFolder(folderName: string) {
    try {
      const permissionResp: any = await this.checkPermission();
      if (permissionResp.status) {
        await Filesystem.mkdir({
          path: `cs_scanner/${folderName}`,
          directory: Directory.Data,
          recursive: true,
        })
          .then(async (resp: any) => {
            this.readBaseDir();
          })
          .catch((error: any) => {
            console.error('error', error);
          });
      } else {
        console.error('Permission not granted:', permissionResp.error);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  }

  async readBaseDir() {
    await Filesystem.readdir({
      path: 'cs_scanner',
      directory: Directory.Data,
    })
      .then(async (responce: any) => {
        if (responce.files && responce.files.length) {
          let allFolder = responce.files.filter(
            (file: any) => file.type === 'directory'
          );

        this.allFolder =  await this.sortByName(allFolder);
        console.log('allFolder',this.allFolder )
        }
      })
      .catch((error: any) => { });
  }

  async readFolder(folderName: any) {
    return new Promise(async (resolve, reject) => {
      await Filesystem.readdir({
        path: `cs_scanner/${folderName}`,
        directory: Directory.Data,
      })
        .then((responce: any) => {
          if (responce.files && responce.files.length) {
            let index = 0;
            const mapFile = async () => {
              if (index < responce.files.length) {
                responce.files[index]['msize'] = this.service.formatFileSize(responce.files[index]['size'])
                responce.files[index]['ext'] = this.service.getFileExtension(responce.files[index]['name'])
                responce.files[index]['nativeUrl'] = await Capacitor.convertFileSrc(responce.files[index]['uri'])
                index++;
                mapFile();
              } else {
                let files = await this.sortData(responce.files, 'ctime')
                console.log("responce.files", JSON.stringify(files));
                resolve(files)
              }
            }

            mapFile();
          } else {
            reject(responce)
          }
        })
        .catch((error: any) => {

          reject(error)
        });
    });

  }

  async sortData(array: any, key: any) {
    return array.sort((a: any, b: any) => {
      let x = a[key];
      let y = b[key];
      return x > y ? -1 : x < y ? 1 : 0;
    });
  }


  sortByName = (arr:any) => {
    return arr.sort((a:any, b:any) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });
};

  loadRecentFile() {
    let recentFile: any[] = [];
    let index = 0;
    console.log("allFolder",this.allFolder);
    
    const readFolders = async () => {
      if (index < this.allFolder.length) {
        console.log("Folder name",this.allFolder[index]['name']);
        
        this.readFolder(this.allFolder[index]['name']).then((resp: any) => {
          recentFile.push(...resp);
          console.log(this.allFolder[index]['name'] +" :::: Files ",resp);
          index++;
          readFolders();
        }).catch((error) => {
          console.log("error", JSON.stringify(error));
          index++;
          readFolders();
        })
      } else {
        let files = await this.sortData(recentFile, 'ctime');
        this.recentFile = JSON.parse(JSON.stringify(files)).slice(0, 10)
      }
    }
    readFolders()
  }



}
