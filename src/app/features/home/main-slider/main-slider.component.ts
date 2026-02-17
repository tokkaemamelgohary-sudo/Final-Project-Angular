import { Component, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-main-slider',
  imports: [CarouselModule],
  templateUrl: './main-slider.component.html',
  styleUrl: './main-slider.component.css',
})
export class MainSliderComponent implements OnInit {

  private readonly translateService = inject(TranslateService)




ngOnInit(): void {
  this.translateService.onLangChange.subscribe({
    next: (data) => {
this.mainSliderCustomOptions= {
...this.mainSliderCustomOptions   ,
 rtl: data.lang === 'ar' ? true : false,
}   
 }
  })
}







mainSliderCustomOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay:true,
    autoplayTimeout:2500,
    autoplayHoverPause:true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: false,
    rtl: this.translateService.getCurrentLang() === 'ar' ? true : false, // صححت الفاصلة



  };

}
