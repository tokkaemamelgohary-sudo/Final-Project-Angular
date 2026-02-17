import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CategorieaService } from '../../../core/services/categories/categoriea.service';
import { Categories } from '../../../core/models/categories/categories.interface';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-popular-categories',
  imports: [CarouselModule],
  templateUrl: './popular-categories.component.html',
  styleUrl: './popular-categories.component.css',
})
export class PopularCategoriesComponent implements OnInit {

  private readonly translateService = inject(TranslateService)

  private readonly categorieaService = inject(CategorieaService)

 
categoriesList:WritableSignal<Categories[]> = signal<Categories[]>([])

ngOnInit(): void { 
 this.gerAllCategoriesData();
 this.onLanChange();
}


gerAllCategoriesData():void{ 
this.categorieaService.getAllCategories().subscribe({
  next: (res)=>{
    this.categoriesList.set(res.data);
  },
error: (err)=>{
      console.log(err);
},
}); 
}



onLanChange():void{
  this.translateService.onLangChange.subscribe({
    next: (data) => {
this.categoriesCustomOptions = {
...this.categoriesCustomOptions   ,
 rtl: data.lang === 'ar' ? true : false,
}   
 }
  })
}


  categoriesCustomOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    autoplayTimeout: 3500,
    autoplayHoverPause: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },

      1100: {
        items: 5,
      },

      1200: {
        items: 6,
      }
    },
    nav: false,

rtl: this.translateService.getCurrentLang() === 'ar' ? true : false, // صححت الفاصلة




  }




}
