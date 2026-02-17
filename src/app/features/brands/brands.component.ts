import { Component, inject, signal, WritableSignal } from '@angular/core';
import { BrandsService } from '../../core/services/brands/brands.service';
import { Brands } from '../../core/models/brands/brands.interface';

@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent {



  private readonly brandsService = inject(BrandsService);

  brandsList: WritableSignal<Brands[]> = signal<Brands[]>([]);

  ngOnInit(): void {
    this.brandsService.getAllBrands().subscribe({
      next: (res)=>{
this.brandsList.set(res.data);

console.log( this.brandsList() );
      },

      error: (err)=>{
        console.log(err);
      },


    });

}
}
