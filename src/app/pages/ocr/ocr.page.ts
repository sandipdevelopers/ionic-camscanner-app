import { Component, OnInit } from '@angular/core';
import { ImagePicker, ImagePickerOptions } from '@awesome-cordova-plugins/image-picker/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { Clipboard } from '@capacitor/clipboard';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { DocumentScanner, ResponseType } from 'capacitor-document-scanner';
import { CommonService } from 'src/app/services/common.service';
import * as Tesseract from "tesseract.js";

@Component({
  selector: 'app-ocr',
  templateUrl: './ocr.page.html',
  styleUrls: ['./ocr.page.scss'],
})
export class OCRPage implements OnInit {
  languageList = [
    {
      "language": "Afrikaans",
      "language_code": "afr"
    },
    {
      "language": "amh",
      "language_code": "Amharic"
    },
    {
      "language": "Amharic",
      "language_code": "amh"
    },
    {
      "language": "Arabic",
      "language_code": "ara"
    },
    {
      "language": "Assamese",
      "language_code": "asm"
    },
    {
      "language": "Azerbaijani",
      "language_code": "aze"
    },
    {
      "language": "Azerbaijani - Cyrillic",
      "language_code": "aze_cyrl"
    },
    {
      "language": "Belarusian",
      "language_code": "bel"
    },
    {
      "language": "Bengali",
      "language_code": "ben"
    },
    {
      "language": "Tibetan",
      "language_code": "bod"
    },
    {
      "language": "Bosnian",
      "language_code": "bos"
    },
    {
      "language": "Bulgarian",
      "language_code": "bul"
    },
    {
      "language": "Catalan; Valencian",
      "language_code": "cat"
    },
    {
      "language": "Cebuano",
      "language_code": "ceb"
    },
    {
      "language": "Czech",
      "language_code": "ces"
    },
    {
      "language": "Chinese - Simplified",
      "language_code": "chi_sim"
    },
    {
      "language": "Chinese - Traditional",
      "language_code": "chi_tra"
    },
    {
      "language": "Cherokee",
      "language_code": "chr"
    },
    {
      "language": "Welsh",
      "language_code": "cym"
    },
    {
      "language": "Danish",
      "language_code": "dan"
    },
    {
      "language": "German",
      "language_code": "deu"
    },
    {
      "language": "Dzongkha",
      "language_code": "dzo"
    },
    {
      "language": "Greek, Modern (1453-)",
      "language_code": "ell"
    },
    {
      "language": "English",
      "language_code": "eng"
    },
    {
      "language": "English, Middle (1100-1500)",
      "language_code": "enm"
    },
    {
      "language": "Esperanto",
      "language_code": "epo"
    },
    {
      "language": "Estonian",
      "language_code": "est"
    },
    {
      "language": "Basque",
      "language_code": "eus"
    },
    {
      "language": "Persian",
      "language_code": "fas"
    },
    {
      "language": "Finnish",
      "language_code": "fin"
    },
    {
      "language": "French",
      "language_code": "fra"
    },
    {
      "language": "German Fraktur",
      "language_code": "frk"
    },
    {
      "language": "French, Middle (ca. 1400-1600)",
      "language_code": "frm"
    },
    {
      "language": "Irish",
      "language_code": "gle"
    },
    {
      "language": "Galician",
      "language_code": "glg"
    },
    {
      "language": "Greek, Ancient (-1453)",
      "language_code": "grc"
    },
    {
      "language": "Gujarati",
      "language_code": "guj"
    },
    {
      "language": "Haitian; Haitian Creole",
      "language_code": "hat"
    },
    {
      "language": "Hebrew",
      "language_code": "heb"
    },
    {
      "language": "Hindi",
      "language_code": "hin"
    },
    {
      "language": "Croatian",
      "language_code": "hrv"
    },
    {
      "language": "Hungarian",
      "language_code": "hun"
    },
    {
      "language": "Inuktitut",
      "language_code": "iku"
    },
    {
      "language": "Indonesian",
      "language_code": "ind"
    },
    {
      "language": "Icelandic",
      "language_code": "isl"
    },
    {
      "language": "Italian",
      "language_code": "ita"
    },
    {
      "language": "Italian - Old",
      "language_code": "ita_old"
    },
    {
      "language": "Javanese",
      "language_code": "jav"
    },
    {
      "language": "Japanese",
      "language_code": "jpn"
    },
    {
      "language": "Kannada",
      "language_code": "kan"
    },
    {
      "language": "Georgian",
      "language_code": "kat"
    },
    {
      "language": "Georgian - Old",
      "language_code": "kat_old"
    },
    {
      "language": "Kazakh",
      "language_code": "kaz"
    },
    {
      "language": "Central Khmer",
      "language_code": "khm"
    },
    {
      "language": "Kirghiz; Kyrgyz",
      "language_code": "kir"
    },
    {
      "language": "Korean",
      "language_code": "kor"
    },
    {
      "language": "Kurdish",
      "language_code": "kur"
    },
    {
      "language": "Lao",
      "language_code": "lao"
    },
    {
      "language": "Latin",
      "language_code": "lat"
    },
    {
      "language": "Latvian",
      "language_code": "lav"
    },
    {
      "language": "Lithuanian",
      "language_code": "lit"
    },
    {
      "language": "Malayalam",
      "language_code": "mal"
    },
    {
      "language": "Marathi",
      "language_code": "mar"
    },
    {
      "language": "Macedonian",
      "language_code": "mkd"
    },
    {
      "language": "Maltese",
      "language_code": "mlt"
    },
    {
      "language": "Malay",
      "language_code": "msa"
    },
    {
      "language": "Burmese",
      "language_code": "mya"
    },
    {
      "language": "Nepali",
      "language_code": "nep"
    },
    {
      "language": "Dutch; Flemish",
      "language_code": "nld"
    },
    {
      "language": "Norwegian",
      "language_code": "nor"
    },
    {
      "language": "Oriya",
      "language_code": "ori"
    },
    {
      "language": "Panjabi; Punjabi",
      "language_code": "pan"
    },
    {
      "language": "Polish",
      "language_code": "pol"
    },
    {
      "language": "Portuguese",
      "language_code": "por"
    },
    {
      "language": "Pushto; Pashto",
      "language_code": "pus"
    },
    {
      "language": "Romanian; Moldavian; Moldovan",
      "language_code": "ron"
    },
    {
      "language": "Russian",
      "language_code": "rus"
    },
    {
      "language": "Sanskrit",
      "language_code": "san"
    },
    {
      "language": "Sinhala; Sinhalese",
      "language_code": "sin"
    },
    {
      "language": "Slovak",
      "language_code": "slk"
    },
    {
      "language": "Slovenian",
      "language_code": "slv"
    },
    {
      "language": "Spanish; Castilian",
      "language_code": "spa"
    },
    {
      "language": "Spanish; Castilian - Old",
      "language_code": "spa_old"
    },
    {
      "language": "Albanian",
      "language_code": "sqi"
    },
    {
      "language": "Serbian",
      "language_code": "srp"
    },
    {
      "language": "Serbian - Latin",
      "language_code": "srp_latn"
    },
    {
      "language": "Swahili",
      "language_code": "swa"
    },
    {
      "language": "Swedish",
      "language_code": "swe"
    },
    {
      "language": "Syriac",
      "language_code": "syr"
    },
    {
      "language": "Tamil",
      "language_code": "tam"
    },
    {
      "language": "Telugu",
      "language_code": "tel"
    },
    {
      "language": "Tajik",
      "language_code": "tgk"
    },
    {
      "language": "Tagalog",
      "language_code": "tgl"
    },
    {
      "language": "Thai",
      "language_code": "tha"
    },
    {
      "language": "Tigrinya",
      "language_code": "tir"
    },
    {
      "language": "Turkish",
      "language_code": "tur"
    },
    {
      "language": "Uighur; Uyghur",
      "language_code": "uig"
    },
    {
      "language": "Ukrainian",
      "language_code": "ukr"
    },
    {
      "language": "Urdu",
      "language_code": "urd"
    },
    {
      "language": "Uzbek",
      "language_code": "uzb"
    },
    {
      "language": "Uzbek - Cyrillic",
      "language_code": "uzb_cyrl"
    },
    {
      "language": "Vietnamese",
      "language_code": "vie"
    },
    {
      "language": "Yiddish",
      "language_code": "yid"
    }
  ]
  output: any = '';
  seletedLanguage: any = ''
  savLoader: any
  constructor(
    public actionCtrl: ActionSheetController,
    public loader: LoadingController,
    public service: CommonService,
    public picker: ImagePicker,
    public socialSharing: SocialSharing,
  ) { }

  ngOnInit() {
  }
  clearScan() {
    this.output = '';
  }

  async showLoader() {
    this.savLoader = await this.loader.create({
      message: 'Please Wait...',
      showBackdrop: true,
    });
    await this.savLoader.present();
  }
  async uploadImage() {
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
                let image = 'data:image/jpeg;base64,' + images.scannedImages[0]
                this.showLoader().then(() => {
                  Tesseract.recognize(image, this.seletedLanguage)
                    .catch(err => {
                      this.savLoader.dismiss();
                    })
                    .then(async (result: any) => {
                      if (result['data']['text']) {
                        this.output = result['data']['text'];
                        
                      } else {
                        this.service.showToastr("No any result.");
                      }

                      this.savLoader.dismiss();
                    })
                });
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
                let image = 'data:image/jpeg;base64,' + results[0];

                this.showLoader().then(() => {
                  Tesseract.recognize(image, this.seletedLanguage)
                    .catch(err => {
                      this.savLoader.dismiss();
                    })
                    .then(async (result: any) => {
                      if (result['data']['text']) {
                        this.output = result['data']['text'];
                      } else {
                        this.service.showToastr("No any result.");
                      }

                      this.savLoader.dismiss();
                    })
                });
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

  async copyText() {
    if (this.output) {
      await Clipboard.write({
        string: this.output,
      });
      console.log('Text copied to clipboard!');
    }
  }

  async shareText() {
    if (this.output) {
      try {
        this.socialSharing.share(this.output, '', '', '')
      } catch (error) {
        this.service.showToastr('Something went wrong.')
        console.error('Error sharing file', error);
      }
    }
  }

  ionViewDidLeave() {
    this.clearScan();
    if (this.savLoader) {
      this.savLoader.dismiss();
    }
  }

}
