import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SavefileService } from 'src/app/services/savefile.service';

@Component({
  selector: 'app-save-file-modal',
  templateUrl: './save-file-modal.component.html',
  styleUrls: ['./save-file-modal.component.scss'],
})
export class SaveFileModalComponent implements OnInit {
  @Input() defaultFile: any = '';
  @Input() defaultFolder: any = 'Documents';
  seletedFolder: any = 'Documents';
  filename: any = '';

  constructor(
    public saveFile: SavefileService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    // You can initialize any logic needed here
    this.seletedFolder = this.defaultFolder
    this.filename = this.defaultFile
    console.log("seletedFolder", this.defaultFolder);

  }

  closeModal() {
    this.modalController.dismiss();
  }

  selectChanges(event: any) {
    this.seletedFolder = event.detail.value;
  }

  save() {
    const folder = this.seletedFolder ? this.seletedFolder : 'Documents';
    const filename = this.removeFileExtensionIfExists(this.filename ? this.filename : this.defaultFile);
    this.modalController.dismiss({ folder, filename });
  }

  removeFileExtensionIfExists(filename: any) {
    if (filename.includes('.')) {
      return filename.substring(0, filename.lastIndexOf('.'));
    }
    return filename;
  }
}
