import { Component, ElementRef, Input, OnInit } from '@angular/core';
import lottie from 'lottie-web';
@Component({
  selector: 'app-lottie-animation',
  templateUrl: './lottie-animation.component.html',
  styleUrls: ['./lottie-animation.component.scss'],
})
export class LottieAnimationComponent  implements OnInit {

  @Input() animationPath: string = '';
  
  constructor(private elementRef: ElementRef) {}
  
  ngOnInit() {}
  ngAfterViewInit() {
    lottie.loadAnimation({
      container: this.elementRef.nativeElement.querySelector('#lottieContainer'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: this.animationPath, 
    });
  }
}
