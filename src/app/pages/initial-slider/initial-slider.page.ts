import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-initial-slider',
  templateUrl: './initial-slider.page.html',
  styleUrls: ['./initial-slider.page.scss'],
})
export class InitialSliderPage implements OnInit {
  @ViewChild('swiper') swiperRef: ElementRef | any;
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

  sliderChanges() {
    this.swiperRef?.nativeElement.swiper.slideNext()
  }
  ngAfterViewInit() {
    console.log(this.swiperRef)
  }


  getStarted() {
    localStorage.setItem('isFristTime', JSON.stringify(1))
    this.router.navigate(['/home'])
  }
}
