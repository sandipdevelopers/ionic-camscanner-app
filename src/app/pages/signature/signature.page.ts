import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { LoadingController, ModalController } from '@ionic/angular';
import { SaveFileModalComponent } from 'src/app/components/save-file-modal/save-file-modal.component';
import { CommonService } from 'src/app/services/common.service';
declare let SignaturePad: any;

@Component({
  selector: 'app-signature',
  templateUrl: './signature.page.html',
  styleUrls: ['./signature.page.scss'],
})
export class SignaturePage implements OnInit {
  backgroundColor: string = "";
  signatureCanvas: any;
  loadingIndicator: any;

  undoStack: any[] = [];
  constructor(
    private service: CommonService,
    private router: Router,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
  ) {
    this.initializeSignaturePad("#4169E1", "");
  }

  ngOnInit() { }

  private initializeSignaturePad(penColor: string, bgColor: string) {
    setTimeout(() => {
      const canvas = document.getElementById("signature-canvas");
      this.signatureCanvas = new SignaturePad(canvas, {
        penColor: penColor,
        backgroundColor: bgColor,
      });
    }, 100);
  }

  async goToMyDocument(folderName: any) {
    const queryParams = {
      folderName: folderName,
    };
    this.router.navigate(['/listing-doc'], { queryParams });
  }

  updatePenColor(color: string) {
    // this.clearCanvas();
    this.signatureCanvas.penColor = color;
  }

  undo() {
    var data = this.signatureCanvas.toData();
    if (data && data.length > 0) {
      const removed = data.pop();
      this.undoStack.push(removed);
      this.signatureCanvas.fromData(data);
    }
  }

  redo() {
    if (this.undoStack.length > 0) {
      const data = this.signatureCanvas.toData();
      data.push(this.undoStack.pop());
      this.signatureCanvas.fromData(data);
    }
  }

  updateBackgroundColor(color: string) {
    this.backgroundColor = color;
    this.signatureCanvas.backgroundColor = color;
    // const canvas = document.getElementById("signature-canvas");

    // this.signatureCanvas = new SignaturePad(canvas, {
    //   penColor: this.signatureCanvas.penColor,
    //   backgroundColor: color,
    //   dotSize: 5,
    // });
  }

  async showLoadingIndicator() {
    this.loadingIndicator = await this.loadingCtrl.create({
      message: 'Generating Signature...',
      showBackdrop: true,
    });
    await this.loadingIndicator.present();
  }

  async saveSignature() {
    if (this.signatureCanvas.isEmpty()) {
      this.service.showToastr('Please provide a signature first.');
      return;
    }

    const signatureData = this.signatureCanvas.toDataURL();

    let digit = await this.service.generateRandom5Digit();
    let defaultFile = `Signature-${digit}`;
    const modal = await this.modalCtrl.create({
      component: SaveFileModalComponent,
      backdropDismiss: false,
      breakpoints: [1],
      initialBreakpoint: 1,
      cssClass: 'save-file-modal',
      componentProps: {
        defaultFolder: 'Signature',
        defaultFile: defaultFile,
      },
    });

    modal.onDidDismiss().then(async (result: any) => {
      if (result.data) {
        let filePath = `cs_scanner/${result.data.folder}/${result.data.filename}.jpg`;
        this.showLoadingIndicator().then(async () => {
          await Filesystem.writeFile({
            path: filePath,
            data: signatureData,
            directory: Directory.Data,
          }).then((filess: any) => {
            this.service.showToastr('Save Successfully.');
            this.signatureCanvas.clear();
            this.undoStack = [];
            this.loadingIndicator.dismiss();
            this.goToMyDocument(result.data.folder);
          }).catch((error: any) => {
            this.signatureCanvas.clear();
            this.undoStack = [];
            this.loadingIndicator.dismiss();
            this.service.showToastr('Something went wrong.')
          });
        });
      }
    });

    return await modal.present();

  }

  clearCanvas() {
    this.undoStack = [];
    this.signatureCanvas.clear();
    this.undoStack = [];
  }

  ionViewDidLeave() {
    this.clearCanvas()
    if (this.loadingIndicator) {
      this.loadingIndicator.dismiss();
    }
  }


}
